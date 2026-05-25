import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, RefreshCw, Trash2, CheckCircle2, Award, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminDashboard() {
  const { showToast } = useToast();
  
  // Data States
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering states
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  async function loadData() {
    setLoading(true);
    try {
      // Load doctors list for selector filter
      const doctorsRes = await api.getDoctors();
      if (doctorsRes.success) {
        setDoctors(doctorsRes.data);
      }

      // Load appointments
      const appointmentsRes = await api.getAdminAppointments({
        doctor: selectedDoctorFilter,
        date: selectedDateFilter
      });
      if (appointmentsRes.success) {
        setAppointments(appointmentsRes.data);
      }
    } catch (err) {
      showToast('Error loading administrative data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selectedDoctorFilter, selectedDateFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.updateAdminAppointmentStatus(id, newStatus);
      if (res.success) {
        showToast(`Appointment status updated to ${newStatus}!`, 'success');
        // Update state locally
        setAppointments(prev => 
          prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
        );
      }
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this appointment from clinic records?')) return;
    
    try {
      const res = await api.deleteAdminAppointment(id);
      if (res.success) {
        showToast('Appointment removed from records.', 'success');
        setAppointments(prev => prev.filter(app => app._id !== id));
      }
    } catch (err) {
      showToast('Failed to delete appointment: ' + err.message, 'error');
    }
  };

  // Local Search Filter
  const filteredAppointments = appointments.filter(app => {
    const term = searchTerm.toLowerCase();
    return (
      app.patientName.toLowerCase().includes(term) ||
      app.diseaseDescription.toLowerCase().includes(term) ||
      app.doctor?.name.toLowerCase().includes(term) ||
      app.doctor?.specialization.toLowerCase().includes(term)
    );
  });

  // Calculate status counts
  const stats = appointments.reduce((acc, curr) => {
    acc.total += 1;
    if (curr.status === 'Pending') acc.pending += 1;
    if (curr.status === 'Approved') acc.approved += 1;
    if (curr.status === 'Completed') acc.completed += 1;
    return acc;
  }, { total: 0, pending: 0, approved: 0, completed: 0 });

  return (
    <div className="container" style={{ padding: '60px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ marginBottom: '4px' }}>Clinic Admin & Doctor Panel</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
            Manage booking approvals, complete appointments, and search medical records.
          </p>
        </div>
        <button 
          onClick={loadData} 
          className="btn btn-outline" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          title="Refresh Data"
        >
          <RefreshCw size={16} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Analytics Counter Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Bookings</span>
          <h2 style={{ fontSize: '2.5rem', margin: '4px 0 0', color: 'var(--primary)' }}>{stats.total}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pending Review</span>
          <h2 style={{ fontSize: '2.5rem', margin: '4px 0 0', color: 'hsl(35, 95%, 45%)' }}>{stats.pending}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved</span>
          <h2 style={{ fontSize: '2.5rem', margin: '4px 0 0', color: 'var(--secondary)' }}>{stats.approved}</h2>
        </div>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Completed</span>
          <h2 style={{ fontSize: '2.5rem', margin: '4px 0 0', color: 'var(--text-primary)' }}>{stats.completed}</h2>
        </div>
      </div>

      {/* Filters and Search Panel */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
          <Filter size={18} style={{ color: 'var(--primary)' }} />
          <span>Filters & Search</span>
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px'
        }}>
          {/* Search Input */}
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Search Patients / Conditions</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
                placeholder="Type name or symptoms..."
                style={{ paddingLeft: '40px' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Doctor Filter */}
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Filter by Doctor</label>
            <select
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              className="form-control"
            >
              <option value="">All Doctors</option>
              {doctors.map(d => (
                <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="form-group" style={{ marginBottom: '0' }}>
            <label className="form-label">Filter by Date</label>
            <input
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Records Listing */}
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0' }}>
            No clinic appointment records found matching the selected filters.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            textAlign: 'left',
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--primary-light)', borderBottom: '1.5px solid var(--border-color)' }}>
                <th style={{ padding: '16px', color: 'var(--primary)', fontWeight: '600' }}>Patient Info</th>
                <th style={{ padding: '16px', color: 'var(--primary)', fontWeight: '600' }}>Assigned Specialist</th>
                <th style={{ padding: '16px', color: 'var(--primary)', fontWeight: '600' }}>Schedule Details</th>
                <th style={{ padding: '16px', color: 'var(--primary)', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '16px', color: 'var(--primary)', fontWeight: '600', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => (
                <tr key={app._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-fast)' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{app.patientName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{app.patientAge} yrs • {app.patientGender}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>
                      "{(app.diseaseDescription.length > 50) ? app.diseaseDescription.slice(0, 50) + '...' : app.diseaseDescription}"
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{app.doctor?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{app.doctor?.specialization}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} style={{ color: 'var(--text-muted)' }} /> {app.date}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <Clock size={14} style={{ color: 'var(--text-muted)' }} /> {app.timeSlot}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {app.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'Approved')}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          title="Approve Appointment"
                        >
                          Approve
                        </button>
                      )}
                      
                      {app.status === 'Approved' && (
                        <button
                          onClick={() => handleStatusChange(app._id, 'Completed')}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          title="Mark Completed"
                        >
                          Complete
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAppointment(app._id)}
                        className="btn btn-outline"
                        style={{ padding: '6px 10px', color: 'hsl(0, 84%, 60%)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                        title="Delete Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
