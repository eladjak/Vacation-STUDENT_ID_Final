# תיעוד ה-API

## כללי
- כל הבקשות צריכות לכלול את ה-header הבא:
  ```
  Authorization: Bearer <token>
  ```
- כל התשובות הן בפורמט JSON
- בכל שגיאה יוחזר status code מתאים עם הודעת שגיאה

## אימות

### הרשמה
```
POST /api/v1/auth/register
```

**גוף הבקשה:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string"
}
```

**תשובה מוצלחת:**
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "user"
  },
  "token": "string"
}
```

### התחברות
```
POST /api/v1/auth/login
```

**גוף הבקשה:**
```json
{
  "email": "string",
  "password": "string"
}
```

**תשובה מוצלחת:**
```json
{
  "user": {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string"
  },
  "token": "string"
}
```

### רענון טוקן
```
POST /api/v1/auth/refresh-token
```

**תשובה מוצלחת:**
```json
{
  "token": "string"
}
```

## חופשות

### קבלת רשימת חופשות
```
GET /api/v1/vacations?page=1
```

**פרמטרים אופציונליים:**
- page: מספר העמוד (ברירת מחדל: 1)
- limit: מספר תוצאות בעמוד (ברירת מחדל: 9)

**תשובה מוצלחת:**
```json
{
  "vacations": [
    {
      "id": "number",
      "destination": "string",
      "description": "string",
      "startDate": "string",
      "endDate": "string",
      "price": "number",
      "imageUrl": "string",
      "followersCount": "number",
      "isFollowing": "boolean"
    }
  ],
  "totalPages": "number"
}
```

### קבלת חופשה ספציפית
```
GET /api/v1/vacations/:id
```

**תשובה מוצלחת:**
```json
{
  "id": "number",
  "destination": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "price": "number",
  "imageUrl": "string",
  "followersCount": "number",
  "isFollowing": "boolean"
}
```

### הוספת חופשה חדשה (מנהל)
```
POST /api/v1/vacations
```

**גוף הבקשה:**
```json
{
  "destination": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "price": "number",
  "imageUrl": "string"
}
```

**תשובה מוצלחת:**
```json
{
  "id": "number",
  "destination": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "price": "number",
  "imageUrl": "string",
  "followersCount": 0,
  "isFollowing": false
}
```

### עדכון חופשה (מנהל)
```
PUT /api/v1/vacations/:id
```

**גוף הבקשה:**
```json
{
  "destination": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "price": "number",
  "imageUrl": "string"
}
```

**תשובה מוצלחת:**
```json
{
  "id": "number",
  "destination": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "price": "number",
  "imageUrl": "string",
  "followersCount": "number",
  "isFollowing": "boolean"
}
```

### מחיקת חופשה (מנהל)
```
DELETE /api/v1/vacations/:id
```

**תשובה מוצלחת:**
```json
{
  "message": "Vacation deleted successfully"
}
```

### מעקב/ביטול מעקב אחר חופשה
```
POST /api/v1/vacations/:id/follow
```

**תשובה מוצלחת:**
```json
{
  "id": "number",
  "destination": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "price": "number",
  "imageUrl": "string",
  "followersCount": "number",
  "isFollowing": "boolean"
}
```

## סטטיסטיקות

### קבלת סטטיסטיקות (מנהל)
```
GET /api/v1/vacations/stats
```

**תשובה מוצלחת:**
```json
{
  "labels": ["string"],
  "data": ["number"]
}
``` 