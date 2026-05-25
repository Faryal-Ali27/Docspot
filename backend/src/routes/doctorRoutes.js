const express = require('express');
const { getDoctors, createDoctor, deleteDoctor } = require('../controllers/doctorController');

const router = express.Router();

router.route('/')
  .get(getDoctors)
  .post(createDoctor);

router.route('/:id')
  .delete(deleteDoctor);

module.exports = router;
