# Prego - E-Commerce Platform

A full-stack e-commerce application built with React and Node.js, featuring a modern shopping experience with seller functionality, secure payments, and real-time updates.

## 🚀 Features

### Customer Features

- 🛍️ Browse products by categories
- 🔍 Product search and filtering
- 🛒 Shopping cart management
- 💳 Secure checkout with Stripe
- 📦 Order tracking and history
- 📍 Multiple address management
- 💊 Health Picks - Specialized health products section
- 🎉 Interactive animations and effects
- 📱 Responsive design for all devices

### Seller Features

- 👤 Separate seller authentication
- ➕ Add and manage products
- 📸 Image upload with Cloudinary
- 📊 View and manage orders
- 📝 Product inventory management

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animation library
- **React Hot Toast** - Toast notifications
- **React Canvas Confetti** - Celebration effects

### Backend

- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Stripe** - Payment processing
- **Cloudinary** - Image storage and management
- **Multer** - File upload handling

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Cloudinary account
- Stripe account

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Prego
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

### 4. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

## 🚀 Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd server
npm run server
```

The server will run on http://localhost:4000

#### Start the Frontend

```bash
cd client
npm run dev
```

The client will run on http://localhost:5173

### Production Build

#### Build the Frontend

```bash
cd client
npm run build
```

#### Start the Server

```bash
cd server
npm start
```

## 📁 Project Structure

```
Prego/
├── client/                  # Frontend React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── assets/         # Images, icons, etc.
│   │   ├── components/     # Reusable components
│   │   │   └── seller/     # Seller-specific components
│   │   ├── context/        # React Context API
│   │   ├── pages/          # Page components
│   │   │   └── seller/     # Seller pages
│   │   ├── App.jsx         # Main App component
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── server/                  # Backend Node.js application
    ├── configs/            # Configuration files
    │   ├── cloudinary.js   # Cloudinary setup
    │   ├── db.js           # Database connection
    │   └── multer.js       # File upload config
    ├── controllers/        # Route controllers
    ├── middlewares/        # Custom middleware
    │   ├── authSeller.js   # Seller authentication
    │   └── authUser.js     # User authentication
    ├── models/             # Mongoose models
    ├── routes/             # API routes
    ├── server.js           # Entry point
    └── package.json
```

## 🔐 API Endpoints

### User Routes

- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Seller Routes

- `POST /api/seller/register` - Register new seller
- `POST /api/seller/login` - Seller login
- `GET /api/seller/orders` - Get seller orders

### Product Routes

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Cart Routes

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Order Routes

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order

### Address Routes

- `POST /api/address` - Add new address
- `GET /api/address` - Get user addresses
- `PUT /api/address/:id` - Update address
- `DELETE /api/address/:id` - Delete address

## 🧪 Testing

### Run Linter

```bash
cd client
npm run lint
```

## 📦 Deployment

### Deploy to Vercel

Both client and server directories contain `vercel.json` configuration files for easy deployment to Vercel.

```bash
# Deploy client
cd client
vercel

# Deploy server
cd server
vercel
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform's dashboard.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

Your Name - Vyankatesh Bairagi

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for the amazing utility-first framework
- Stripe for secure payment processing
- Cloudinary for image management

## 📧 Contact

For any queries or suggestions, please reach out:

- Email: vyankateshbairagi.dev@gmail.com

---

**Note:** Remember to replace placeholder values in the `.env` file and update the contact information before deploying to production.
