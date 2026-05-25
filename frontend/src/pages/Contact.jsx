import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function Contact() {
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    let errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject is required';
    if (!formData.message.trim()) errs.message = 'Message is required';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct validation errors', 'error');
      return;
    }

    setSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      showToast('Thank you for contacting DocSpot. We will get back to you shortly!', 'success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <h2>Contact DocSpot Clinic</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Have a question about our booking services, diagnostic facilities, or specialists? Get in touch with our medical support desk.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '40px',
        textAlign: 'left'
      }}>
        
        {/* Info Column */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Clinic Information</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Our dedicated staff and medical board are available to guide and schedule consultation times. Feel free to call us or visit during our official hours.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', padding: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%' }}>
                <Phone size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Call Support Desk</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>+1 (800) 555-DOCS</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', padding: '12px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '50%' }}>
                <Mail size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Email Communications</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>contact@docspot.health</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ display: 'flex', padding: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%' }}>
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Official Clinic Address</span>
                <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>100 Medical Plaza, Suite 400</span>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Looking for instant support? Refer to our automated booking dashboard.
            </span>
          </div>
        </div>

        {/* Form Column */}
        <div className="glass-panel">
          <h3 style={{ marginBottom: '24px' }}>Send Clinic Message</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="John Doe"
              />
              {errors.name && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                placeholder="john@example.com"
              />
              {errors.email && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Reason for enquiry..."
              />
              {errors.subject && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Message Details</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="form-control"
                placeholder="Type your message details here..."
                style={{ resize: 'vertical' }}
              ></textarea>
              {errors.message && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{errors.message}</span>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '8px' }}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'white' }}></div>
                  <span>Submitting Message...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Submit Message</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
