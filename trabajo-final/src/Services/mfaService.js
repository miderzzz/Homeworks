import { getClient, unwrap } from '../Helpers/supabaseClient';

const mfa = () => getClient().auth.mfa;

export const getAssuranceLevel = async () => unwrap(await mfa().getAuthenticatorAssuranceLevel());

export const listFactors = async () => unwrap(await mfa().listFactors());

export const removeUnverifiedFactors = async () => {
  const { all = [] } = await listFactors();
  const pending = all.filter((factor) => factor.factor_type === 'totp' && factor.status !== 'verified');
  await Promise.all(pending.map((factor) => mfa().unenroll({ factorId: factor.id })));
};

export const enrollTotp = async () =>
  unwrap(
    await mfa().enroll({
      factorType: 'totp',
      issuer: 'Sport Champion',
      friendlyName: `Sport Champion ${Date.now()}`,
    }),
  );

export const verifyTotp = async (factorId, code) => unwrap(await mfa().challengeAndVerify({ factorId, code }));
