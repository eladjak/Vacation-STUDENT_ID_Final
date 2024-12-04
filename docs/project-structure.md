# 📁 מבנה הפרויקט - VacationVibe

## 🌳 מבנה תיקיות

```
vacation-vibe/
├── client/                      # צד לקוח
│   ├── public/                  # קבצים סטטיים
│   ├── src/                     # קוד מקור
│   │   ├── components/          # רכיבי React
│   │   │   ├── admin/          # רכיבי ניהול
│   │   │   ├── auth/           # רכיבי אימות
│   │   │   ├── layout/         # רכיבי תבנית
│   │   │   └── vacations/      # רכיבי חופשות
│   │   ├── services/           # שירותים
│   │   ├── store/              # ניהול מצב
│   │   │   └── slices/         # Redux slices
│   │   ├── types/              # טיפוסי TypeScript
│   │   └── utils/              # פונקציות עזר
│   ├── tests/                   # בדיקות
│   └── package.json            # תלויות צד לקוח
│
├── server/                      # צד שרת
│   ├── src/                    # קוד מקור
│   │   ├── config/             # הגדרות
│   │   ├── controllers/        # בקרים
│   │   ├── entities/           # ישויות
│   │   ├── middleware/         # middleware
│   │   ├── routes/             # ניתובים
│   │   ├── services/           # שירותים
│   │   └── utils/              # פונקציות עזר
│   ├── tests/                  # בדיקות
│   └── package.json           # תלויות צד שרת
│
├── deployment/                  # קבצי פריסה
│   ├── docker/                 # קבצי Docker
│   │   ├── frontend/          # הגדרות frontend
│   │   └── backend/           # הגדרות backend
│   └── scripts/               # סקריפטי פריסה
│
├── docs/                       # תיעוד
│   ├── api.md                 # תיעוד API
│   ├── development/           # מסמכי פיתוח
│   ├── project-structure.md   # מבנה הפרויקט
│   └── user-guide.md         # מדריך למשתמש
│
└── README.md                  # תיעוד ראשי
```

## 📦 רכיבים עיקריים

### 🖥️ Client
- **components**: רכיבי React מודולריים
- **services**: לוגיקה עסקית וקריאות API
- **store**: ניהול מצב עם Redux Toolkit
- **types**: הגדרות טיפוסים
- **utils**: פונקציות שימושיות

### ⚙️ Server
- **config**: הגדרות והתחלה
- **controllers**: לוגיקת בקרה
- **entities**: מודלי נתונים
- **middleware**: פונקציות ביניים
- **routes**: הגדרות נתיבים
- **services**: לוגיקה עסקית
- **utils**: פונקציות שימושיות

### 🚀 Deployment
- **docker**: הגדרות קונטיינרים
- **scripts**: סקריפטי פריסה ותחזוקה

### 📚 Docs
- **api.md**: תיעוד ממשקי API
- **development**: מסמכי פיתוח מפורטים
- **project-structure.md**: מבנה הפרויקט
- **user-guide.md**: מדריך למשתמש

## 🔄 תהליכי פיתוח עתידיים

### 📱 Mobile App (בפיתוח)
```
mobile/
├── src/
│   ├── components/
│   ├── navigation/
│   ├── screens/
│   └── services/
└── package.json
```

### 🤖 ML Services (בפיתוח)
```
ml-services/
├── src/
│   ├── models/
│   ├── training/
│   └── prediction/
└── requirements.txt
```

### 🔍 Search Service (בפיתוח)
```
search-service/
├── src/
│   ├── indexing/
│   ├── search/
│   └── api/
└── package.json
```

## 📋 קבצי תצורה

### Client
- **package.json**: תלויות ותסריטים
- **tsconfig.json**: הגדרות TypeScript
- **.babelrc**: הגדרות Babel
- **craco.config.js**: הגדרות בנייה

### Server
- **package.json**: תלויות ותסריטים
- **tsconfig.json**: הגדרות TypeScript
- **.env**: משתני סביבה
- **ormconfig.json**: הגדרות TypeORM

### Deployment
- **docker-compose.yml**: הגדרות Docker
- **Dockerfile**: הגדרות בנייה
- **nginx.conf**: הגדרות Nginx

## 🔒 קבצים מוחרגים
- **/node_modules**
- **/.env**
- **/dist**
- **/build**
- **/coverage**
- **/.DS_Store**