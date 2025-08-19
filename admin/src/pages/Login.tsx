import React, { useState } from 'react';
import { Card, Input, Button, Form, Typography } from 'antd';
import { useLogin } from '@refinedev/core';

export default function LoginPage(){
  const { mutate: login, isLoading } = useLogin();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',background:'linear-gradient(120deg,#f7ffff,#e6faf9)'}}>
      <Card style={{width:360,borderTop:'4px solid #008e8c'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
          <img src="/admin/favicon.svg" width={28}/>
          <Typography.Title level={4} style={{margin:0,color:'#008e8c'}}>Rejuvenators Admin</Typography.Title>
        </div>
        <Form layout="vertical" onFinish={()=>login({ email, password })}>
          <Form.Item label="Email" required><Input value={email} onChange={e=>setEmail(e.target.value)}/></Form.Item>
          <Form.Item label="Password" required><Input.Password value={password} onChange={e=>setPassword(e.target.value)}/></Form.Item>
          <Button type="primary" htmlType="submit" block loading={isLoading}>Sign in</Button>
        </Form>
        <div style={{marginTop:12,textAlign:'right'}}><a href="/admin/forgot-password">Forgot password?</a></div>
      </Card>
    </div>
  );
}
