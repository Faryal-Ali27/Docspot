const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('docspot_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Get all doctor profiles
  async getDoctors() {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch doctors list');
    }
    return response.json();
  },

  // Get standard patient appointments
  async getAppointments(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.doctor) queryParams.append('doctor', filters.doctor);

    const url = `${API_BASE_URL}/appointments?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch appointments list');
    }
    return response.json();
  },

  // Book a new appointment
  async bookAppointment(appointmentData) {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(appointmentData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Booking appointment failed');
    }
    return data;
  },

  // Update appointment status
  async updateAppointmentStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Updating appointment status failed');
    }
    return data;
  },

  // Delete/cancel an appointment
  async deleteAppointment(id) {
    const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel appointment');
    }
    return data;
  },

  /* ==========================================
     ADMIN APIS (Uses strictly protected routes)
     ========================================== */
  async getAdminAppointments(filters = {}) {
    const queryParams = new URLSearchParams();
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.doctor) queryParams.append('doctor', filters.doctor);

    const url = `${API_BASE_URL}/admin/appointments?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: {
        ...getAuthHeader()
      }
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Failed to fetch admin appointments list');
    }
    return response.json();
  },

  async updateAdminAppointmentStatus(id, status) {
    const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Updating appointment status failed');
    }
    return data;
  },

  async deleteAdminAppointment(id) {
    const response = await fetch(`${API_BASE_URL}/admin/appointments/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader()
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to cancel appointment');
    }
    return data;
  }
};
