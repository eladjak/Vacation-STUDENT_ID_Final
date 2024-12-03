# מבנה האפליקציה

## מבנה תיקיות

```
vacation-project/
├── client/                     # צד לקוח - React + TypeScript
│   ├── public/                 # קבצים סטטיים
│   └── src/
│       ├── components/         # קומפוננטות React
│       │   ├── admin/         # קומפוננטות למנהל
│       │   ├── auth/          # קומפוננטות אימות
│       │   ├── layout/        # קומפוננטות מבנה
│       │   └── vacations/     # קומפוננטות חופשות
│       ├── services/          # שירותי API
│       ├── store/             # ניהול מצב Redux
│       ├── styles/            # סגנונות גלובליים
│       └── types/             # הגדרות TypeScript
└── server/                    # צד שרת - Node.js + Express + TypeORM
    ├── src/
    │   ├── config/           # הגדרות
    │   ├── controllers/      # בקרים
    │   ├── entities/         # ישויות TypeORM
    │   ├── middleware/       # middleware
    │   ├── routes/          # הגדרות נתיבים
    │   ├── services/        # לוגיקה עסקית
    │   └── utils/           # כלי עזר
    └── uploads/             # קבצים שהועלו
        └── vacations/       # תמונות חופשות
```

## קבצים חשובים

### צד לקוח (client)

- **src/App.tsx**: קומפוננטת הבסיס, הגדרת נתיבים
- **src/index.tsx**: נקודת כניסה, הגדרות בסיסיות
- **src/types/index.ts**: הגדרות טיפוסים מרכזיות
- **src/store/index.ts**: הגדרת Redux store
- **src/services/api.ts**: הגדרות Axios ו-interceptors

### צד שרת (server)

- **src/index.ts**: נקודת כניסה לשרת
- **src/config/data-source.ts**: הגדרות TypeORM
- **src/entities/*.ts**: הגדרות מודלים
- **src/middleware/auth.ts**: middleware אימות

## קומפוננטות מרכזיות

### מנהל (Admin)
- **AddVacation**: הוספת חופשה חדשה
- **EditVacation**: עריכת חופשה קיימת
- **VacationStats**: סטטיסטיקות חופשות

### אימות (Auth)
- **Login**: התחברות
- **Register**: הרשמה
- **PrivateRoute**: הגנה על נתיבים פרטיים
- **AdminRoute**: הגנה על נתיבי מנהל

### חופשות (Vacations)
- **VacationList**: רשימת חופשות
- **VacationCard**: כרטיס חופשה בודד

## שירותים (Services)

### צד לקוח
- **auth.service.ts**: ניהול אימות
- **vacation.service.ts**: ניהול חופשות
- **api.ts**: הגדרות Axios

### צד שרת
- **auth.service.ts**: לוגיקת אימות
- **vacation.service.ts**: לוגיקת חופשות
- **user.service.ts**: לוגיקת משתמשים

## ניהול מצב (State Management)

### Slices
- **authSlice.ts**: ניהול מצב אימות
- **vacationSlice.ts**: ניהול מצב חופשות

## סכמת נתונים

### Users
- id
- firstName
- lastName
- email
- password
- role

### Vacations
- id
- destination
- description
- startDate
- endDate
- price
- imageUrl
- followersCount

### VacationFollows
- id
- userId
- vacationId

## קבצים מיותרים שניתן למחוק

1. כל הקבצים ב-server/api/ (אם קיימים)
2. קבצי PHP ישנים
3. קבצי .map
4. קבצים כפולים בתיקיות components
5. קבצי types ישנים או כפולים

## המלצות לשיפור המבנה

1. העברת כל הקומפוננטות לתיקיית components
2. איחוד קבצי types
3. הוספת תיקיית tests לבדיקות
4. הוספת תיקיית constants לקבועים
5. הוספת תיקיית hooks לhooks משותפים
6. הוספת תיקיית utils לפונקציות עזר 