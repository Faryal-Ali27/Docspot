const Doctor = require('../models/Doctor');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors list',
      error: error.message
    });
  }
};

// @desc    Create a doctor
// @route   POST /api/doctors
// @access  Public
exports.createDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create doctor profile',
      error: error.message
    });
  }
};

// @desc    Delete a doctor
// @route   DELETE /api/doctors/:id
// @access  Public
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: `Doctor not found with id of ${req.params.id}`
      });
    }
    await doctor.deleteOne();
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete doctor profile',
      error: error.message
    });
  }
};
