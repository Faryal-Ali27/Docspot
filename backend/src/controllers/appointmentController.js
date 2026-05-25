const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get appointments for the logged-in user only
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id }).populate('doctor', 'name specialization rating image');
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments list',
      error: error.message
    });
  }
};

// @desc    Book an appointment (User only)
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const { patientName, patientAge, patientGender, diseaseDescription, doctor, date, timeSlot } = req.body;

    // Direct Form Validation
    if (!patientName || !patientAge || !patientGender || !diseaseDescription || !doctor || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: patientName, patientAge, patientGender, diseaseDescription, doctor, date, timeSlot'
      });
    }

    // Verify doctor exists
    const docExists = await Doctor.findById(doctor);
    if (!docExists) {
      return res.status(404).json({
        success: false,
        message: `No doctor found with ID: ${doctor}`
      });
    }

    const appointment = await Appointment.create({
      user: req.user.id,
      patientName,
      patientAge,
      patientGender,
      diseaseDescription,
      doctor,
      date,
      timeSlot
    });

    // Populate doctor details before response
    const populatedAppointment = await appointment.populate('doctor', 'name specialization rating image');

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: populatedAppointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Booking failed',
      error: error.message
    });
  }
};

// @desc    Update appointment details (User cancel/update - optional check)
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status } = req.body;

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    // Enforce that a normal user can only update their own appointments
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this appointment'
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('doctor', 'name specialization rating image');

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Update failed',
      error: error.message
    });
  }
};

// @desc    Cancel/Delete appointment (User cancel only own)
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    // Enforce that a normal user can only delete their own appointments
    if (appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Cancellation failed',
      error: error.message
    });
  }
};

/* ==========================================================================
   ADMIN APIS (Strictly Protected by Admin Authorization check on Route layer)
   ========================================================================== */

// @desc    Get all appointments (Admin only)
// @route   GET /api/admin/appointments
// @access  Private/Admin
exports.getAdminAppointments = async (req, res, next) => {
  try {
    const { date, doctor } = req.query;
    let query = {};

    if (date) query.date = date;
    if (doctor) query.doctor = doctor;

    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialization rating image')
      .populate('user', 'name email');
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve administrative records',
      error: error.message
    });
  }
};

// @desc    Update appointment status (Admin only)
// @route   PUT /api/admin/appointments/:id
// @access  Private/Admin
exports.updateAdminAppointment = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status: Pending, Approved, Completed'
      });
    }

    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('doctor', 'name specialization rating image');

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Status update failed',
      error: error.message
    });
  }
};

// @desc    Cancel/Delete appointment permanently (Admin only)
// @route   DELETE /api/admin/appointments/:id
// @access  Private/Admin
exports.deleteAdminAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment found with ID: ${req.params.id}`
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Appointment removed from records permanently',
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Deletion failed',
      error: error.message
    });
  }
};
