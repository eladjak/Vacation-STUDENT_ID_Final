# 🎨 רכיבי ממשק תשלומים - VacationVibe

## 💳 טופס תשלום
```tsx
interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: PaymentError) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  onSuccess,
  onError
}) => {
  // תצוגת הטופס
};
```

## 🔄 תהליך תשלום
1. הצגת סיכום הזמנה
2. מילוי פרטי תשלום
3. אישור ועיבוד
4. הצגת תוצאה

## 📱 התאמה למובייל
- עיצוב רספונסיבי
- טפסים מותאמים
- מקלדת מספרית
- חווית משתמש מיטבית 