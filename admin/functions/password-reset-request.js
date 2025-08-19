import { getSupabaseServiceClient } from './_helpers.js';

export async function handler(event){
  if(event.httpMethod!=='POST') return { statusCode:405, body:'Method not allowed' };
  const { email } = JSON.parse(event.body||'{}');
  if(!email) return { statusCode:400, body:'Missing email' };

  const supabase=getSupabaseServiceClient();
  const { data:user } = await supabase.from('admin_users').select('id,email,first_name,last_name,is_active').eq('email', email).maybeSingle();
  if(!user || !user.is_active) return { statusCode:200, body: JSON.stringify({ ok:true }) };

  const token = Math.random().toString(36).slice(2)+Math.random().toString(36).slice(2);
  const expires = new Date(Date.now()+1000*60*30).toISOString(); // 30 min
  await supabase.from('system_settings').upsert({ key:'pwdreset_'+user.id, value: JSON.stringify({ token, expires }) }, { onConflict:'key' });

  const templateId = process.env.EMAILJS_TEMPLATE_ID_PASSWORD_RESET || process.env.VITE_EMAILJS_TEMPLATE_ID;
  const resetUrl = `${process.env.APP_BASE_URL}/admin/reset-password?token=${encodeURIComponent(token)}&uid=${user.id}`;

  try{
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.EMAILJS_PUBLIC_KEY || process.env.VITE_EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: { to_email:user.email, to_name:user.first_name||'Admin', reset_link: resetUrl, brand_color:'#008e8c', brand_name:'Rejuvenators Admin' }
      })
    });
  }catch{}

  return { statusCode:200, body: JSON.stringify({ ok:true }) };
}
