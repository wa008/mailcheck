import { FreeProviderResult } from '../types';
import { freeProviders } from '../data/free-providers';

const domainSet = new Set(freeProviders);

export const validateFreeProvider = (domain: string): FreeProviderResult => {
  const d = domain.toLowerCase();
  if (domainSet.has(d)) {
    return {
      isFree: true,
      provider: d
    };
  }
  return { isFree: false };
};
