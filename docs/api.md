# 🔌 VacationVibe API Documentation

## 🌐 Base URL
```
http://localhost:3001/api/v1
```

## 🔑 Authentication

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

### Login
```http
POST /auth/login
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
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

### Get Current User
```http
GET /auth/me
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string"
  }
}
```

## 🏖️ Vacations

### Get All Vacations
```http
GET /vacations
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "vacations": [
      {
        "id": "number",
        "destination": "string",
        "description": "string",
        "startDate": "date",
        "endDate": "date",
        "price": "number",
        "imageUrl": "string",
        "followersCount": "number",
        "isFollowing": "boolean"
      }
    ]
  }
}
```

### Get Single Vacation
```http
GET /vacations/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "vacation": {
      "id": "number",
      "destination": "string",
      "description": "string",
      "startDate": "date",
      "endDate": "date",
      "price": "number",
      "imageUrl": "string",
      "followersCount": "number",
      "isFollowing": "boolean"
    }
  }
}
```

### Create Vacation (Admin Only)
```http
POST /vacations
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
destination: string
description: string
startDate: date
endDate: date
price: number
image: file (optional)
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "vacation": {
      "id": "number",
      "destination": "string",
      "description": "string",
      "startDate": "date",
      "endDate": "date",
      "price": "number",
      "imageUrl": "string"
    }
  }
}
```

### Update Vacation (Admin Only)
```http
PUT /vacations/{id}
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body:**
```
destination: string
description: string
startDate: date
endDate: date
price: number
image: file (optional)
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "vacation": {
      "id": "number",
      "destination": "string",
      "description": "string",
      "startDate": "date",
      "endDate": "date",
      "price": "number",
      "imageUrl": "string"
    }
  }
}
```

### Delete Vacation (Admin Only)
```http
DELETE /vacations/{id}
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Vacation deleted successfully"
}
```

### Follow Vacation
```http
POST /vacations/{id}/follow
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Vacation followed successfully"
}
```

### Unfollow Vacation
```http
DELETE /vacations/{id}/follow
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "message": "Vacation unfollowed successfully"
}
```

## 📊 Statistics (Admin Only)

### Get Followers Statistics
```http
GET /vacations/stats/followers
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "stats": [
      {
        "destination": "string",
        "followers": "number"
      }
    ]
  }
}
```

### Export to CSV
```http
GET /vacations/export/csv
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```
CSV file download
```

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Please authenticate"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

## 📝 Notes

1. כל הבקשות (חוץ מהרשמה והתחברות) דורשות טוקן JWT בכותרת Authorization
2. תמונות נשמרות בתיקיית uploads/vacations
3. גודל מקסימלי לתמונה: 5MB
4. פורמטים נתמכים לתמונות: jpg, jpeg, png, gif
5. כל התאריכים בפורמט ISO 8601
6. כל המחירים בשקלים חדשים