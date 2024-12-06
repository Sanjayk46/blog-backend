const User = require('../models/userModel.js');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken }= require('../utils/generateToken.js');

//login user

const loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email });
  
      if (!user) {
        res.statusCode = 404;
        throw new Error(
          'Invalid email address. Please check your email and try again.'
        );
      }
  
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
        res.statusCode = 401;
        throw new Error(
          'Invalid password. Please check your password and try again.'
        );
      }
  
      generateToken(req, res, user._id);
  
      res.status(200).json({
        message: 'Login successful.',
        userId: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      next(error);
    }
  };

  //Register User

  const registerUser = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
  
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        res.statusCode = 409;
        throw new Error('User already exists. Please choose a different email.');
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        name,
        email,
        password: hashedPassword
      });
  
      await user.save();
  
      generateToken(req, res, user._id);
  
      res.status(201).json({
        message: 'Registration successful',
        userId: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      next(error);
    }
  };
  
  //logout user
  const logoutUser = (req, res) => {
    res.clearCookie('jwt', { httpOnly: true });
  
    res.status(200).json({ message: 'Logout successful' });
  };

  //admin access -> update user

  const updateUserProfile = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
  
      const user = await User.findById(req.user._id);
  
      if (!user) {
        res.statusCode = 404;
        throw new Error('User not found. Unable to update profile.');
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
      }
  
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: 'User profile updated successfully.',
        userId: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      });
    } catch (error) {
      next(error);
    }
  };
//delete user

const deleteUser = async (req, res, next) => {
    try {
      const { id: userId } = req.params;
      const user = await User.findById(userId);
      if (!user) {
        res.statusCode = 404;
        throw new Error('User not found!');
      }
      await User.deleteOne({ _id: user._id });
      res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  };

  module.exports={ registerUser,loginUser,logoutUser,updateUserProfile,deleteUser}