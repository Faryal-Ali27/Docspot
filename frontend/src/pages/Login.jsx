import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { showToast } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';
  const message = location.state?.message;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!email || !password) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    if (!isLogin) {
      if (!name) {
        showToast('Please provide your name.', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters long.', 'error');
        return;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          showToast('Welcome back to DocSpot!', 'success');
          navigate(from, { replace: true });
        } else {
          showToast(res.message, 'error');
        }
      } else {
        const res = await register(name, email, password);
        if (res.success) {
          showToast('Registration successful! Welcome to DocSpot.', 'success');
          navigate(from, { replace: true });
        } else {
          showToast(res.message, 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '40px 32px', textAlign: 'center' }}>
        
        {message && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderLeft: '4px solid hsl(0, 84%, 60%)',
            color: 'hsl(0, 84%, 60%)',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '24px',
            fontSize: '0.88rem',
            textAlign: 'left'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '20px' }}>
          {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
        </div>

        <h2 style={{ marginBottom: '8px' }}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
          {isLogin ? 'Sign in to schedule and manage your medical consultations.' : 'Sign up to register and book healthcare appointments.'}
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="John Doe"
                  style={{ paddingLeft: '40px' }}
                />
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="you@example.com"
                style={{ paddingLeft: '40px' }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="••••••••"
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', padding: '0' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="••••••••"
                  style={{ paddingLeft: '40px' }}
                />
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            {loading ? (
              <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', borderTopColor: 'var(--primary)' }}></span>
            ) : (
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '0.9rem' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
              }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', padding: '0', fontSize: '0.9rem' }}
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}
