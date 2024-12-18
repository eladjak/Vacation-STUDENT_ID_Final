# 🚀 מדריך פריסה - VacationVibe

## 🛠️ דרישות מערכת

### חומרה מינימלית
- CPU: 2 ליבות
- RAM: 4GB
- אחסון: 20GB

### תוכנה
- Docker Engine 24.0.0 ומעלה
- Node.js 18.0.0 ומעלה
- MySQL 8.0 ומעלה
- Redis 7.0 ומעלה

## 🔧 הגדרות סביבה

### משתני סביבה
```env
# Server
NODE_ENV=production
PORT=3001
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=vacation_user
DB_PASS=vacation123
DB_NAME=vacation_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📦 פריסה עם Docker

### 1. בניית Images
```bash
# בניית Image לצד שרת
docker build -t vacation-backend ./server

# בניית Image לצד לקוח
docker build -t vacation-frontend ./client
```

### 2. הרצת Containers
```bash
# הרצת כל השירותים
docker-compose up -d
```

### 3. בדיקת תקינות
```bash
# בדיקת לוגים
docker-compose logs

# בדיקת סטטוס
docker-compose ps
```

## 🔄 עדכון גרסה

### 1. גיבוי
```bash
# גיבוי ��סיס נתונים
./scripts/backup.bat

# גיבוי קבצים
./scripts/files-backup.bat
```

### 2. עדכון
```bash
# משיכת שינויים
git pull origin main

# עדכון Images
docker-compose build

# הפעלה מחדש
docker-compose up -d
```

## 📊 ניטור

### כלים מומלצים
- Prometheus - ניטור מטריקות
- Grafana - ויזואליזציה
- ELK Stack - ניהול לוגים

### הגדרת התראות
- CPU > 80%
- RAM > 90%
- Disk Space > 85%
- Response Time > 2s

## 🔒 אבטחה

### SSL/TLS
- התקנת תעודה
- הגדרת Nginx
- הפניית HTTP ל-HTTPS

### Firewall
- פתיחת פורטים נדרשים
- חסימת גישה לא מורשית
- הגדרת rate limiting

## 🔍 פתרון בעיות

### בעיות נפוצות
1. שגיאת התחברות לDB
2. בעיות זיכרון
3. בעיות רשת

### פקודות שימושיות
```bash
# בדיקת לוגים
docker logs container_name

# כניסה לcontainer
docker exec -it container_name bash

# בדיקת משאבים
docker stats
``` 