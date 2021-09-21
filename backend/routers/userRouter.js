const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { generateToken, isAdmin, isAuth, isEmailValid, isPasswordValid } = require('../utils');
const bcrypt = require('bcryptjs');

const userRouter = express.Router();

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {

    const emailValid = isEmailValid(req.body.email);
    if(!emailValid) {
      return res.status(400).send({ message: 'Enter valid email' });
    }
    const messages = isPasswordValid(req.body.password);
    if(messages.length > 0) {
      return res.status(400).send({ message: messages[0] });
    }

    try { 
      const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      });
      const createdUser = await user.save();
      res.send({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        isAdmin: createdUser.isAdmin,
        token: generateToken(createdUser),
      });
    } catch(error){
      res.status(404).send({ message: "Validation wasn't passed" })
    }
  })
);

userRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        const messages = isPasswordValid(req.body.password);
        if(messages.length > 0) {
          return res.status(400).send({ message: messages[0] });
        }
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
    const emailValid = isEmailValid(req.body.email);
    if(!emailValid) {
      return res.status(400).send({ message: 'Enter valid email' });
    }    
      const updatedUser = await user.save();
      res.send({
        _id: user._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const users = {}

    if (endIndex < await User.countDocuments()) {
      users.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      users.previous = {
        page: page - 1,
        limit: limit
      }
    }

    users.results = await User.find({}).limit(limit).skip(startIndex);
    const allUsers = await User.find({});
    users.allOrdersNum = allUsers.length;
    users.pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allUsers.length / limit); i++) {
      users.pageNumbers.push(i);
    }
    res.send(users);
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = req.body.isSeller || user.isSeller;
      user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

module.exports = userRouter;
// export default userRouter;
