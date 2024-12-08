const express = require('express');
const Mark = require('../models/markModel')
const router = express.Router();

router.post('/marks',async(req,res)=>{
   try{
    const marks = new Mark(req.body);
    await marks.save()
    res.status(200).json({
        message:"mark creates",
        data:marks
    })
   }catch(error){
     res.status(500).json({
        message:"internal server error",
        error:error.message
     })
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