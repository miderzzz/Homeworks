import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_AGE_MS = 15 * 60 * 1000;

const adminKey = () => {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  const keys = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}");
  return keys.default ?? Object.values(keys)[0];
};

const phone = (digits = "") =>
  digits.startsWith("57") && digits.length === 12
    ? `+57 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
    : `+${digits}`;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const money = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);

const when = (value) =>
  new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Bogota",
  }).format(new Date(value));

const escape = (text = "") =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

const buildHtml = (order, settings) => {
  const rows = order.order_items
    .map((item) => {
      const variant = item.product_variants ?? {};
      const product = variant.products ?? {};
      const team = product.categories?.name ?? "";
      return `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${escape(team)} · ${escape(product.name ?? "Uniforme")}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${escape(variant.size ?? "")}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${money(item.unit_price * item.quantity)}</td>
      </tr>`;
    })
    .join("");

  const expires = new Date(
    new Date(order.created_at).getTime() +
      settings.payment_window_hours * 3600 * 1000,
  );

  return `<div style="font-family:Arial,sans-serif;color:#1c1c1c;max-width:600px">
    <h2 style="color:#0b3d2e;margin-bottom:4px">Nuevo pedido ${escape(order.order_code)}</h2>
    <p style="margin-top:0;color:#6b6b6b">${when(order.created_at)} · pendiente de pago hasta ${when(expires)}</p>
    <h3 style="margin-bottom:4px">Cliente</h3>
    <p style="margin-top:0">
      ${escape(order.customer_name)}<br>
      ${escape(order.customer_email)}<br>
      Celular: ${escape(phone(order.customer_phone))}<br>
      Envío: ${escape(order.shipping_address)}
    </p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <thead>
        <tr style="background:#f4f5f2">
          <th style="padding:6px 8px;text-align:left">Uniforme</th>
          <th style="padding:6px 8px">Talla</th>
          <th style="padding:6px 8px">Cant.</th>
          <th style="padding:6px 8px;text-align:right">Valor</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;margin:12px 0 0">Subtotal: ${money(order.subtotal)}</p>
    ${order.discount_amount > 0 ? `<p style="text-align:right;margin:4px 0;color:#1e8449">Descuento ${escape(order.discount_code)}: −${money(order.discount_amount)}</p>` : ""}
    <p style="text-align:right;margin:4px 0;font-size:18px"><strong>Total: ${money(order.total)}</strong></p>
    <p style="color:#6b6b6b;font-size:13px">Verifica la transferencia Bre-B a ${escape(settings.breb_key)} y confirma el pago en el panel de administración, sección Pedidos.</p>
  </div>`;
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS")
    return new Response("ok", { headers: CORS });

  try {
    const { order_code: code } = await request.json();
    if (!/^[A-Z]{3}-[A-Z0-9]{6}$/.test(code ?? ""))
      return json({ error: "Código de pedido inválido" }, 400);

    const key = adminKey();
    if (!key)
      return json(
        { error: "La función no tiene llave secreta de Supabase" },
        500,
      );
    const db = createClient(Deno.env.get("SUPABASE_URL"), key);

    const { data: order, error } = await db
      .from("orders")
      .select(
        "*, order_items(quantity, unit_price, product_variants(size, products(name, categories(name))))",
      )
      .eq("order_code", code)
      .single();

    if (error || !order)
      return json({ error: error?.message ?? "Pedido no encontrado" }, 404);
    if (order.notified_at) return json({ ok: true, alreadySent: true });
    if (Date.now() - new Date(order.created_at).getTime() > MAX_AGE_MS)
      return json({ error: "Pedido antiguo" }, 400);

    const { data: settings } = await db
      .from("store_settings")
      .select("*")
      .eq("id", 1)
      .single();
    if (!settings?.notify_email)
      return json({ error: "No hay correo de avisos configurado" }, 400);
    if (!Deno.env.get("RESEND_API_KEY")) {
      await db
        .from("orders")
        .update({ notify_error: "Falta el secreto RESEND_API_KEY en Supabase" })
        .eq("id", order.id);
      return json({ error: "Falta RESEND_API_KEY" }, 500);
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Sport Champion <onboarding@resend.dev>",
        to: [settings.notify_email],
        subject: `Nuevo pedido ${order.order_code} · ${money(order.total)}`,
        html: buildHtml(order, settings),
      }),
    });

    if (!response.ok) {
      const reason = (await response.text()).slice(0, 300);
      await db
        .from("orders")
        .update({ notify_error: reason })
        .eq("id", order.id);
      return json({ error: reason }, 502);
    }

    await db
      .from("orders")
      .update({ notified_at: new Date().toISOString(), notify_error: null })
      .eq("id", order.id);
    return json({ ok: true });
  } catch (failure) {
    return json({ error: failure.message }, 500);
  }
});
