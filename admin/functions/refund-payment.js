import Stripe from 'stripe';
import { getSupabaseServiceClient, requireRole } from './_helpers.js';
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);
export async function handler(event){
  if(event.httpMethod!=='POST') return { statusCode:405, body:'Method not allowed' };
  const auth = requireRole(event, ['super_admin']); if(!auth.ok) return { statusCode:auth.statusCode, body:auth.body };
  const { payment_intent_id, amount, reason } = JSON.parse(event.body||'{}');
  if(!payment_intent_id) return { statusCode:400, body:'Missing payment_intent_id' };
  try{
    const ref = await stripe.refunds.create({ payment_intent: payment_intent_id, amount: typeof amount==='number'? Math.round(amount*100):undefined, reason: reason||undefined });
    const supabase=getSupabaseServiceClient();
    const { data: pay } = await supabase.from('payments').select('id').eq('stripe_payment_intent_id', payment_intent_id).maybeSingle();
    if(pay){ await supabase.from('refunds').insert({ payments_id:pay.id, stripe_refund_id:ref.id, amount:(ref.amount||0)/100.0, status:ref.status, reason:reason||null }); }
    return { statusCode:200, body: JSON.stringify(ref) };
  }catch(e){ return { statusCode:500, body:e.message }; }
}
