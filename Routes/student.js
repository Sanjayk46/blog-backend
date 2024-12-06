const express = require('express');
const { body, param } = require('express-validator');
const Student = require('../models/studentModel');
const validateRequest = require('../middleware/validators');
const router = express.Router();

// Create Student
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('age').isNumeric().withMessage('Age must be a number'),
    body('rollNumber').notEmpty().withMessage('Roll Number is required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { name, age, rollNumber } = req.body;
      const student = new Student({ name, age, rollNumber });
      await student.save();
      res.status(201).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all Students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Student
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid student ID'),
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('age').optional().isNumeric().withMessage('Age must be a number'),
    body('rollNumber').optional().notEmpty().withMessage('Roll Number is required'),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!student) return res.status(404).json({ message: 'Student not found' });
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete Student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
