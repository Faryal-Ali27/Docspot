const express = require('express');
const {
  getAdminAppointments,
  updateAdminAppointment,
  deleteAdminAppointment
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect & authorize('admin') to all routes in this router file
router.use(protect);
router.use(authorize('admin'));

router.route('/appointments')
  .get(getAdminAppointments);

router.route('/appointments/:id')
  .put(updateAdminAppointment)
  .delete(deleteAdminAppointment);

module.exports = router;
