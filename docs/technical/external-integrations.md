# 🔌 אינטגרציות חיצוניות - VacationVibe

## 💳 שערי תשלום

### שער תשלומים ראשי
```typescript
interface PaymentGatewayConfig {
  apiKey: string;
  environment: 'sandbox' | 'production';
  timeout: number;
  retryAttempts: number;
}
```

### שער תשלומים גיבוי
- הגדרות חיבור
- תנאי מעבר
- טיפול בשגיאות

## 📧 שירותי דיוור
- מערכת התראות
- אישורי תשלום
- עדכוני סטטוס

## 📱 התראות
- SMS
- Push Notifications
- WebHooks 