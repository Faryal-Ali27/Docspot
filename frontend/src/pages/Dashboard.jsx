import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, AlertCircle, Clock, Trash2, HeartPulse, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    try {
      const res = await api.getAppointments();
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      showToast('Error loading appointments: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [showToast]);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this appointment?')) return;
    
    try {
      const res = await api.deleteAppointment(id);
      if (res.success) {
        showToast('Appointment cancelled successfully!', 'success');
        // Reload list
        setAppointments(prev => prev.filter(app => app._id !== id));
      }
    } catch (err) {
      showToast('Failed to cancel appointment: ' + err.message, 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ marginBottom: '4px' }}>Patient Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
            Monitor your clinic appointment statuses, and manage scheduled clinic bookings.
          </p>
        </div>
        <Link to="/book" className="btn btn-primary">
          + Book New Appointment
        </Link>
      </div>

      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '64px 32px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '16px' }}>
            <Sparkles size={32} />
          </div>
          <h3 style={{ marginBottom: '12px' }}>No Appointments Booked Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 24px' }}>
            You do not have any appointments scheduled currently. Choose one of our highly specialized doctors to schedule a consultation.
          </p>
          <Link to="/book" className="btn btn-primary">
            Schedule Appointment Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {appointments.map((app) => (
            <div 
              key={app._id} 
              className="glass-panel" 
              style={{ 
                padding: '24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                flexWrap: 'wrap',
                gap: '24px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <img 
                  src={app.doctor?.image} 
                  alt={app.doctor?.name} 
                  style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0' }}>{app.doctor?.name}</h3>
                    <span className="badge badge-completed" style={{ fontSize: '0.7rem' }}>{app.doctor?.specialization}</span>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>
                    <strong>Patient:</strong> {app.patientName} ({app.patientAge} yrs, {app.patientGender})
                  </p>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: 'var(--primary)' }} />
                      {app.date}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} style={{ color: 'var(--primary)' }} />
                      {app.timeSlot}
                    </span>
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '0.88rem', backgroundColor: 'var(--bg-app)', padding: '10px 14px', borderRadius: '6px', borderLeft: '3px solid var(--border-color)' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', fontWeight: '600' }}>Symptoms & Description</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{app.diseaseDescription}</span>
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end', 
                justifyContent: 'space-between',
                gap: '16px',
                height: '100%',
                minWidth: '160px'
              }}>
                <div>
                  <span style={{ marginRight: '8px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>Status:</span>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                </div>
                
                <button 
                  onClick={() => handleCancelAppointment(app._id)}
                  className="btn btn-outline btn-danger"
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.85rem',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Cancel Booking"
                >
                  <Trash2 size={14} />
                  <span>Cancel Booking</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
