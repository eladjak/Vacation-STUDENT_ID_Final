# 🏗️ ארכיטקטורת המערכת - VacationVibe

## 📋 סקירה כללית

### תרשים מערכת
```mermaid
graph TD
    A[לקוח - React] --> B[API Gateway]
    B --> C[שירות משתמשים]
    B --> D[שירות חופשות]
    B --> E[שירות תשלומים]
    B --> H[שירות התראות]
    C --> F[(DB - MySQL)]
    D --> F
    E --> G[שער תשלומים]
    E --> F
    H --> I[Redis]
    H --> J[Socket.IO]
```

## 🔄 זרימת מידע

### תהליך הזמנה
1. משתמש בוחר חופשה
2. מערכת בודקת זמינות
3. יצירת הזמנה זמנית
4. ביצוע תשלום
5. אישור הזמנה
6. שליחת התראות

### תהליך תשלום
```mermaid
sequenceDiagram
    Client->>+Server: בקשת תשלום
    Server->>+PaymentGateway: עיבוד תשלום
    PaymentGateway-->>-Server: אישור
    Server->>DB: עדכון סטטוס
    Server->>Redis: שמירת מידע תשלום
    Server->>Socket: שליחת התראה
    Server-->>-Client: אישור הזמנה
```

## 🏛️ שכבות המערכת

### שכבת לקוח (Frontend)
- React 18
- Redux Toolkit Query
- Material UI v5
- TypeScript
- Socket.IO Client
- PWA Support

### שכבת שרת (Backend)
- NestJS
- TypeORM
- JWT Auth
- Redis Cache
- Bull Queue
- Socket.IO

### שכבת נתונים
- MySQL
- Redis
- S3 Storage
- ElasticSearch

## 🔌 תלויות מערכת
- Node.js 18+
- Docker
- Redis
- MySQL 8+
- S3 Compatible Storage
- ElasticSearch 8+

## 🛡️ אבטחה
- JWT Authentication
- Role Based Access
- SSL/TLS
- Rate Limiting
- XSS Protection
- CSRF Protection
- SQL Injection Prevention
- File Upload Security