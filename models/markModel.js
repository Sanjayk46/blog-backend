const mongoose = require('mongoose');
const marksSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    marks: { type: Number, required: true },
  });
  
const mark = mongoose.model('Marks', marksSchema);

module.exports = mark