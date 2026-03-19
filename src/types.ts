export interface VerificationResult {
  email: string;
  valid: boolean;
  score: number;
  checks: {
    syntax: SyntaxResult;
    dns: DnsResult;
    mx: MxResult;
    disposable: DisposableResult;
    roleBased: RoleResult;
    freeProvider: FreeProviderResult;
  };
  timestamp: string;
}

export interface SyntaxResult {
  valid: boolean;
  reason: string;
}

export interface DnsResult {
  valid: boolean;
  hasARecord: boolean;
  hasAAAARecord: boolean;
  error?: string;
}

export interface MxResult {
  valid: boolean;
  records: string[];
  error?: string;
}

export interface DisposableResult {
  isDisposable: boolean;
}

export interface RoleResult {
  isRole: boolean;
  role?: string;
}

export interface FreeProviderResult {
  isFree: boolean;
  provider?: string;
}
