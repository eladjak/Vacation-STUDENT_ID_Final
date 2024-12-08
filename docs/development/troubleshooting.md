## פתרון בעיות נפוצות

### בעיות אימות (Authentication)

#### בעיית 401 Unauthorized
1. וודא שה-JWT_SECRET זהה בין השרת והלקוח
2. בדוק שמבנה ה-payload של הטוקן תואם בין השרת והלקוח
3. וודא שה-Authorization header מכיל את המילה Bearer
4. בדוק שהמשתמש קיים במסד הנתונים

#### טיפול בטוקנים
1. השרת צריך לשלוח תגובה במבנה:
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": number,
    "role": string,
    // ...other user fields
  }
}
```

2. הלקוח צריך לשמור את הטוקן ב-localStorage ולהוסיף אותו ל-headers:
```typescript
localStorage.setItem('token', token);
axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### בעיות Docker

#### פתרון בעיות פורטים תפוסים
1. בדוק אילו שירותים משתמשים בפורט:
```powershell
netstat -ano | findstr :3001
```

2. סגור את התהליך:
```powershell
taskkill /PID [מספר_התהליך] /F
```

#### הפעלה מחדש של Docker
1. עצור את כל הקונטיינרים:
```powershell
docker-compose down
```

2. בנה מחדש והפעל:
```powershell
docker-compose up --build -d
```

### בעיות אייקונים ו-Favicon

1. וודא שכל הקבצים הנדרשים קיימים ב-`client/public`:
   - favicon.ico
   - logo192.png
   - logo512.png

2. וודא שה-manifest.json מוגדר נכון:
```json
{
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

### בעיות נפוצות נוספות

#### בעיות קומפילציה
1. נקה את ה-cache:
```bash
npm cache clean --force
```

2. מחק את תיקיית node_modules והתקן מחדש:
```bash
rm -rf node_modules
npm install
```

#### בעיות ESLint
1. וודא שאין כפילויות בקובץ package.json
2. הסר משתנים שאינם בשימוש
3. וודא שכל ההגדרות ב-.eslintrc תואמות