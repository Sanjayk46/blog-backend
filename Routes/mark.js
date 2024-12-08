const express = require('express');
const Mark = require('../models/markModel')
const router = express.Router();
const mongoose = require('mongoose');
const Subject = require('../models/subjectModel');
router.post('/createsubject', async (req, res) => {
    try {
      const { name } = req.body;
  
      // Validate the input
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Subject name is required and must be a string" });
      }
  
      // Check if the subject already exists
      const existingSubject = await Subject.findOne({ name });
      if (existingSubject) {
        return res.status(400).json({ message: "Subject already exists" });
      }
  
      // Create and save the new subject
      const subject = new Subject({ name });
      await subject.save();
  
      res.status(201).json({
        message: "Subject created successfully",
        data: subject,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  });
  
router.post('/createmark', async (req, res) => {
    try {
      const { student, subjectName, marks } = req.body;
  
      // Validate the `student` field to ensure it is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(student)) {
        return res.status(400).json({ message: "Invalid student ID" });
      }
  
      // Find the subject by its name
      const subject = await Subject.findOne({ name: subjectName });
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
  
      // Create and save the mark
      const mark = new Mark({ student, subject: subject._id, marks });
      await mark.save();
  
      res.status(201).json({
        message: "Mark created successfully",
        data: mark,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  });

router.get('/getmarks',async(req,res)=>{
    try{
        const getmarks = await Mark.find().populate("student","name").populate("subject","name")
        res.status(200).json({
            message:"mark get successfully",
            data:getmarks
        })
    }catch(error){
        res.status(500).json({
            message:"internal server error",
            error:error.message
         })
    }
    
})
module.exports = router;