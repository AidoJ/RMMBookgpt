import React, { useState } from 'react';
import { Card, Input, Button, Form, Typography, message } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function ResetConfirmPage(){
  const [params] = useSearchParams(); const navigate=useNavigate();
  const token=params.get('token')||''; const uid=params.get('uid')||'';
  const [password,setPassword]=useState(''); const [loading,setLoading]=useState(false);
  async function submit(){
    setLoading(true);
    const r=await fetch('/.netlify/functions/password-reset-confirm',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token, password, uid })});
    setLoading(false);
    if(r.ok){ message.success('Password updated. Please login.'); navigate('/admin/login'); }
    else message.error('Invalid or expired token.');
  }
  return (<div style={{display:'grid',placeItems:'center',height:'100vh',background:'linear-gradient(120deg,#f7ffff,#e6faf9)'}}>
    <Card style={{width:360,borderTop:'4px solid #008e8c'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
        <img src="/admin/favicon.svg" width={28}/>
        <Typography.Title level={4} style={{margin:0,color:'#008e8c'}}>Set New Password</Typography.Title>
      </div>
      <Form layout="vertical" onFinish={submit}>
        <Form.Item label="New Password" required><Input.Password value={password} onChange={e=>setPassword(e.target.value)}/></Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>Update Password</Button>
      </Form>
    </Card>
  </div>);
}
