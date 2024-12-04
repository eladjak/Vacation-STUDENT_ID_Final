# 🐳 העלאה לדוקר - VacationVibe

## 📁 מבנה הקבצים

### 1. קבצי Docker
```dockerfile
# docker/backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

```dockerfile
# docker/frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. קבצי תצורה
```nginx
# docker/frontend/nginx.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./client
      dockerfile: ../docker/frontend/Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./server
      dockerfile: ../docker/backend/Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - db
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=3306
      - DB_USERNAME=${DB_USERNAME}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_DATABASE=${DB_DATABASE}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - app-network

  db:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=${DB_DATABASE}
      - MYSQL_USER=${DB_USERNAME}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
```

## 📜 סקריפטים

### 1. סקריפט בנייה
```batch
@echo off
REM build.bat

echo Building Docker images...

docker-compose build

if %ERRORLEVEL% NEQ 0 (
    echo Error building Docker images
    exit /b %ERRORLEVEL%
)

echo Docker images built successfully
```

### 2. סקריפט הפעלה
```batch
@echo off
REM start.bat

echo Starting VacationVibe...

docker-compose up -d

if %ERRORLEVEL% NEQ 0 (
    echo Error starting containers
    exit /b %ERRORLEVEL%
)

echo VacationVibe started successfully
echo Frontend: http://localhost
echo Backend: http://localhost:3001
```

### 3. סקריפט עצירה
```batch
@echo off
REM stop.bat

echo Stopping VacationVibe...

docker-compose down

if %ERRORLEVEL% NEQ 0 (
    echo Error stopping containers
    exit /b %ERRORLEVEL%
)

echo VacationVibe stopped successfully
```

### 4. סקריפט גיבוי
```batch
@echo off
REM backup.bat

set BACKUP_DIR=backups
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_FILE=%BACKUP_DIR%\backup_%TIMESTAMP%.sql

if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

echo Creating database backup...

docker-compose exec db mysqldump -u root -p%DB_ROOT_PASSWORD% %DB_DATABASE% > %BACKUP_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo Error creating backup
    exit /b %ERRORLEVEL%
)

echo Backup created successfully: %BACKUP_FILE%
```

### 5. סקריפט שחזור
```batch
@echo off
REM restore.bat

set BACKUP_FILE=%1

if "%BACKUP_FILE%"=="" (
    echo Please provide backup file path
    exit /b 1
)

if not exist %BACKUP_FILE% (
    echo Backup file not found: %BACKUP_FILE%
    exit /b 1
)

echo Restoring database from backup...

docker-compose exec db mysql -u root -p%DB_ROOT_PASSWORD% %DB_DATABASE% < %BACKUP_FILE%

if %ERRORLEVEL% NEQ 0 (
    echo Error restoring backup
    exit /b %ERRORLEVEL%
)

echo Database restored successfully
```

## 🧪 בדיקות

### 1. בדיקת בנייה
```batch
@echo off
REM test-build.bat

echo Running build tests...

REM Test frontend build
cd client
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Frontend build failed
    exit /b %ERRORLEVEL%
)

REM Test backend build
cd ../server
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Backend build failed
    exit /b %ERRORLEVEL%
)

echo Build tests passed successfully
```

### 2. בדיקות יחידה
```batch
@echo off
REM test-unit.bat

echo Running unit tests...

REM Run frontend tests
cd client
npm test
if %ERRORLEVEL% NEQ 0 (
    echo Frontend tests failed
    exit /b %ERRORLEVEL%
)

REM Run backend tests
cd ../server
npm test
if %ERRORLEVEL% NEQ 0 (
    echo Backend tests failed
    exit /b %ERRORLEVEL%
)

echo Unit tests passed successfully
```

### 3. בדיקות אינטגרציה
```batch
@echo off
REM test-integration.bat

echo Running integration tests...

cd server
npm run test:integration
if %ERRORLEVEL% NEQ 0 (
    echo Integration tests failed
    exit /b %ERRORLEVEL%
)

echo Integration tests passed successfully
```

## 📋 תהליך ההעלאה

1. **הכנה**
   ```batch
   git clone https://github.com/yourusername/vacation-vibe.git
   cd vacation-vibe
   ```

2. **בדיקות**
   ```batch
   test-build.bat
   test-unit.bat
   test-integration.bat
   ```

3. **בנייה**
   ```batch
   build.bat
   ```

4. **הפעלה**
   ```batch
   start.bat
   ```

5. **בדיקת תקינות**
   - בדיקת גישה ל-http://localhost
   - בדיקת גישה ל-http://localhost:3001
   - בדיקת התחברות והרשאות
   - בדיקת פונקציונליות

6. **גיבוי**
   ```batch
   backup.bat
   ```

## 🔍 ניטור

### 1. לוגים
```batch
@echo off
REM logs.bat

set SERVICE=%1

if "%SERVICE%"=="" (
    echo Please specify service (frontend/backend/db)
    exit /b 1
)

docker-compose logs -f %SERVICE%
```

### 2. סטטוס
```batch
@echo off
REM status.bat

docker-compose ps
```

### 3. שימוש במשאבים
```batch
@echo off
REM stats.bat

docker stats
```

## 🛠️ תחזוקה

### 1. עדכון גרסה
```batch
@echo off
REM update.bat

echo Updating VacationVibe...

git pull
build.bat
stop.bat
start.bat

echo Update completed successfully
```

### 2. ניקוי
```batch
@echo off
REM clean.bat

echo Cleaning up Docker resources...

docker-compose down -v
docker system prune -f

echo Cleanup completed successfully
```

## 🚨 טיפול בשגיאות

### 1. בדיקת שגיאות
```batch
@echo off
REM check-errors.bat

echo Checking for errors...

REM Check container status
docker-compose ps
if %ERRORLEVEL% NEQ 0 goto :error

REM Check logs for errors
docker-compose logs --tail=100 | findstr /i "error exception failed"
if %ERRORLEVEL% EQU 0 goto :warning

echo No errors found
exit /b 0

:warning
echo Warning: Found potential issues in logs
exit /b 1

:error
echo Error: Container status check failed
exit /b 2
```

### 2. שחזור אוטומטי
```batch
@echo off
REM auto-recover.bat

echo Starting auto-recovery...

REM Stop containers
docker-compose down

REM Remove volumes
docker-compose down -v

REM Rebuild and start
build.bat
start.bat

echo Auto-recovery completed
```

## 📊 ניטור ביצועים

### 1. בדיקת ביצועים
```batch
@echo off
REM performance.bat

echo Checking system performance...

REM Check container stats
docker stats --no-stream

REM Check application metrics
curl -s http://localhost:3001/metrics

echo Performance check completed
```

### 2. דוח בריאות
```batch
@echo off
REM health.bat

echo Generating health report...

REM Check container health
docker-compose ps

REM Check application health
curl -s http://localhost:3001/health

REM Check database health
docker-compose exec db mysqladmin -u root -p%DB_ROOT_PASSWORD% status

echo Health report generated
```