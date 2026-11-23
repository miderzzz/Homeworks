const logos = import.meta.glob('../assets/leagues/*.webp', { eager: true, import: 'default' });

const bySlug = Object.fromEntries(
  Object.entries(logos).map(([path, url]) => [path.split('/').pop().replace('.webp', ''), url]),
);

export const leagueLogo = (slug) => bySlug[slug] ?? null;
