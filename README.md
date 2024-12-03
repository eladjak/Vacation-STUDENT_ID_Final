# נערכת ניהול חופשות

מערכת לניהול חופשות המאפשרת למשתמשים לצפות, לעקוב ולנהל חופשות. המערכת כוללת ממשק משתמש ידידותי, ניהול הרשאות, ותצוגת סטטיסטיקות למנהלים.

## תכונות עיקריות

- 🔐 מערכת הרשאות (משתמשים רגילים ומנהלים)
- 📱 ממשק משתמש רספונסיבי
- 🎨 עיצוב מודרני ונקי
- 📊 סטטיסטיקות ודוחות למנהלים
- ❤️ מעקב אחר חופשות מועדפות
- 🌐 תמיכה מלאה בעברית ו-RTL

## טכנולוגיות

### צד לקוח
- React
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Axios
- Chart.js

### צד שרת
- Node.js
- Express
- TypeScript
- TypeORM
- MySQL
- JWT
- Multer

## התקנה

### דרישות מקדימות
- Node.js (גרסה 18 ומעלה)
- MySQL (גרסה 8 ומעלה)

### שלבי התקנה

1. שכפל את המאגר:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/vacation-management.git
cd vacation-management
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

## משתמשי ברירת מחדל

### מנהל
- אימייל: admin@test.com
- סיסמה: 123456

### משתמש רגיל
- אימייל: user@test.com
- סיסמה: 123456

## מבנה הפרויקט

\`\`\`
vacation-management/
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
    │   └── utils/       # כלי עזר
    └── uploads/         # קבצים שהועלו
\`\`\`

## תרומה לפרויקט

1. צור fork למאגר
2. צור ענף חדש (\`git checkout -b feature/amazing-feature\`)
3. בצע commit לשינויים (\`git commit -m 'Add amazing feature'\`)
4. דחוף לענף (\`git push origin feature/amazing-feature\`)
5. פתח בקשת משיכה
