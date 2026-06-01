# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication Endpoints

### Admin Authentication

#### Login Admin
```http
POST /auth/admin/login
```

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "admin | superadmin",
      "permissions": ["string"],
      "isActive": true,
      "lastLogin": "date",
      "createdAt": "date",
      "updatedAt": "date"
    }
  }
}
```

#### Logout Admin
```http
POST /auth/admin/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Dashboard Endpoints

### Get Dashboard Stats
```http
GET /dashboard/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalOrders": "number",
    "totalProducts": "number",
    "totalCustomers": "number",
    "totalRevenue": "number"
  }
}
```

### Get Recent Orders
```http
GET /dashboard/recent-orders
```

**Response:**
```json
{
  "success": true,
  "data": [{
    "orderNumber": "string",
    "totalAmount": "number",
    "status": "string",
    "createdAt": "date",
    "customer": {
      "name": "string",
      "email": "string"
    }
  }]
}
```

### Get Top Products
```http
GET /dashboard/top-products
```

**Response:**
```json
{
  "success": true,
  "data": [{
    "name": "string",
    "price": "number",
    "totalSold": "number",
    "totalRevenue": "number"
  }]
}
```

### Get Sales Analytics
```http
GET /dashboard/sales-analytics
```

**Query Parameters:**
```
startDate: "YYYY-MM-DD"
endDate: "YYYY-MM-DD"
```

**Response:**
```json
{
  "success": true,
  "data": [{
    "_id": "YYYY-MM-DD",
    "totalSales": "number",
    "orderCount": "number"
  }]
}
```

## Product Endpoints

### Get All Products
```http
GET /products
```

**Query Parameters:**
```
category?: "string"
isActive?: "boolean"
sort?: "price" | "-price" | "name" | "-name"
limit?: "number"
page?: "number"
```

### Create Product
```http
POST /products
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "stock": "number",
  "category": "string",
  "images": ["string"]
}
```

### Update Product
```http
PUT /products/:id
```

### Delete Product
```http
DELETE /products/:id
```

## Order Endpoints

### Get All Orders
```http
GET /orders
```

**Query Parameters:**
```
status?: "pending" | "processing" | "completed" | "cancelled"
startDate?: "YYYY-MM-DD"
endDate?: "YYYY-MM-DD"
```

### Create Order
```http
POST /orders
```

**Request Body:**
```json
{
  "customer": "string",
  "items": [{
    "product": "string",
    "quantity": "number",
    "price": "number"
  }],
  "shippingAddress": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  }
}
```

### Update Order Status
```http
PUT /orders/:id/status
```

**Request Body:**
```json
{
  "status": "pending" | "processing" | "completed" | "cancelled"
}
```

## Customer Endpoints

### Get All Customers
```http
GET /customers
```

### Create Customer
```http
POST /customers
```

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  }
}
```

### Update Customer
```http
PUT /customers/:id
```

### Delete Customer
```http
DELETE /customers/:id
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Error message describing the issue"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized - Please login"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Forbidden - Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Something went wrong!"
}
```

## Notes

1. All endpoints except login require authentication
2. Admin/SuperAdmin roles are enforced through middleware
3. Session-based authentication is used instead of JWT
4. All timestamps are in ISO 8601 format
5. All endpoints return a consistent response format with `success` boolean
6. Pagination is available on list endpoints where appropriate 