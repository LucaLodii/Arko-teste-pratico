/**
 * Integration tests for POST /api/calculate endpoint
 */

import request from 'supertest';
import type express from 'express';
import { createApp } from '../app';

describe('Calculation API', () => {
  let app: express.Application;

  const validInput = {
    carValue: 50000,
    monthlyRent: 2200,
    interestRateMonth: 0.015,
    financingTermMonths: 48,
    analysisPeriodMonths: 48,
    downPaymentPercent: 0.25,
    maintenanceAnnual: 2000,
    insuranceRateAnnual: 0.06,
    ipvaRate: 0.04,
  };

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /api/health', () => {
    it('should return 200 with status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/calculate', () => {
    it('should return 200 with valid structure for valid input', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send(validInput)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('cashPurchase');
      expect(res.body).toHaveProperty('financedPurchase');
      expect(res.body).toHaveProperty('rental');
      expect(res.body).toHaveProperty('breakEven');

      expect(res.body.cashPurchase).toHaveProperty('totalCost');
      expect(res.body.cashPurchase).toHaveProperty('breakdown');
      expect(res.body.cashPurchase.breakdown).toHaveProperty('depreciacao');
      expect(res.body.cashPurchase.breakdown).toHaveProperty('ipva');
      expect(res.body.cashPurchase.breakdown).toHaveProperty('seguro');
      expect(res.body.cashPurchase.breakdown).toHaveProperty('manutencao');
      expect(res.body.cashPurchase.breakdown).toHaveProperty('custoOportunidade');

      expect(res.body.financedPurchase).toHaveProperty('totalCost');
      expect(res.body.financedPurchase).toHaveProperty('parcela');
      expect(res.body.financedPurchase).toHaveProperty('totalJuros');
      expect(res.body.financedPurchase).toHaveProperty('breakdown');

      expect(res.body.rental).toHaveProperty('totalCost');
      expect(res.body.rental).toHaveProperty('monthlyCost');

      expect(res.body.breakEven).toHaveProperty('breakEvenCashMonths');
      expect(res.body.breakEven).toHaveProperty('breakEvenFinancedMonths');
    });

    it('should return 400 with Zod error for missing required fields', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({ carValue: 50000 })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    it('should return 400 with Zod error for negative values', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({
          ...validInput,
          carValue: -1000,
        })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
    });

    it('should return 400 with Zod error for invalid data types', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({
          ...validInput,
          interestRateMonth: 2, // max 1
        })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for empty body', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    it('should return 400 for malformed JSON', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send('{invalid json}')
        .set('Content-Type', 'application/json')
        .type('application/json');

      expect(res.status).toBe(400);
    });

    it('should handle large numbers without crashing', async () => {
      const res = await request(app)
        .post('/api/calculate')
        .send({
          ...validInput,
          carValue: 1e12,
          monthlyRent: 1e6,
        })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(typeof res.body.cashPurchase.totalCost).toBe('number');
      expect(typeof res.body.financedPurchase.totalCost).toBe('number');
      expect(typeof res.body.rental.totalCost).toBe('number');
    });
  });

  describe('POST /api/calculate-timeline', () => {
    it('should return 200 with timeline array for valid input', async () => {
      const res = await request(app)
        .post('/api/calculate-timeline')
        .send(validInput)
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('timeline');
      expect(Array.isArray(res.body.timeline)).toBe(true);
      expect(res.body.timeline.length).toBeGreaterThan(0);

      const firstPoint = res.body.timeline[0];
      expect(firstPoint).toHaveProperty('month');
      expect(firstPoint).toHaveProperty('cashCost');
      expect(firstPoint).toHaveProperty('financedCost');
      expect(firstPoint).toHaveProperty('rentalCost');

      expect(typeof firstPoint.month).toBe('number');
      expect(typeof firstPoint.cashCost).toBe('number');
      expect(typeof firstPoint.financedCost).toBe('number');
      expect(typeof firstPoint.rentalCost).toBe('number');
    });

    it('should return 400 with Zod error for missing required fields', async () => {
      const res = await request(app)
        .post('/api/calculate-timeline')
        .send({ carValue: 50000 })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
      expect(Array.isArray(res.body.details)).toBe(true);
    });

    it('should return 400 with Zod error for negative values', async () => {
      const res = await request(app)
        .post('/api/calculate-timeline')
        .send({
          ...validInput,
          carValue: -1000,
        })
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
    });

    it('should return 400 for empty body', async () => {
      const res = await request(app)
        .post('/api/calculate-timeline')
        .send({})
        .set('Content-Type', 'application/json');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Validation failed');
      expect(res.body).toHaveProperty('details');
      expect(Array.isArray(res.body.details)).toBe(true);
    });
  });
});
