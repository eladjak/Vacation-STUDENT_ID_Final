# 🐛 ניהול שגיאות - מערכת תשלומים

## 📋 סוגי שגיאות

### שגיאות תשלום
- `PAYMENT_VALIDATION_ERROR`: שגיאת תיקוף נתוני תשלום
- `INSUFFICIENT_FUNDS`: אין מספיק כיסוי
- `CARD_EXPIRED`: כרטיס פג תוקף
- `GATEWAY_ERROR`: שגיאת שער תשלומים

### שגיאות הזמנה
- `BOOKING_NOT_FOUND`: הזמנה לא נמצאה
- `INVALID_STATUS`: סטטוס לא חוקי
- `AMOUNT_MISMATCH`: אי התאמה בסכומים

## 🔄 טיפול בשגיאות

```typescript
try {
  await processPayment(paymentData);
} catch (error) {
  switch (error.code) {
    case 'PAYMENT_VALIDATION_ERROR':
      await handleValidationError(error);
      break;
    case 'GATEWAY_ERROR':
      await handleGatewayError(error);
      break;
    default:
      await handleGenericError(error);
  }
}
```

## 📊 ניטור שגיאות
- רישום ללוגים
- שליחת התראות
- ניתוח מגמות
- דוחות תקופתיים 