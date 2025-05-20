import { handleGetSlots } from '../../services/controllers/availabilityController.js';

// Mock the calendar service
jest.mock('../../services/integration/calendarService.js', () => {
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

describe('Availability Controller', () => {
  describe('handleGetSlots', () => {
    test('should return availability message when requested slot is unavailable', async () => {
      const req = {
        body: {
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
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      await handleGetSlots(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        results: [{
          toolCallId: 'call_123',
          result: expect.stringContaining('The original time is not available, here are available slots:')
        }]
      }));
    });
    
    test('should return simple availability confirmation when slot is available', async () => {
      const req = {
        body: {
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
        }
      };
      
      const res = {
        json: jest.fn()
      };
      
      await handleGetSlots(req, res);
      
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        results: [{
          toolCallId: 'call_123',
          result: 'available:true'
        }]
      }));
    });
  });
});
