import express from 'express';
import authUser from '../middlewares/authUser.js';
import {
	getAllOrders,
	getUserOrders,
	handleFailedRazorpayPayment,
	placeOrderCOD,
	placeOrderRazorpay,
	verifyRazorpayPayment,
} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/razorpay/verify', authUser, verifyRazorpayPayment)
orderRouter.post('/razorpay/fail', authUser, handleFailedRazorpayPayment)

export default orderRouter;