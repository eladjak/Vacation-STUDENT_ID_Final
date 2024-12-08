# אפיון UX/UI - VacationVibe 2.0

## 📋 תוכן עניינים
- [עקרונות עיצוב](#design-principles)
- [סכמת צבעים](#color-scheme)
- [טיפוגרפיה](#typography)
- [רכיבי UI](#ui-components)
- [Responsive Design](#responsive-design)
- [אנימציות ומעברים](#animations)
- [נגישות](#accessibility)

## 🎨 עקרונות עיצוב

### עקרונות כלליים
- מינימליסטי ומודרני
- שימוש בחללים לבנים
- היררכיה ויזואלית ברורה
- עקביות בכל הממשק
- נגישות מובנית

### חוויית משתמש
- פשטות בשימוש
- משוב מיידי
- התאמה אישית
- זרימה טבעית
- מניעת טעויות

## 🎯 סכמת צבעים

### צבעים ראשיים
```css
--primary: #1976d2;
--primary-light: #42a5f5;
--primary-dark: #1565c0;
--secondary: #9c27b0;
--secondary-light: #ba68c8;
--secondary-dark: #7b1fa2;
```

### צבעי רקע
```css
--background: #ffffff;
--surface: #f5f5f5;
--overlay: rgba(0, 0, 0, 0.5);
```

### צבעי טקסט
```css
--text-primary: #212121;
--text-secondary: #757575;
--text-disabled: #9e9e9e;
```

### צבעי סטטוס
```css
--success: #4caf50;
--warning: #ff9800;
--error: #f44336;
--info: #2196f3;
```

## 📝 טיפוגרפיה

### פונטים
- כותרות: Rubik
- טקסט: Assistant
- קוד: Fira Code

### מדרג טיפוגרפי
```css
--h1: 2.5rem;
--h2: 2rem;
--h3: 1.75rem;
--h4: 1.5rem;
--body1: 1rem;
--body2: 0.875rem;
--caption: 0.75rem;
```

## 🧩 רכיבי UI

### כפתורים
- כפתור ראשי (Contained)
- כפתור משני (Outlined)
- כפתור טקסט (Text)
- כפתור אייקון (Icon)

### שדות קלט
- שדה טקסט
- שדה מספר
- בחירה מרובה
- תאריכון
- העלאת קבצים

### כרטיסים
- כרטיס חופשה
- כרטיס פרופיל
- כרטיס סטטיסטיקה
- כרטיס מידע

### ניווט
- תפריט ראשי
- תפריט צד
- תפריט משתמש
- Breadcrumbs

## 📱 Responsive Design

### נקודות שבירה
```css
--xs: 0px;
--sm: 600px;
--md: 960px;
--lg: 1280px;
--xl: 1920px;
```

### Grid System
- 12 עמודות
- מרווחים של 16px
- Container מרכזי
- Auto-layout

### התאמות למובייל
- תפריט המבורגר
- כרטיסים בעמודה אחת
- טפסים מותאמי��
- כפתורים גדולים יותר

## ✨ אנימציות ומעברים

### אנימציות בסיסיות
```css
--transition-fast: 150ms;
--transition-normal: 250ms;
--transition-slow: 350ms;
--easing: cubic-bezier(0.4, 0, 0.2, 1);
```

### סוגי אנימציות
- Fade In/Out
- Slide In/Out
- Scale In/Out
- Rotate
- Ripple Effect

### מצבי אינטראקציה
- Hover
- Active
- Focus
- Loading
- Success/Error

## ♿ נגישות

### WCAG 2.1
- רמה AA
- ניגודיות צבעים
- גדלי טקסט
- מרווחי לחיצה
- תיאורי תמונות

### תמיכה במקלדת
- מיקוד ברור
- קיצורי מקלדת
- ניווט לוגי
- Skip Links

### Screen Readers
- ARIA Labels
- תיאורים חלופיים
- הודעות דינמיות
- מבנה סמנטי

## 📱 תצוגות מסך

### דף ראשי
- Hero Section
- חיפוש מתקדם
- רשימת חופשות
- סינון וחיפוש

### פרופיל משתמש
- מידע אישי
- חופשות במעקב
- היסטוריה
- ��גדרות

### ניהול חופשות
- טבלת חופשות
- עורך חופשה
- סטטיסטיקות
- ניהול תמונות

### מסכי אדמין
- דשבורד
- ניהול משתמשים
- ניהול תוכן
- הגדרות מערכ�� 