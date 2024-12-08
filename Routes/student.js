const express = require('express');
const { body, param } = require('express-validator');
const Student = require('../models/studentModel');
const Marks = require('../models/markModel');
const validateRequest = require('../middleware/validators');
const router = express.Router();
const mongoose = require('mongoose');
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


router.get('/report/:id', async (req, res) => {
  try {
    const studentId = req.params.id;

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find marks and populate subject name
    const marks = await Marks.find({ student: studentId }).populate("subject", "name");
    console.log(marks);
    if (!marks.length) {
      return res.status(404).json({ message: "Marks not found" });
    }

    console.log("Marks Data:", marks);

    // Calculate total marks and pass status
    const totalMarks = marks.reduce((acc, mark) => acc + mark.marks, 0);
    const pass = marks.every((mark) => mark.marks >= 50);

    res.status(200).json({
      message: "Report card generated successfully",
      student: {
        id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
      },
      subjects: marks.map((mark) => ({
        subject: mark.subject.name,
        marks: mark.marks,
      })),
      totalMarks,
      status: pass ? "Pass" : "Fail",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});


module.exports = router;
