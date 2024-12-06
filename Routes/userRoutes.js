const express = require ('express');
const {
  loginUser,
  registerUser,
  logoutUser,
  updateUserProfile
} =require('../controller/userContoller');
const { protect } = require ('../middleware/authMiddleware');
const validateRequest = require('../middleware/validators');
const {body, param} = require('express-validator');
const router = express.Router();
const validator = {
    checkLogin: [
      body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address"),
      body('password').trim().isString().notEmpty().withMessage('Password is Empty')
    ],
    checkNewUser: [
        body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address"),
        body('password').trim().isString().notEmpty().withMessage('Password is Empty').bail()
          .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('name').trim().notEmpty().withMessage('Name is Required').escape()
      ],
      checkGetUserById: [
        param('id').exists().withMessage('Id is required').isMongoId().withMessage('Invalid Id')
      ],
      checkUpdateUser: [
        body('email').trim().notEmpty().withMessage('Email is Required').bail().isEmail().withMessage("Please enter a valid email address"),
        body('name').trim().notEmpty().withMessage('Name is Required').escape(),
        body('isAdmin').isBoolean().withMessage('isAdmin value should be true/false'),
        param('id').exists().withMessage('Id is required').isMongoId().withMessage('Invalid Id')
      ]
}
router.route('/')
  .post(validator.checkNewUser, validateRequest, registerUser)
router.post('/login', validator.checkLogin, validateRequest, loginUser);
router.post('/logout',logoutUser);
router.put('/profile/:id',validator.checkNewUser, validateRequest, protect, updateUserProfile);
module.exports= router;
  