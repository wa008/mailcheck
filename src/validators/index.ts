import { VerificationResult } from '../types';
import { validateSyntax } from './syntax';
import { validateDns } from './dns';
import { validateMx } from './mx';
import { validateDisposable } from './disposable';
import { validateRole } from './role';
import { validateFreeProvider } from './free-provider';

export const verifyEmail = async (email: string): Promise<VerificationResult> => {
  const timestamp = new Date().toISOString();
  
  // Syntax check (L1)
  const syntax = validateSyntax(email);
  if (!syntax.valid) {
    return {
      email,
      valid: false,
      score: 0,
      checks: {
        syntax,
        dns: { valid: false, hasARecord: false, hasAAAARecord: false },
        mx: { valid: false, records: [] },
        disposable: { isDisposable: false },
        roleBased: { isRole: false },
        freeProvider: { isFree: false }
      },
      timestamp
    };
  }

  const domain = email.split('@')[1];

  // Parallel checks (L2-L6)
  const [dns, mx, disposable, roleBased, freeProvider] = await Promise.all([
    validateDns(domain),
    validateMx(domain),
    validateDisposable(domain),
    validateRole(email),
    validateFreeProvider(domain)
  ]);

  // Scoring algorithm (评分算法)
  let score = 0;
  
  if (syntax.valid) {
    // If syntax is valid, we start scoring from a base
    score += 0; // Baseline
    
    // DNS check (L2): +25
    if (dns.valid) score += 25;
    else score -= 25; // Critical failure

    // MX check (L3): +35
    if (mx.valid) score += 35;
    else score -= 35; // Critical failure for mail delivery

    // Disposable check (L4): +20 if not disposable
    if (!disposable.isDisposable) score += 20;
    else score -= 20;

    // Role-based check (L5): -10 if role-based (business impact)
    if (!roleBased.isRole) score += 10;
    else score -= 10;

    // Free provider check (L6): -5 if free (quality score)
    if (!freeProvider.isFree) score += 10;
    else score -= 5;
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // Overall validity logic: Need Syntax, DNS and MX to be "Truly Valid"
  const isValid = syntax.valid && dns.valid && mx.valid && !disposable.isDisposable;

  return {
    email,
    valid: isValid,
    score,
    checks: {
      syntax,
      dns,
      mx,
      disposable,
      roleBased,
      freeProvider
    },
    timestamp
  };
};
