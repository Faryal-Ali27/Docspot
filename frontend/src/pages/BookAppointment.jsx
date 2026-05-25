import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, User, UserCheck, Clock, FileText, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function BookAppointment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // States
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [booking, setBooking] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    diseaseDescription: '',
    doctor: '',
    date: '',
    timeSlot: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  // Check if a doctor was pre-selected from the Home screen
  useEffect(() => {
    async function loadDoctors() {
      try {
        const res = await api.getDoctors();
        if (res.success) {
          setDoctors(res.data);
          
          // Pre-select if passed in state
          const preSelectedId = location.state?.selectedDoctorId;
          if (preSelectedId && res.data.some(d => d._id === preSelectedId)) {
            setFormData(prev => ({ ...prev, doctor: preSelectedId }));
          }
        }
      } catch (err) {
        showToast('Error loading doctors list', 'error');
      } finally {
        setLoadingDoctors(false);
      }
    }
    loadDoctors();
  }, [location, showToast]);

  const selectedDoctorDetails = doctors.find(d => d._id === formData.doctor);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Clear specific time slot if doctor changes
      ...(name === 'doctor' ? { timeSlot: '' } : {})
    }));
    
    // Clear error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient name is required';
    if (!formData.patientAge) {
      errors.patientAge = 'Age is required';
    } else if (Number(formData.patientAge) < 0 || Number(formData.patientAge) > 120) {
      errors.patientAge = 'Please enter a valid age (0-120)';
    }
    if (!formData.patientGender) errors.patientGender = 'Please select a gender';
    if (!formData.diseaseDescription.trim()) errors.diseaseDescription = 'Disease description is required';
    if (!formData.doctor) errors.doctor = 'Please select a specialist';
    if (!formData.date) errors.date = 'Appointment date is required';
    if (!formData.timeSlot) errors.timeSlot = 'Please select a time slot';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please correct the validation errors in the form', 'error');
      return;
    }

    setBooking(true);
    try {
      const res = await api.bookAppointment({
        ...formData,
        patientAge: Number(formData.patientAge)
      });
      
      if (res.success) {
        showToast('Appointment booked successfully! Awaiting Approval.', 'success');
        // Clear Form
        setFormData({
          patientName: '',
          patientAge: '',
          patientGender: '',
          diseaseDescription: '',
          doctor: '',
          date: '',
          timeSlot: ''
        });
        
        // Redirect to Patient Dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Failed to book appointment', 'error');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 0', maxWidth: '750px' }}>
      <div className="glass-panel" style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', marginBottom: '16px' }}>
          <Calendar size={32} />
        </div>
        <h2 style={{ marginBottom: '8px' }}>Book Clinic Appointment</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Please fill out the patient and clinical details below to schedule your appointment with a specialist.
        </p>

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          
          {/* Section 1: Patient Information */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
              <User size={18} style={{ color: 'var(--primary)' }} />
              <span>Patient Details</span>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="e.g. John Doe"
                />
                {formErrors.patientName && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.patientName}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="e.g. 28"
                  />
                  {formErrors.patientAge && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.patientAge}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {formErrors.patientGender && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.patientGender}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Symptoms / Disease Description</label>
                <textarea
                  name="diseaseDescription"
                  value={formData.diseaseDescription}
                  onChange={handleInputChange}
                  rows="3"
                  className="form-control"
                  placeholder="Describe your current medical condition, symptoms, or reason for booking..."
                  style={{ resize: 'vertical' }}
                ></textarea>
                {formErrors.diseaseDescription && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.diseaseDescription}</span>}
              </div>
            </div>
          </div>

          {/* Section 2: Appointment Details */}
          <div>
            <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem' }}>
              <UserCheck size={18} style={{ color: 'var(--primary)' }} />
              <span>Specialist & Schedule</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
              
              <div className="form-group">
                <label className="form-label">Select Specialist Doctor</label>
                {loadingDoctors ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                    <span>Loading specialists...</span>
                  </div>
                ) : (
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="form-control"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(d => (
                      <option key={d._id} value={d._id}>
                        {d.name} ({d.specialization} - {d.experience} yrs exp)
                      </option>
                    ))}
                  </select>
                )}
                {formErrors.doctor && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.doctor}</span>}
              </div>

              {selectedDoctorDetails && (
                <div style={{
                  backgroundColor: 'var(--primary-light)',
                  padding: '16px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '10px'
                }}>
                  <img 
                    src={selectedDoctorDetails.image} 
                    alt={selectedDoctorDetails.name} 
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)' }}>{selectedDoctorDetails.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0' }}>
                      <strong>Available Days:</strong> {selectedDoctorDetails.availability.join(', ')}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split('T')[0]} // Cannot book past dates
                    value={formData.date}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                  {formErrors.date && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.date}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time Slot</label>
                  <select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={!formData.doctor}
                  >
                    <option value="">Select Time Slot</option>
                    {selectedDoctorDetails?.timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                  {!formData.doctor && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Select a doctor first to view slots</span>}
                  {formErrors.timeSlot && <span style={{ color: 'hsl(0, 84%, 60%)', fontSize: '0.8rem' }}>{formErrors.timeSlot}</span>}
                </div>
              </div>

            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
            <button
              type="submit"
              disabled={booking}
              className="btn btn-primary"
              style={{ flexGrow: 1, padding: '14px' }}
            >
              {booking ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'white' }}></div>
                  <span>Booking Appointment...</span>
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  <span>Confirm Clinic Booking</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-outline"
              style={{ padding: '14px' }}
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
