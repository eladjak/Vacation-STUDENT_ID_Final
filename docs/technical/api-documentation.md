# 📡 תיעוד API מלא - VacationVibe

## 🔄 Endpoints תשלומים

### POST /api/payments
יצירת תשלום חדש
```typescript
interface CreatePaymentDTO {
  bookingId: string;
  amount: number;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
  };
}

interface PaymentResponse {
  transactionId: string;
  status: PaymentStatus;
  timestamp: Date;
}
```

### GET /api/payments/:id
קבלת פרטי תשלום

### PUT /api/payments/:id/status
עדכון סטטוס תשלום

## 🔒 אבטחה
- אימות JWT
- Rate Limiting
- Input Validation
- Error Handling 