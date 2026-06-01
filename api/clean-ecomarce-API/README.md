# eCommerce API

A robust and scalable eCommerce API built with Node.js, Express, TypeScript, and MongoDB.

## 🚀 Features

- **Admin Management System**
  - Role-based access control (Super Admin and Admin roles)
  - Secure authentication and authorization
  - Admin activity tracking
  - Permission management

- **Product Management**
  - CRUD operations for products
  - Category management
  - Image upload support with AWS S3
  - Stock management
  - Product search and filtering

- **Order Management**
  - Order processing workflow
  - Order status tracking
  - Order history
  - Customer order management

- **Customer Management**
  - Customer profiles
  - Order history
  - Address management
  - Customer support features

- **Dashboard Analytics**
  - Sales analytics
  - Revenue tracking
  - Product performance metrics
  - Customer insights
  - Recent orders overview

## 🛠️ Technology Stack

- **Backend Framework**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport.js
- **File Storage**: AWS S3
- **Email Service**: Nodemailer
- **Validation**: Zod
- **Logging**: Winston
- **API Documentation**: Custom API documentation

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- AWS Account (for S3 storage)
- npm or yarn package manager

## 🔧 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd eCommerce-API
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## 📚 API Documentation

The API documentation is available in the `API.md` file. It includes detailed information about:

- Authentication endpoints
- Dashboard endpoints
- Product management
- Order management
- Customer management
- Request/Response formats
- Query parameters
- Error handling

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Secure session management
- Input validation with Zod
- CORS protection
- Rate limiting

## 📊 Project Structure

```
src/
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── dashboard/
│   ├── product/
│   ├── order/
│   └── customer/
├── config/
├── middleware/
├── utils/
└── server.ts
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Express.js team
- MongoDB team
- All contributors who have helped shape this project
