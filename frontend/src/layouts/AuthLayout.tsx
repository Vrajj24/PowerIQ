import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Brand from '../components/Brand';
import './AuthLayout.css';

export default function AuthLayout({ children, mode }: { children: ReactNode; mode: 'login' | 'register' }) {
  const isLogin = mode === 'login';
  return <div className={`auth-layout auth-refined auth-${mode}`}>
    <aside className="auth-story">
      <Brand />
      <div className="auth-story-copy">
        <p className="theme-eyebrow">YOUR HOME. YOUR ENERGY. YOUR CALL.</p>
        <h1>GOOD ENERGY.<br /><span>STARTS HERE.</span></h1>
        <p className="auth-supporting-copy">A little more awareness.<br />A little less waste.<br />A better relationship with your energy.</p>
      </div>
      <Link to="/" className="auth-back"><ArrowLeft size={16} /> Back to the overview</Link>
    </aside>
    <main className="auth-main"><div className="auth-form-content"><p className="theme-eyebrow">{isLogin ? '01 / WELCOME BACK' : '01 / A FRESH START'}</p>{children}</div><p className="auth-bottom">Know your power. Make it count. <ArrowUpRight size={14} aria-hidden="true" /></p></main>
  </div>;
}
