import React, { useState } from 'react';
import { Card, Input, Button, Form, Typography, message } from 'antd';

export default function ResetRequestPage(){
  const [email,setEmail]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(){
    setLoading(true);
    const r=await fetch('/.netlify/functions/password-reset-request',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email })});
    setLoading(false);
    if(r.ok) message.success('If the email exists, a reset link has been sent.');
    else message.error('Something went wrong.');
  }
  return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',background:'linear-gradient(120deg,#f7ffff,#e6faf9)'}}>
      <Card style={{width:360,borderTop:'4px solid #008e8c'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
          <img src="/admin/favicon.svg" width={28}/>
          <Typography.Title level={4} style={{margin:0,color:'#008e8c'}}>Password Reset</Typography.Title>
        </div>
        <Form layout="vertical" onFinish={submit}>
          <Form.Item label="Email" required><Input value={email} onChange={e=>setEmail(e.target.value)}/></Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>Send reset link</Button>
        </Form>
      </Card>
    </div>
  );
}
