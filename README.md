# Full-Fledged E-Commerce Platform

A modern, full-stack e-commerce application built with the MERN stack, featuring user authentication, product management, shopping cart functionality, and integrated payment processing.

## 🚀 Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Protected routes and admin access
  - Password encryption with bcrypt

- **Product Management**
  - Browse products with pagination
  - Product search and filtering
  - Detailed product views
  - Admin product CRUD operations

- **Shopping Experience**
  - Add to cart functionality
  - Shopping cart management
  - Order placement and tracking
  - User profile and order history

- **Payment Integration**
  - PayPal payment processing
  - Secure checkout process

- **Admin Dashboard**
  - Product management
  - Order management
  - User management
  - Sales analytics

- **Image Management**
  - Cloudinary integration for image uploads
  - Optimized image storage and delivery

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **Multer** - File upload handling

### Frontend
- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **React Paginate** - Pagination component

### Payment Processing
- **PayPal SDK** - Payment integration

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/Prashant-Khadka-Magar/full-fledged-ecommerce.git
cd full-fledged-ecommerce
```

### Install dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🚀 Usage

### Development Mode
Run both frontend and backend concurrently:
```bash
npm run dev
```

### Production Mode
```bash
# Build frontend
cd frontend
npm run build
cd ..

# Start server
npm start
```

### Individual Scripts
```bash
# Run backend only
npm run server

# Run frontend only
npm run client

# Import sample data
npm run data:import

# Delete all data
npm run data:destroy
```

## 📁 Project Structure

```
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Server entry point
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Redux store
│   │   └── App.js      # Main App component
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Prashant Magar**
- GitHub: [@Prashant-Khadka-Magar](https://github.com/Prashant-Khadka-Magar)

## 🙏 Acknowledgments

- PayPal for payment processing
- Cloudinary for image management
- MongoDB for database services
- All the open-source libraries that made this project possible
