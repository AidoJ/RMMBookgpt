import { getSupabaseServiceClient } from './_helpers.js';
export async function handler(event){
  if(event.httpMethod!=='GET') return { statusCode:405, body:'Method not allowed' };
  const supabase=getSupabaseServiceClient();
  const { data, error } = await supabase.from('bookings').select('id, booking_time, status, service_id');
  if(error) return { statusCode:500, body:error.message };
  return { statusCode:200, body: JSON.stringify(data) };
}
