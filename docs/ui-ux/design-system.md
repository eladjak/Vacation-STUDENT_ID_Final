# 🎨 מערכת עיצוב - VacationVibe

## 🎯 עקרונות עיצוב

### צבעים
```css
/* צבעים ראשיים */
--primary: #2196F3;
--primary-light: #64B5F6;
--primary-dark: #1976D2;

/* צבעים משניים */
--secondary: #FF4081;
--secondary-light: #FF80AB;
--secondary-dark: #F50057;

/* גווני אפור */
--gray-100: #F5F5F5;
--gray-200: #EEEEEE;
--gray-300: #E0E0E0;
--gray-400: #BDBDBD;
--gray-500: #9E9E9E;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;

/* צבעי מצב */
--success: #4CAF50;
--warning: #FFC107;
--error: #F44336;
--info: #2196F3;
```

### טיפוגרפיה
```css
/* כותרות */
h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.3;
}

h3 {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.4;
}

/* טקסט */
body {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
}

.small {
  font-size: 0.875rem;
}

.caption {
  font-size: 0.75rem;
}
```

## 🧩 רכיבים

### כפתורים
```jsx
// כפתור ראשי
<Button variant="contained" color="primary">
  פעולה ראשית
</Button>

// כפתור משני
<Button variant="outlined" color="secondary">
  פעולה משנית
</Button>

// כפתור טקסט
<Button variant="text">
  קישור
</Button>
```

### שדות קלט
```jsx
// שדה טקסט
<TextField
  label="כותרת"
  variant="outlined"
  fullWidth
/>

// שדה סיסמה
<TextField
  type="password"
  label="סיסמה"
  variant="outlined"
/>

// שדה חיפוש
<TextField
  startAdornment={<SearchIcon />}
  placeholder="חיפוש..."
/>
```

### כרטיסים
```jsx
<Card>
  <CardMedia
    component="img"
    height="200"
    image={vacationImage}
  />
  <CardContent>
    <Typography variant="h5">
      {title}
    </Typography>
    <Typography variant="body2">
      {description}
    </Typography>
  </CardContent>
  <CardActions>
    <Button>פעולה</Button>
  </CardActions>
</Card>
```

## 📱 רספונסיביות

### נקודות שבירה
```css
/* מובייל */
@media (max-width: 600px) {
  /* הגדרות */
}

/* טאבלט */
@media (min-width: 601px) and (max-width: 960px) {
  /* הגדרות */
}

/* דסקטופ */
@media (min-width: 961px) {
  /* הגדרות */
}
```

### Grid System
```jsx
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    {/* תוכן */}
  </Grid>
</Grid>
```

## 🎭 אנימציות

### מעברים
```css
/* מעבר כללי */
.transition {
  transition: all 0.3s ease;
}

/* מעבר הופעה */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms ease-in;
}

/* מעבר העלמה */
.fade-exit {
  opacity: 1;
}
.fade-exit-active {
  opacity: 0;
  transition: opacity 300ms ease-out;
}
```

## 🖼️ אייקונים

### שימוש באייקונים
```jsx
// אייקון רגיל
<Icon>favorite</Icon>

// אייקון צבעוני
<Icon color="primary">star</Icon>

// אייקון גדול
<Icon fontSize="large">add</Icon>
```

## 📏 מרווחים

### מערכת Spacing
```css
/* מרווחים */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 1rem;     /* 16px */
--space-4: 1.5rem;   /* 24px */
--space-5: 2rem;     /* 32px */
--space-6: 3rem;     /* 48px */
```

## 🎯 נגישות

### ARIA Labels
```jsx
// כפתור נגיש
<Button
  aria-label="הוסף לרשימת המעקב"
  aria-pressed={isFollowing}
>
  <FavoriteIcon />
</Button>

// תיאור תמונה
<img
  src={image}
  alt="תיאור מפורט של התמונה"
/>
``` 