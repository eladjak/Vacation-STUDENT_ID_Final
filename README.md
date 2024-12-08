`````
# VacationVibe - מערכת ניהול חופשות

## פרטי המפתח
- **שם:** אלעד יעקובוביץ'
- **גיל:** 38
- **התמחות:** מפתח Full-Stack
- **הכשרה:** בוגר מכללת ג'ון ברייס

### פרטי התקשרות
- **אימייל:** eladhiteclearning@gmail.com
- **לינקדאין:** [linkedin.com/in/eladyaakobovitchcodingdeveloper](https://www.linkedin.com/in/eladyaakobovitchcodingdeveloper/)
- **גיטהאב:** [github.com/eladjak](https://github.com/eladjak)
- **טלפון:** 052-542-7474

## תיאור הפרויקט
VacationVibe היא מערכת מתקדמת לניהול והצגת חופשות, המאפשרת למשתמשים לעקוב אחר יעדי נופש מועדפים ולמנהלים לנהל את מאגר החופשות.

### תכונות עיקריות
- **צפייה בחופשות:** הצגת חופשות עם תמונות, תיאורים ומחירים
- **מעקב אחר חופשות:** משתמשים יכולים לעקוב אחר חופשות מעניינות
- **ניהול מערכת:** ממשק ניהול למנהלים לעדכון והוספת חופשות
- **סטטיסטיקות:** גרפים והתפלגויות של מעקב משתמשים אחר חופשות
- **אבטחה:** מערכת הרשאות מתקדמת ואימות משתמשים

### טכנולוגיות
- **צד לקוח:** React, TypeScript, Material-UI, Redux
- **צד שרת:** Node.js, Express, TypeORM
- **בסיס נתונים:** MySQL
- **קאש:** Redis
- **תשתית:** Docker

## התקנה והרצה

### דרישות מקדימות
- Docker Desktop מותקן ופעיל
- Node.js גרסה 18 ומעלה
- פורטים פנויים: 80, 3001, 3306, 6379

### הוראות הרצה
1. שכפל את הפרויקט:
   ```bash
   git clone [repository-url]
   cd vacation-student-id-final
   ```

2. הגדר קובץ .env בתיקיית deployment:
   ```env
   DB_USERNAME=vacation_user
   DB_PASSWORD=vacation123
   DB_DATABASE=vacation_db
   DB_ROOT_PASSWORD=root123
   JWT_SECRET=your_secret_key
   ```

3. הרץ את הפרויקט עם Docker:
   ```bash
   cd deployment/scripts
   docker-build.bat
   docker-start.bat
   ```

4. גש לאפליקציה:
   - ממשק משתמש: http://localhost
   - שרת: http://localhost:3001

### משתמשים לדוגמה
- **מנהל:**
  - אימייל: admin@example.com
  - סיסמה: admin123
- **משתמש רגיל:**
  - אימייל: user@example.com
  - סיסמה: user123

## תיעוד נוסף
- [מבנה הפרויקט](docs/project-structure.md)
- [מדריך למשתמש](docs/user-guide.md)
- [תיעוד API](docs/api.md)
- [אפשרויות פריסה](docs/development/05-deployment-options.md)

## רישיון
כל הזכויות שמורות © 2024
`````
