# 🧪 אסטרטגיית בדיקות - VacationVibe

## 📋 סוגי בדיקות

### 1. בדיקות יחידה (Unit Tests)
- בדיקת פונקציות בודדות
- בדיקת קומפוננטות React
- בדיקת שירותים (Services)
- בדיקת Reducers

### 2. בדיקות אינטגרציה
- בדיקת תקשורת בין קומפוננטות
- בדיקת תקשורת עם ה-API
- בדיקת תקשורת עם בסיס הנתונים

### 3. בדיקות End-to-End
- בדיקת תרחישי משתמש מלאים
- בדיקת זרימת עבודה
- בדיקת ממשק משתמש

## 🛠️ כלי בדיקה

### Frontend
```javascript
// Jest
import { render, screen, fireEvent } from '@testing-library/react';
import VacationCard from './VacationCard';

describe('VacationCard', () => {
  it('should render vacation details', () => {
    render(<VacationCard vacation={mockVacation} />);
    expect(screen.getByText(mockVacation.destination)).toBeInTheDocument();
  });
});

// React Testing Library
test('should toggle follow status', async () => {
  render(<VacationCard vacation={mockVacation} />);
  const followButton = screen.getByRole('button', { name: /follow/i });
  await userEvent.click(followButton);
  expect(followButton).toHaveAttribute('aria-pressed', 'true');
});
```

### Backend
```typescript
// Jest + Supertest
import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  it('should login user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456'
      });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

### E2E Tests
```typescript
// Cypress
describe('Vacation Flow', () => {
  it('should allow user to follow vacation', () => {
    cy.login('user@test.com', '123456');
    cy.visit('/vacations');
    cy.get('[data-testid="vacation-card"]').first()
      .find('[data-testid="follow-button"]')
      .click();
    cy.get('[data-testid="follow-count"]')
      .should('contain', '1');
  });
});
```

## 📊 כיסוי בדיקות

### יעדי כיסוי
- Frontend: 80% מינימום
- Backend: 90% מינימום
- E2E: כיסוי תרחישים קריטיים

### דוח כיסוי
```bash
# הרצת בדיקות עם כיסוי
npm run test:coverage

# דוגמה לפלט
-------------------|---------|----------|---------|---------|
File              | % Stmts | % Branch | % Funcs | % Lines |
-------------------|---------|----------|---------|---------|
All files         |   85.71 |    78.95 |   83.33 |   85.71 |
 components/      |   89.47 |    83.33 |   85.71 |   89.47 |
 services/        |   82.35 |    75.00 |   81.82 |   82.35 |
-------------------|---------|----------|---------|---------|
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Test Pipeline

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install Dependencies
        run: npm install
      - name: Run Tests
        run: npm test
      - name: Upload Coverage
        uses: codecov/codecov-action@v2
```

## 📝 כתיבת בדיקות

### מוסכמות
1. שם הבדיקה צריך לתאר את התרחיש
2. הכנת מצב התחלתי ברור
3. ביצוע פעולה
4. בדיקת התוצאה

### דוגמה
```typescript
describe('VacationService', () => {
  // הכנה
  beforeEach(() => {
    // אתחול מצב התחלתי
  });

  // בדיקה
  it('should update vacation followers count when user follows', async () => {
    // הכנת נתונים
    const vacation = await createTestVacation();
    const user = await createTestUser();

    // ביצוע פעולה
    await vacationService.followVacation(vacation.id, user.id);

    // בדיקת תוצאה
    const updatedVacation = await vacationService.getVacation(vacation.id);
    expect(updatedVacation.followersCount).toBe(1);
  });
});
```

## 🐛 דיווח באגים

### תבנית דיווח
```markdown
## תיאור הבאג
[תיאור קצר של הבעיה]

## שלבים לשחזור
1. [צעד ראשון]
2. [צעד שני]
3. [צעד שלישי]

## התנהגות צפויה
[מה אמור לקרות]

## התנהגות בפועל
[מה קורה בפועל]

## מידע נוסף
- גרסה: [x.x.x]
- דפדפן: [שם וגרסה]
- מערכת הפעלה: [שם וגרסה]
```

## 📈 מדדי איכות

### מדדים עיקריים
1. אחוז כיסוי בדיקות
2. זמן ריצת בדיקות
3. מספר באגים שנמצאו
4. זמן תיקון באגים

### דוח ביצועים
```typescript
// דוגמה לבדיקת ביצועים
describe('Performance Tests', () => {
  it('should load vacation list under 2 seconds', async () => {
    const start = performance.now();
    await vacationService.getVacations();
    const end = performance.now();
    expect(end - start).toBeLessThan(2000);
  });
});
``` 