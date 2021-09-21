const express = require('express');
const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const { isAdmin, isAuth } = require('../utils');

const stripe = require('stripe')('sk_test_51J4nnWCGsijMYQNuWyR4yxIlrpYU4ZoliYSgbNebAu9keqJ00xliWtZuy1lvKSCHl9wjfqIn1rsBlQ0XUR5ZDKgs00Rj6DGtJv');

const orderRouter = express.Router();
orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const orders = {}

    if (endIndex < await Order.countDocuments()) {
      orders.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      orders.previous = {
        page: page - 1,
        limit: limit
      }
    }

    orders.results = await Order.find({}).limit(limit).skip(startIndex).populate('user', 'name');
    const allOrders = await Order.find({});
    orders.allOrdersNum = allOrders.length;
    orders.pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allOrders.length / limit); i++) {
      orders.pageNumbers.push(i);
    }
    res.send(orders);
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const orders = {}

    if (endIndex < await Order.countDocuments()) {
      orders.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      orders.previous = {
        page: page - 1,
        limit: limit
      }
    }

    orders.results = await Order.find({ user: req.user._id }).limit(limit).skip(startIndex);
    const allOrders = await Order.find({});
    orders.allOrdersNum = allOrders.length;
    orders.pageNumbers = [];
    for (let i = 1; i <= Math.ceil(allOrders.length / limit); i++) {
      orders.pageNumbers.push(i);
    }
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).set({'Access-Control-Allow-Origin': 'https://cometshop.netlify.app'}).send({ message: 'Cart is empty' });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder });
    }
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/pay-stripe',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
orderRouter.post(
  '/payment-sheet',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(req.body.amount),
      currency: 'usd',
    });
    console.log('paymentInt', paymentIntent);
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  }));

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      const deleteOrder = await order.remove();
      res.send({ message: 'Order Deleted', order: deleteOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// export default orderRouter;
module.exports = orderRouter;