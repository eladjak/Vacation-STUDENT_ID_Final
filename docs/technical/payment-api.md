# 📡 תיעוד API תשלומים

## 🔄 Endpoints

### POST /api/payments
יצירת תשלום חדש

```typescript
interface PaymentRequest {
  bookingId: string;
  amount: number;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
  }
}

interface PaymentResponse {
  status: 'success' | 'failed';
  transactionId?: string;
  error?: string;
}
```

### GET /api/payments/:id
קבלת פרטי תשלום

### PUT /api/payments/:id/status
עדכון סטטוס תשלום

## 🔒 אבטחה
- נדרש JWT תקף
- הרשאות מתאימות
- Rate Limiting
- תיקוף נתונים 