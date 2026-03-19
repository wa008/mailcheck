import { DnsResult } from '../types';

export const validateDns = async (domain: string): Promise<DnsResult> => {
  try {
    const [aResults, aaaaResults] = await Promise.all([
      queryDns(domain, 'A'),
      queryDns(domain, 'AAAA')
    ]);

    const hasA = aResults.Answer && aResults.Answer.length > 0;
    const hasAAAA = aaaaResults.Answer && aaaaResults.Answer.length > 0;

    return {
      valid: hasA || hasAAAA,
      hasARecord: !!hasA,
      hasAAAARecord: !!hasAAAA
    };
  } catch (error) {
    return {
      valid: false,
      hasARecord: false,
      hasAAAARecord: false,
      error: `DNS query failed: ${error}`
    };
  }
};

async function queryDns(name: string, type: string) {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/dns-json'
    }
  });
  return response.json();
}
