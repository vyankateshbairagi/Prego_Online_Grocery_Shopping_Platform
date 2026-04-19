import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "node:crypto";
import User from "../models/User.js";

const calculateOrderAmount = async (items) => {
    const amount = await items.reduce(async (acc, item) => {
        const product = await Product.findById(item.product);
        return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    // Add Tax Charge (2%)
    return amount + Math.floor(amount * 0.02);
};

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }
        const amount = await calculateOrderAmount(items);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Successfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Create Razorpay Order : /api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { userId, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.json({ success: false, message: "Razorpay is not configured" });
        }

        const amount = await calculateOrderAmount(items);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        try {
            const razorpay = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET,
            });

            const razorpayOrder = await razorpay.orders.create({
                amount: amount * 100,
                currency: "INR",
                receipt: `receipt_${order._id}`,
                notes: {
                    orderId: order._id.toString(),
                    userId,
                },
            });

            return res.json({
                success: true,
                keyId: process.env.RAZORPAY_KEY_ID,
                orderId: order._id,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
            });
        } catch (error) {
            await Order.findByIdAndDelete(order._id);
            return res.json({ success: false, message: error.message });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Verify Razorpay payment signature : /api/order/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.json({ success: false, message: "Invalid payment verification data" });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.json({ success: false, message: "Razorpay is not configured" });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            await Order.findByIdAndDelete(orderId);
            return res.json({ success: false, message: "Payment verification failed" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { isPaid: true }, { new: true });

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        await User.findByIdAndUpdate(order.userId, { cartItems: {} });

        return res.json({ success: true, message: "Payment successful. Order placed." });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Delete failed online order : /api/order/razorpay/fail
export const handleFailedRazorpayPayment = async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.json({ success: false, message: "Order ID is required" });
        }

        await Order.findOneAndDelete({ _id: orderId, paymentType: "Online", isPaid: false });

        return res.json({ success: true, message: "Payment cancelled" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}