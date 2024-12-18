# 🌴 VacationVibe - מערכת ניהול חופשות

## 📋 תיאור המערכת
מערכת VacationVibe היא פלטפורמה מתקדמת לניהול והזמנת חופשות, המציעה חוויית משתמש עשירה ומערכת ניהול יעילה.

## ✨ תכונות עיקריות
- **ניהול חופשות**: הוספה, עריכה ומחיקה של חופשות
- **מערכת הזמנות**: תהליך הזמנה מתקדם עם אישורים אוטומטיים
- **תשלומים**: אינטגרציה עם מערכות תשלום מובילות
- **התראות**: מערכת התראות בזמן אמת
- **סטטיסטיקות**: דוחות וניתוח נתונים מתקדם
- **ממשק רספונסיבי**: תמיכה בכל סוגי המכשירים
- **PWA**: תמיכה מלאה כאפליקציית Progressive Web App

## 🛡️ אבטחה
- **הרשאות**: מערכת הרשאות מתקדמת עם RBAC
- **אימות**: JWT מאובטח עם רענון אוטומטי
- **הצפנה**: הצפנת נתונים רגישים ותעבורה
- **אבטחת API**: הגנה מפני התקפות נפוצות
- **ניטור**: מערכת ניטור ורישום פעילות

## 🛠️ טכנולוגיות

### Frontend
- **React 18** + **TypeScript**
- **Material-UI v5** עם תמיכה ב-RTL
- **Redux Toolkit** לניהול מצב
- **Socket.IO** להתראות בזמן אמת
- **Chart.js** לויזואליזציה
- **PWA** לתמיכה במובייל

### Backend
- **Node.js** + **NestJS**
- **TypeORM** עם **MySQL**
- **Redis** לקאש והתראות
- **Bull** לתורים ועיבוד משימות
- **Socket.IO** לתקשורת בזמן אמת
- **Winston** לרישום לוגים

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** כ-reverse proxy
- **GitHub Actions** ל-CI/CD
- **ELK Stack** לניטור ולוגים
- **Prometheus** + **Grafana** למטריקות

## 🚀 התקנה והרצה

### דרישות מקדימות
- Docker Desktop מותקן ופעיל
- Node.js גרסה 18 ומעלה
- פורטים פנויים: 80, 3001, 3306, 6379

### שלבי ההתקנה

1. **שכפול הפרויקט**
   ```bash
   git clone https://github.com/username/vacation-vibe.git
   cd vacation-vibe
   ```

2. **הגדרת משתני סביבה**
   ```bash
   cp deployment/.env.example deployment/.env
   # ערוך את הקובץ עם הערכים המתאימים
   ```

3. **הרצת המערכת**
   ```bash
   docker-compose up -d
   ```

4. **בדיקת תקינות**
   ```bash
   docker-compose ps
   curl http://localhost/health
   ```

## 📁 מבנה הפרויקט
```
vacation-vibe/
├── client/                 # React Frontend
│   ├── public/            # קבצים סטטיים
│   └── src/               # קוד מקור
│       ├── components/    # רכיבי React
│       ├── features/      # מודולים עסקיים
│       ├── services/      # שירותים ו-API
│       └── store/         # Redux store
│
├── server/                # NestJS Backend
│   └── src/
│       ├── modules/      # מודולים עסקיים
│       ├── common/       # שירותים משותפים
│       ├── config/       # הגדרות
│       └── main.ts       # נקודת כניסה
│
├── deployment/            # קבצי פריסה
│   ├── docker/           # הגדרות Docker
│   └── k8s/              # Kubernetes
│
└── docs/                 # תיעוד מקיף
    ├── technical/       # תיעוד טכני
    ├── business/       # תיעוד עסקי
    └── operations/     # תיעוד תפעולי
```

## 📚 תיעוד
- [תיעוד טכני מלא](./docs/technical/)
- [מדריך למשתמש](./docs/user/)
- [מדריך פריסה](./docs/deployment/)
- [אסטרטגיית בדיקות](./docs/testing/)

## ⚠️ הערות חשובות

### אבטחה
- יש להגדיר JWT_SECRET חזק בסביבת הייצור
- מומלץ להפעיל HTTPS בפריסה
- יש לעדכן סיסמאות ברירת מחדל
- יש להגדיר מדיניות CORS מתאימה

### ביצועים
- Redis משמש לקאש ומשפר ביצועים
- תמונות עוברות אופטימיזציה אוטומטית
- המערכת מוגדרת ל-auto-scaling
- מומלץ להגדיר CDN בסביבת ייצור

### תחזוקה
- יש לגבות את בסיס הנתונים באופן קבוע
- יש לנטר את הלוגים והמטריקות
- יש לעקוב אחר עדכוני אבטחה
- יש לבצע בדיקות עומסים תקופתיות

## 📝 רישיון
פרויקט זה מוגן תחת רישיון MIT. ראה [LICENSE](LICENSE) לפרטים נוספים.

## 👨‍💻 אודות המפתח

### אלעד יעקובוביץ'
- **התמחות**: מפתח Full-Stack
- **הכשרה**: בוגר מכללת ג'ון ברייס
- **גיל**: 38

### פרטי התקשרות
- **אימייל**: [eladhiteclearning@gmail.com](mailto:eladhiteclearning@gmail.com)
- **לינקדאין**: [eladyaakobovitchcodingdeveloper](https://www.linkedin.com/in/eladyaakobovitchcodingdeveloper/)
- **גיטהאב**: [eladjak](https://github.com/eladjak)
- **טלפון**: 052-542-7474

## 📄 רישיון
כל הזכויות שמורות © 2024 אלעד יעקובוביץ'