const mongoose = require('mongoose');
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
  });
  

  
const subject = mongoose.model('Subject', subjectSchema);
module.exports = subject;