import { 
  checkSlotAvailability,
  getAvailableSlots
} from '../../services/integration/calendarService.js';

// Mock the Google Calendar API client
jest.mock('googleapis', () => {
  return {
    google: {
      auth: {
        GoogleAuth: jest.fn().mockImplementation(() => ({
          getClient: jest.fn().mockResolvedValue({})
        }))
      },
      calendar: jest.fn().mockImplementation(() => ({
        events: {
          list: jest.fn().mockImplementation(async ({ timeMin, timeMax }) => {
            // Simple mock implementation that returns different results based on the query timeframe
            if (timeMin === '2025-05-21T19:00:00Z' && timeMax === '2025-05-21T20:00:00Z') {
              return {
                data: {
                  items: [
                    {
                      summary: 'Existing Meeting',
                      start: { dateTime: '2025-05-21T19:00:00Z' },
                      end: { dateTime: '2025-05-21T20:00:00Z' }
                    }
                  ]
                }
              };
            } else {
              return {
                data: {
                  items: [
                    {
                      summary: 'Morning Meeting',
                      start: { dateTime: '2025-05-21T14:00:00Z' },
                      end: { dateTime: '2025-05-21T15:00:00Z' }
                    },
                    {
                      summary: 'Lunch',
                      start: { dateTime: '2025-05-21T17:00:00Z' },
                      end: { dateTime: '2025-05-21T18:00:00Z' }
                    }
                  ]
                }
              };
            }
          })
        }
      }))
    }
  };
});

describe('Calendar Service', () => {
  describe('checkSlotAvailability', () => {
    test('should return false when slot is not available', async () => {
      const startTime = '2025-05-21T19:00:00Z';
      const endTime = '2025-05-21T20:00:00Z';
      
      const available = await checkSlotAvailability(startTime, endTime);
      
      expect(available).toBe(false);
    });
    
    test('should return true when slot is available', async () => {
      const startTime = '2025-05-21T20:00:00Z';
      const endTime = '2025-05-21T21:00:00Z';
      
      const available = await checkSlotAvailability(startTime, endTime);
      
      expect(available).toBe(true);
    });
  });
  
  describe('getAvailableSlots', () => {
    test('should return available slots and ranges', async () => {
      const startDate = '2025-05-21T00:00:00Z';
      const endDate = '2025-05-22T00:00:00Z';
      
      const result = await getAvailableSlots(startDate, endDate);
      
      expect(result).toHaveProperty('formattedAvailability');
      expect(result.formattedAvailability).toContain('Wednesday, May 21, 2025');
      expect(result.formattedAvailability).toContain('Available Start Times');
    });
  });
});
