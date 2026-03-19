import { SyntaxResult } from '../types';

export const validateSyntax = (email: string): SyntaxResult => {
  if (!email || typeof email !== 'string') {
    return { valid: false, reason: "Invalid input" };
  }

  // Length limits
  if (email.length > 254) {
    return { valid: false, reason: "Email is too long" };
  }

  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return { valid: false, reason: "Missing local part or domain" };
  }

  if (local.length > 64) {
    return { valid: false, reason: "Local part is too long" };
  }

  // Regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: "Invalid format" };
  }

  return { valid: true, reason: "Valid syntax" };
};
