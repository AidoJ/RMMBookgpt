import { getSupabaseServiceClient, signToken } from './_helpers.js';
import bcrypt from 'bcryptjs';

export async function handler(event){
  if(event.httpMethod!=='POST') return { statusCode:405, body:'Method not allowed' };
  const { email, password } = JSON.parse(event.body||'{}');
  if(!email||!password) return { statusCode:400, body:'Missing fields' };
  const supabase=getSupabaseServiceClient();
  const { data, error } = await supabase.from('admin_users').select('id,email,password,first_name,last_name,role,is_active').eq('email', email).maybeSingle();
  if(error||!data) return { statusCode:401, body:'Invalid credentials' };
  if(!data.is_active) return { statusCode:403, body:'Account inactive' };
  const ok = await bcrypt.compare(password, data.password);
  if(!ok) return { statusCode:401, body:'Invalid credentials' };
  const token = signToken(data);
  const user = { id:data.id,email:data.email,first_name:data.first_name,last_name:data.last_name,role:data.role };
  return { statusCode:200, body: JSON.stringify({ token, user }) };
}
