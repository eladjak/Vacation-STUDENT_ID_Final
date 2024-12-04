# 🌴 VacationVibe - מערכת ניהול חופשות

מערכת חדשנית לניהול והזמנת חופשות, המאפשרת למשתמשים לגלות, לעקוב ולנהל חופשות בצורה קלה ונוחה. המערכת כוללת ממשק משתמש מודרני, ניהול הרשאות, ותצוגת סטטיסטיקות למנהלים.

## ✨ תכונות עיקריות

- 🔐 מערכת הרשאות מתקדמת (משתמשים רגילים ומנהלים)
- 📱 ממשק משתמש רספונסיבי ומודרני
- 🎨 עיצוב נקי ואינטואיטיבי
- 📊 סטטיסטיקות ודוחות מתקדמים למנהלים
- ❤️ מערכת מעקב אחר חופשות מועדפות
- 🌐 תמיכה מלאה בעברית ו-RTL
- 🔄 שמירה אוטומטית בזמן עריכה
- 📸 תמיכה בתמונות חופשה
- 📅 ניהול תאריכים חכם

## 🛠️ טכנולוגיות

### צד לקוח (Frontend)
- React 18 עם TypeScript
- Material-UI (MUI) לעיצוב מודרני
- Redux Toolkit לניהול מצב אפליקציה
- React Router לניווט
- Axios לתקשורת עם השרת
- Chart.js לתצוגת גרפים
- Formik ו-Yup לטיפול בטפסים ותיקוף

### צד שרת (Backend)
- Node.js עם Express
- TypeScript לפיתוח מאובטח
- TypeORM לניהול בסיס הנתונים
- MySQL לאחסון נתונים
- JWT לאימות משתמשים
- Multer לטיפול בהעלאת קבצים

## 🚀 התקנה

### דרישות מקדימות
- Node.js (גרסה 18 ומעלה)
- MySQL (גרסה 8 ומעלה)

### שלבי התקנה

1. שכפל את המאגר:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/vacation-vibe.git
cd vacation-vibe
\`\`\`

2. התקן את הספריות הנדרשות:
\`\`\`bash
# התקנת ספריות צד לקוח
cd client
npm install

# התקנת ספריות צד שרת
cd ../server
npm install
\`\`\`

3. הגדר את קובץ ה-.env בתיקיית השרת:
\`\`\`env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=vacation_db
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
\`\`\`

4. צור את בסיס הנתונים והזן נתוני דוגמה:
\`\`\`bash
cd server
npm run seed
\`\`\`

5. הפעל את השרת:
\`\`\`bash
npm run dev
\`\`\`

6. הפעל את הלקוח:
\`\`\`bash
cd ../client
npm start
\`\`\`

## 👥 משתמשי ברירת מחדל

### מנהל מערכת
- אימייל: admin@test.com
- סיסמה: 123456

### משתמש רגיל
- אימייל: user@test.com
- סיסמה: 123456

## 📁 מבנה הפרויקט

\`\`\`
vacation-vibe/
├── client/                # צד לקוח
│   ├── public/           # קבצים סטטיים
│   └── src/              # קוד מקור
│       ├── components/   # רכיבי React
│       ├── services/     # שירותי API
│       ├── store/        # ניהול מצב (Redux)
│       └── types/        # טיפוסי TypeScript
│
└── server/               # צד שרת
    ├── src/             # קוד מקור
    │   ├── config/      # הגדרות
    │   ├── controllers/ # בקרים
    │   ├── entities/    # ישויות TypeORM
    │   ├── middleware/  # middleware
    │   ├── routes/      # נתיבי API
    │   └── services/    # שירותים
    └── uploads/         # קבצים שהועלו
\`\`\`

## 🔜 פיתוח עתידי

### תכונות מתוכננות
1. 🌍 תמיכה במספר שפות (i18n)
2. 🎯 מערכת המלצות חכמה
3. 📱 אפליקציית מובייל
4. 💳 מערכת תשלומים
5. 🗺️ אינטגרציה עם מפות
6. 📧 מערכת התראות במייל
7. 💬 צ'אט תמיכה
8. 🎟️ מערכת קופונים והנחות
9. 📊 דוחות מתקדמים נוספים
10. 🔍 חיפוש מתקדם עם פילטרים

### שיפורים טכניים מתוכננים
1. 🚀 אופטימיזציה נוספת של ביצועים
2. 📦 הוספת קאשינג
3. 🧪 הרחבת כיסוי הבדיקות
4. 📱 PWA תמיכה
5. 🔐 שיפורי אבטחה נוספים

## 🤝 תרומה לפרויקט

1. צור fork למאגר
2. צור ענף חדש (\`git checkout -b feature/amazing-feature\`)
3. בצע commit לשינויים (\`git commit -m 'הוספת תכונה מדהימה'\`)
4. דחוף לענף (\`git push origin feature/amazing-feature\`)
5. פתח בקשת משיכה

## 📄 רישיון

מופץ תחת רישיון MIT. ראה \`LICENSE\` למידע נוסף.

## 📞 יצירת קשר

שם הפרויקט - [VacationVibe](https://github.com/yourusername/vacation-vibe)

קישור לפרויקט: [https://github.com/yourusername/vacation-vibe](https://github.com/yourusername/vacation-vibe)
