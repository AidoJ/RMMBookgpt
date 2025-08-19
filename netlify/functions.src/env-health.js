export async function handler() {
  const required = {
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!process.env.VITE_SUPABASE_ANON_KEY,
  };
  const missing = Object.entries(required).filter(([,v])=>!v).map(([k])=>k);
  return { statusCode: missing.length? 500:200, body: JSON.stringify({ ok: missing.length===0, required, missing }) };
}
