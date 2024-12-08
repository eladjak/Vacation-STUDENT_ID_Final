# פרויקט ניהול חופשות - הגשה סופית
> מגיש: אלעד יעקובוביץ'

## מבנה התיקיות
```
elad-yaakobovitch-project/
├── backend/              # קוד צד שרת
├── frontend/             # קוד צד לקוח
├── database/             # גיבוי בסיס הנתונים
└── README.md            # קובץ זה
```

## הוראות התקנה והרצה

### 1. התקנת בסיס הנתונים
```bash
mysql -u root -p
CREATE DATABASE vacation_db;
USE vacation_db;
source database/vacation_db.sql;
```

### 2. התקנת צד שרת
```bash
cd backend
npm install
npm start
```

### 3. התקנת צד לקוח
```bash
cd frontend
npm install
npm start
```

## פרטי התחברות
- מנהל מערכת:
  - אימייל: admin@test.com
  - סיסמה: 123456
- משתמש רגיל:
  - אימייל: user@test.com
  - סיסמה: 123456

## טכנולוגיות בשימוש
- **צד לקוח**: React, TypeScript, Material-UI
- **צד שרת**: Node.js, Express, TypeORM
- **בסיס נתונים**: MySQL 