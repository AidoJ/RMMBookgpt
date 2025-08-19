import { getSupabaseServiceClient } from './_helpers.js';
import bcrypt from 'bcryptjs';

export async function handler(event){
  if(event.httpMethod!=='POST') return { statusCode:405, body:'Method not allowed' };
  const { token, password, uid } = JSON.parse(event.body||'{}');
  if(!token||!password||!uid) return { statusCode:400, body:'Missing fields' };

  const supabase=getSupabaseServiceClient();
  const { data: setting } = await supabase.from('system_settings').select('value').eq('key','pwdreset_'+uid).maybeSingle();
  if(!setting) return { statusCode:400, body:'Invalid token' };
  let parsed; try{ parsed = JSON.parse(setting.value); }catch{ return { statusCode:400, body:'Invalid token' }; }
  if(parsed.token!==token) return { statusCode:400, body:'Invalid token' };
  if(new Date(parsed.expires).getTime() < Date.now()) return { statusCode:400, body:'Token expired' };

  const hash = await bcrypt.hash(password, 10);
  const { error } = await supabase.from('admin_users').update({ password: hash }).eq('id', uid);
  if(error) return { statusCode:500, body:error.message };
  await supabase.from('system_settings').delete().eq('key','pwdreset_'+uid);
  return { statusCode:200, body: JSON.stringify({ ok:true }) };
}
