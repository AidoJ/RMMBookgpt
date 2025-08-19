import React from 'react';
import { Refine } from '@refinedev/core';
import { ThemedLayoutV2 } from '@refinedev/antd';
import '@refinedev/antd/dist/reset.css';
import { notificationProvider, RefineThemes } from '@refinedev/antd';
import { BrowserRouter, Route, Routes, Outlet, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { authProvider } from './auth/authProvider';
import Dashboard from './pages/dashboard'; import Bookings from './pages/bookings'; import Calendar from './pages/calendar';
import Therapists from './pages/therapists'; import Customers from './pages/customers'; import Services from './pages/services';
import Reports from './pages/reports'; import Users from './pages/users'; import Activity from './pages/activity'; import Settings from './pages/settings';
const LoginPage = React.lazy(()=>import('./pages/Login'));
const ResetRequestPage = React.lazy(()=>import('./pages/ResetRequest'));
const ResetConfirmPage = React.lazy(()=>import('./pages/ResetConfirm'));
const theme = { ...RefineThemes.Blue, token: { colorPrimary: '#008e8c' } };
function RequireAuth({ children }){ const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null; return token ? <>{children}</> : <Navigate to="/login" replace />; }
export default function App(){
  return (<BrowserRouter basename="/admin">
    <ConfigProvider theme={theme}>
      <Refine authProvider={authProvider} notificationProvider={notificationProvider} resources={[
        { name:'dashboard', list:'/' },{ name:'bookings', list:'/bookings' },{ name:'calendar', list:'/calendar' },
        { name:'therapists', list:'/therapists' },{ name:'customers', list:'/customers' },{ name:'services', list:'/services' },
        { name:'reports', list:'/reports' },{ name:'payments', list:'/payments' },{ name:'users', list:'/users' },
        { name:'activity', list:'/activity' },{ name:'settings', list:'/settings' },
      ]}>
        <Routes>
          <Route element={<Layout/>}>
            <Route index element={<RequireAuth><Dashboard/></RequireAuth>} />
            <Route path="bookings" element={<RequireAuth><Bookings/></RequireAuth>} />
            <Route path="calendar" element={<RequireAuth><Calendar/></RequireAuth>} />
            <Route path="therapists" element={<RequireAuth><Therapists/></RequireAuth>} />
            <Route path="customers" element={<RequireAuth><Customers/></RequireAuth>} />
            <Route path="services" element={<RequireAuth><Services/></RequireAuth>} />
            <Route path="reports" element={<RequireAuth><Reports/></RequireAuth>} />
            <Route path="users" element={<RequireAuth><Users/></RequireAuth>} />
            <Route path="activity" element={<RequireAuth><Activity/></RequireAuth>} />
            <Route path="settings" element={<RequireAuth><Settings/></RequireAuth>} />
          </Route>
          <Route path="/login" element={<React.Suspense fallback={null}><LoginPage/></React.Suspense>} />
          <Route path="/reset-password" element={<React.Suspense fallback={null}><ResetConfirmPage/></React.Suspense>} />
          <Route path="/forgot-password" element={<React.Suspense fallback={null}><ResetRequestPage/></React.Suspense>} />
        </Routes>
      </Refine>
    </ConfigProvider>
  </BrowserRouter>);
}
function Layout(){ return (<ThemedLayoutV2 Title={() => (<div style={{display:'flex',alignItems:'center',gap:8}}><img src="/admin/favicon.svg" alt="logo" style={{width:24,height:24}}/><span style={{color:'#008e8c',fontWeight:700}}>Rejuvenators Admin</span></div>)}><Outlet/></ThemedLayoutV2>); }
