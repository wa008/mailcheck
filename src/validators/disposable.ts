import { DisposableResult } from '../types';
import { disposableDomains } from '../data/disposable-domains';

const domainSet = new Set(disposableDomains);

export const validateDisposable = (domain: string): DisposableResult => {
  return {
    isDisposable: domainSet.has(domain.toLowerCase())
  };
};
