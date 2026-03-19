import { RoleResult } from '../types';
import { rolePrefixes } from '../data/role-prefixes';

const prefixSet = new Set(rolePrefixes);

export const validateRole = (email: string): RoleResult => {
  const local = email.split('@')[0].toLowerCase();
  
  if (prefixSet.has(local)) {
    return {
      isRole: true,
      role: local
    };
  }

  return { isRole: false };
};
