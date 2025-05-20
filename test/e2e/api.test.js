const request = require('supertest');
const app = require('../../src/app');

// Mock the calendar service
jest.mock('../../src/services/calendarService', () => {
  return {
    checkSlotAvailability: jest.fn().mockImplementation((startTime, endTime) => {
      if (startTime === '2025-05-21T19:00:00Z' && endTime === '2025-05-21T20:00:00Z') {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    }),
    getAvailableSlots: jest.fn().mockResolvedValue({
      formattedAvailability: '### Wednesday, May 21, 2025\nAvailable Start Times:\n- 9:00 AM\n- 9:30 AM\n\nWide Open Ranges:\n- 9:00 AM to 9:30 AM'
    })
  };
});

describe('API Endpoints', () => {
  describe('POST /webhook/getslots', () => {
    test('should return 200 and availability data when slot is unavailable', async () => {
      const response = await request(app)
        .post('/webhook/getslots')
        .send({
          message: {
            toolCalls: [{
              id: 'call_123',
              function: {
                arguments: {
                  starttime: '2025-05-21T19:00:00Z',
                  endtime: '2025-05-21T20:00:00Z'
                }
              }
            }]
          }
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body.results[0].result).toContain('The original time is not available');
    });
    
    test('should return 200 and availability confirmation when slot is available', async () => {
      const response = await request(app)
        .post('/webhook/getslots')
        .send({
          message: {
            toolCalls: [{
              id: 'call_123',
              function: {
                arguments: {
                  starttime: '2025-05-22T19:00:00Z',
                  endtime: '2025-05-22T20:00:00Z'
                }
              }
            }]
          }
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body.results[0].result).toBe('available:true');
    });
  });
  
  describe('GET /health', () => {
    test('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });
});
