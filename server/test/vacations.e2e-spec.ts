/**
 * בדיקות E2E למודול החופשות
 * בודק את כל נקודות הקצה של ה-API ואת האינטגרציה המלאה של המערכת
 */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateVacationDto } from '../src/vacations/dto/create-vacation.dto';
import { UpdateVacationDto } from '../src/vacations/dto/update-vacation.dto';

describe('VacationsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let createdVacationId: string;

  /**
   * הגדרת סביבת הבדיקות לפני כל בדיקה
   * מאתחל את האפליקציה עם כל ההגדרות הנדרשות
   */
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // הגדרת ולידציה גלובלית
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();
  });

  /**
   * ניקוי משאבים לאחר סיום כל הבדיקות
   */
  afterAll(async () => {
    await app.close();
  });

  /**
   * בדיקות עבור יצירת חופשה חדשה
   */
  describe('POST /vacations', () => {
    it('should create a new vacation', async () => {
      // הכנת נתוני בדיקה
      const vacation: CreateVacationDto = {
        title: 'Test Vacation',
        description: 'Test Description',
        destination: 'Test Destination',
        startDate: new Date(),
        endDate: new Date(),
        price: 100,
        maxParticipants: 10,
        imageUrls: [],
      };

      // שליחת בקשה ובדיקת התוצאה
      const response = await supertest(httpServer)
        .post('/vacations')
        .send(vacation)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(vacation.title);
      createdVacationId = response.body.id;
    });

    it('should validate required fields', () => {
      return supertest(httpServer)
        .post('/vacations')
        .send({})
        .expect(HttpStatus.BAD_REQUEST)
        .expect(res => {
          expect(res.body.message).toContain('title');
          expect(res.body.message).toContain('description');
        });
    });
  });

  describe('GET /vacations', () => {
    it('should return all vacations', () => {
      return supertest(httpServer)
        .get('/vacations')
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should return a specific vacation', () => {
      return supertest(httpServer)
        .get(`/vacations/${createdVacationId}`)
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.id).toBe(createdVacationId);
        });
    });

    it('should return 404 for non-existent vacation', () => {
      return supertest(httpServer)
        .get('/vacations/non-existent-id')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PATCH /vacations/:id', () => {
    it('should update a vacation', async () => {
      const updateDto: UpdateVacationDto = {
        title: 'Updated Vacation Title',
      };

      return supertest(httpServer)
        .patch(`/vacations/${createdVacationId}`)
        .send(updateDto)
        .expect(HttpStatus.OK)
        .expect(res => {
          expect(res.body.title).toBe(updateDto.title);
        });
    });
  });

  describe('DELETE /vacations/:id', () => {
    it('should delete a vacation', () => {
      return supertest(httpServer)
        .delete(`/vacations/${createdVacationId}`)
        .expect(HttpStatus.OK);
    });

    it('should return 404 after deletion', () => {
      return supertest(httpServer)
        .get(`/vacations/${createdVacationId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
}); 