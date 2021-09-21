const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const productRouter = require('./routers/productRouter');
const userRouter = require('./routers/userRouter');
const uploadRouter = require('./routers/uploadRouter');
const orderRouter = require('./routers/orderRouter');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enables CORS on Express.js

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

mongoose.connect(process.env.MONGODB_CREDENTIALS, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(express.static(path.join(__dirname, '/uploads')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/static/index.html'))
// );




app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serve at ${port}`);
});
