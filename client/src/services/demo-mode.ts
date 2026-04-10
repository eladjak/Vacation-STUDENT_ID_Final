/**
 * Demo Mode Service
 *
 * Provides mock data when the backend is unavailable.
 * Enables the app to work as a portfolio demo without a running server.
 */

import { User, Vacation } from '../types';

let isDemoMode = false;

export const setDemoMode = (value: boolean) => {
  isDemoMode = value;
};

export const getIsDemoMode = () => isDemoMode;

export const DEMO_USER: User = {
  id: 1,
  firstName: 'אורח',
  lastName: 'דמו',
  email: 'demo@example.com',
  role: 'user',
};

export const DEMO_TOKEN = 'demo-token-for-portfolio-preview';

const DEMO_VACATIONS: Vacation[] = [
  {
    id: 1,
    destination: 'פריז, צרפת',
    description: 'חופשה רומנטית בעיר האורות. ביקור במגדל אייפל, שאנז אליזה, ומוזיאון הלובר.',
    startDate: '2026-05-01',
    endDate: '2026-05-08',
    price: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    isFollowing: true,
    followersCount: 12,
  },
  {
    id: 2,
    destination: 'טוקיו, יפן',
    description: 'חוויה תרבותית ייחודית. מקדשים עתיקים, טכנולוגיה מתקדמת, ואוכל מדהים.',
    startDate: '2026-06-15',
    endDate: '2026-06-25',
    price: 8200,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    isFollowing: false,
    followersCount: 8,
  },
  {
    id: 3,
    destination: 'ברצלונה, ספרד',
    description: 'שמש, ים, ארכיטקטורה של גאודי, ולה ראמבלה. חופשה מושלמת!',
    startDate: '2026-07-10',
    endDate: '2026-07-17',
    price: 3800,
    imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400',
    isFollowing: true,
    followersCount: 15,
  },
  {
    id: 4,
    destination: 'ניו יורק, ארה"ב',
    description: 'העיר שלא ישנה לעולם. ברודווי, סנטרל פארק, פסל החירות, וטיימס סקוור.',
    startDate: '2026-08-01',
    endDate: '2026-08-10',
    price: 6500,
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    isFollowing: false,
    followersCount: 20,
  },
  {
    id: 5,
    destination: 'סנטוריני, יוון',
    description: 'האי הקסום עם הבתים הלבנים והכיפות הכחולות. שקיעות מרהיבות ואוכל ים טרי.',
    startDate: '2026-09-05',
    endDate: '2026-09-12',
    price: 5200,
    imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400',
    isFollowing: false,
    followersCount: 18,
  },
  {
    id: 6,
    destination: 'בנגקוק, תאילנד',
    description: 'מקדשים זהובים, שווקי לילה, עיסוי תאילנדי, ואוכל רחוב מדהים.',
    startDate: '2026-10-20',
    endDate: '2026-11-01',
    price: 4100,
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400',
    isFollowing: true,
    followersCount: 10,
  },
  {
    id: 7,
    destination: 'רומא, איטליה',
    description: 'קולוסיאום, ותיקן, מזרקת טרווי, פיצה ופסטה אותנטית.',
    startDate: '2026-04-20',
    endDate: '2026-04-27',
    price: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400',
    isFollowing: false,
    followersCount: 14,
  },
  {
    id: 8,
    destination: 'דובאי, איחוד האמירויות',
    description: 'מגדלי על, קניונים ענקיים, ספארי מדבר, וחוויות יוקרה.',
    startDate: '2026-11-15',
    endDate: '2026-11-22',
    price: 7800,
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
    isFollowing: false,
    followersCount: 6,
  },
];

let vacations = [...DEMO_VACATIONS];

/**
 * Handle demo API requests when backend is unavailable
 */
export const handleDemoRequest = (
  method: string,
  url: string,
  data?: any
): { data: any; status: number } | null => {
  if (!isDemoMode) return null;

  // Auth endpoints
  if (url.includes('/auth/login')) {
    return {
      status: 200,
      data: { user: DEMO_USER, token: DEMO_TOKEN },
    };
  }

  if (url.includes('/auth/verify')) {
    return {
      status: 200,
      data: { user: DEMO_USER },
    };
  }

  // Vacations endpoints
  if (url.includes('/vacations')) {
    const idMatch = url.match(/\/vacations\/(\d+)/);

    if (method === 'GET') {
      if (idMatch) {
        const vacation = vacations.find((v) => v.id === parseInt(idMatch[1]));
        return { status: 200, data: vacation || null };
      }
      return { status: 200, data: vacations };
    }

    if (method === 'POST' && url.includes('/follow')) {
      if (idMatch) {
        vacations = vacations.map((v) =>
          v.id === parseInt(idMatch[1])
            ? { ...v, isFollowing: true, followersCount: v.followersCount + 1 }
            : v
        );
        return { status: 200, data: { success: true } };
      }
    }

    if (method === 'DELETE' && url.includes('/follow')) {
      if (idMatch) {
        vacations = vacations.map((v) =>
          v.id === parseInt(idMatch[1])
            ? { ...v, isFollowing: false, followersCount: Math.max(0, v.followersCount - 1) }
            : v
        );
        return { status: 200, data: { success: true } };
      }
    }
  }

  return null;
};
