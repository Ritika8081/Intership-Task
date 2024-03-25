const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8000;
const cors = require('cors');


// MongoDB connection

mongoose.connect('mongodb+srv://order:ZgllC9BU5kcIw3BH@cluster0.5ri0bhc.mongodb.net/order?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
    console.log("connected")
}).catch((err)=>{
    console.log("err")
});

// Order Model
const Order = mongoose.model('Order', {
  order_id: Number,
  order_date: String,
  mode_of_payment: String,
  cus_id: Number,
  payment_status: String,
  order_ammount: Number,
  product: {
    name: String,
    qty: Number,
    price_rate: Number,
    delivery_charge: Number,
    date: String,
    status: String,
    discount: Number,
  },
});

// Customer Model
const Customer = mongoose.model('Customer', {
  cus_id: Number,
  addresss: String,
  email: String,
  phone: Number,
  pincode: Number,
});
app.use(cors());
// Middleware
app.use(bodyParser.json());

// API Route
app.post('/api/orders/search', async (req, res) => {
  try {
    const { type, value } = req.body;
    let orders;

    // Search based on type
    switch (type) {
      case 'order_id':
        orders = await Order.find({ order_id: value });
        break;
      case 'mobile':
        const customer = await Customer.findOne({ phone: value });
        if (!customer) {
          return res.status(404).json({ message: 'Customer not found' });
        }
        orders = await Order.find({ cus_id: customer.cus_id });
        break;
      case 'name':
        orders = await Order.find({ 'product.name': value });
        break;
      case 'email':
        const customerByEmail = await Customer.findOne({ email: value });
        if (!customerByEmail) {
          return res.status(404).json({ message: 'Customer not found' });
        }
        orders = await Order.find({ cus_id: customerByEmail.cus_id });
        break;
      default:
        return res.status(400).json({ message: 'Invalid search type' });
    }

    // Populate customer details
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const customer = await Customer.findOne({ cus_id: order.cus_id });
        return {
          ...order._doc,
          buyer_details: {
            cus_id: customer.cus_id,
            addresss: customer.addresss,
            email: customer.email,
            phone: customer.phone,
            pincode: customer.pincode,
          },
        };
      })
    );

    res.json(populatedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
