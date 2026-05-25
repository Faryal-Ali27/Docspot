import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, ShieldCheck, HeartPulse, Star, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await api.getDoctors();
        if (res.success) {
          setDoctors(res.data);
        }
      } catch (err) {
        showToast(err.message || 'Error loading doctor profiles', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadDoctors();
  }, [showToast]);

  return (
    <div style={{ paddingBottom: '40px' }}>
      {/* Hero Section */}
      <section style={{ 
        position: 'relative',
        padding: '100px 0 80px',
        textAlign: 'center',
        background: 'radial-gradient(circle at 50% 30%, hsla(var(--hue-primary), 95%, 48%, 0.05), transparent 60%)',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '8px 16px',
            borderRadius: '50px',
            fontSize: '0.88rem',
            fontWeight: '600',
            marginBottom: '24px'
          }}>
            <HeartPulse size={16} />
            <span>Elevated Clinic Experience</span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.15', marginBottom: '24px' }}>
            Find & Book the Best <span style={{ color: 'var(--primary)' }}>Specialists</span> for Your Care
          </h1>
          
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6' }}>
            DocSpot simplifies healthcare by connecting you with top-rated medical practitioners. Book real-time appointments, review clinic statuses, and manage your health seamlessly.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/book" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
              Book Appointment <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-outline" style={{ fontSize: '1.05rem', padding: '14px 32px' }}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section style={{ padding: '60px 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '32px',
            textAlign: 'center'
          }}>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '16px' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>5+ Specialists</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Highly-qualified and board-certified medical doctors at your service.</p>
            </div>
            
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)', borderRadius: '50%', marginBottom: '16px' }}>
                <Calendar size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Instant Booking</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Choose your desired date, time slot, and get approval within minutes.</p>
            </div>
            
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '16px' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>4.8+ Rating</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Top patient satisfaction scores across all clinical treatments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seeded Doctors Section */}
      <section style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ marginBottom: '12px' }}>Meet Our Top Specialists</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)' }}>
              Consult with leading medical experts in cardiology, pediatrics, dermatology, neurology, and general medicine.
            </p>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doc) => (
                <div key={doc._id} className="doctor-card">
                  <img src={doc.image} alt={doc.name} className="doctor-card-img" />
                  <div className="doctor-card-body">
                    <span className="doctor-specialty">{doc.specialization}</span>
                    <div className="doctor-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{doc.rating.toFixed(1)}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '400', fontSize: '0.8rem' }}>({doc.experience} yrs exp)</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '12px' }}>{doc.name}</h3>
                    <p className="doctor-bio">{doc.bio}</p>
                    
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.8rem' }}>
                        <span style={{ color: 'var(--text-muted)', display: 'block' }}>Available Days</span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {doc.availability.slice(0, 2).join(', ')}{doc.availability.length > 2 ? '...' : ''}
                        </span>
                      </div>
                      <Link to="/book" state={{ selectedDoctorId: doc._id }} className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
