import { MxResult } from '../types';

export const validateMx = async (domain: string): Promise<MxResult> => {
  try {
    const mxResults = await queryDns(domain, 'MX');
    
    if (mxResults.Answer && mxResults.Answer.length > 0) {
      const records = mxResults.Answer.map((a: any) => a.data);
      return {
        valid: true,
        records: records
      };
    }

    return {
      valid: false,
      records: []
    };
  } catch (error) {
    return {
      valid: false,
      records: [],
      error: `MX record query failed: ${error}`
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
