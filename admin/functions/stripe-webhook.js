import Stripe from 'stripe';
import { getSupabaseServiceClient } from './_helpers.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export async function handler(event){
  const sig = event.headers['stripe-signature']; let evt;
  try{ evt = stripe.webhooks.constructEvent(event.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch(err){ return { statusCode:400, body:`Webhook Error: ${err.message}` }; }
  const supabase=getSupabaseServiceClient();

  if(evt.type==='payment_intent.succeeded'){
    const pi = evt.data.object;
    const bookingId = pi.metadata?.booking_id || null;
    const amount = (pi.amount||pi.amount_received||0)/100.0;
    const currency = pi.currency;
    const receipt_url = pi?.charges?.data?.[0]?.receipt_url || null;
    const method = pi?.charges?.data?.[0]?.payment_method_details?.type || null;
    await supabase.from('payments').upsert({
      stripe_payment_intent_id:pi.id, booking_id:bookingId, amount_total:amount, amount_captured:amount, currency, status:'succeeded', receipt_url, stripe_payment_method:method, updated_at:new Date().toISOString()
    }, { onConflict:'stripe_payment_intent_id' });
    if(bookingId) await supabase.from('bookings').update({ payment_status:'paid' }).eq('id', bookingId);
  }

  if(evt.type==='payment_intent.payment_failed'){
    const pi = evt.data.object;
    await supabase.from('payments').upsert({ stripe_payment_intent_id:pi.id, status:'failed', updated_at:new Date().toISOString() }, { onConflict:'stripe_payment_intent_id' });
  }

  if(evt.type==='charge.refunded' || evt.type==='refund.updated'){
    const ch = evt.data.object;
    const pi = typeof ch.payment_intent==='string' ? ch.payment_intent : ch.payment_intent?.id;
    const amount_refunded = (ch.amount_refunded||0)/100.0;
    const { data: pay } = await supabase.from('payments').select('id').eq('stripe_payment_intent_id', pi).maybeSingle();
    if(pay){ await supabase.from('payments').update({ amount_refunded, status:'refunded', updated_at:new Date().toISOString() }).eq('id', pay.id); }
  }

  await supabase.from('payment_events').insert({ stripe_event_id:evt.id, type:evt.type, payload:evt });
  return { statusCode:200, body: JSON.stringify({ received:true }) };
}
