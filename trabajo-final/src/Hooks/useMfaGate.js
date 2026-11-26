import { useCallback, useEffect, useState } from 'react';
import {
  enrollTotp,
  getAssuranceLevel,
  listFactors,
  removeUnverifiedFactors,
  verifyTotp,
} from '../Services/mfaService';

const CODE_LENGTH = 6;

const toQrSrc = (qr) => (qr.startsWith('data:') ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`);

export const useMfaGate = () => {
  const [status, setStatus] = useState('checking');
  const [factorId, setFactorId] = useState(null);
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const prepare = useCallback(async () => {
    try {
      const { currentLevel } = await getAssuranceLevel();
      if (currentLevel === 'aal2') {
        setStatus('ok');
        return;
      }
      const { totp = [] } = await listFactors();
      const verified = totp.find((factor) => factor.status === 'verified');
      if (verified) {
        setFactorId(verified.id);
        setStatus('verify');
        return;
      }
      await removeUnverifiedFactors();
      const enrolled = await enrollTotp();
      setFactorId(enrolled.id);
      setSetup({ qr: toQrSrc(enrolled.totp.qr_code), secret: enrolled.totp.secret });
      setStatus('enroll');
    } catch (failure) {
      setError(failure.message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  const changeCode = (value) => setCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH));

  const submit = async (event) => {
    event.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError(`Escribe los ${CODE_LENGTH} dígitos que muestra Google Authenticator`);
      return;
    }
    setVerifying(true);
    setError('');
    try {
      await verifyTotp(factorId, code);
      setSetup(null);
      setStatus('ok');
    } catch {
      setError('Código incorrecto o vencido. Escribe el código que aparece ahora en la app.');
      setCode('');
    } finally {
      setVerifying(false);
    }
  };

  return { status, setup, code, changeCode, submit, error, verifying, retry: prepare, codeLength: CODE_LENGTH };
};
