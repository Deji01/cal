import { 
  formatAvailableSlotsResponse,
  formatRangesForDisplay
} from '../../src/services/formatters';

describe('Formatters', () => {
  describe('formatAvailableSlotsResponse', () => {
    test('should format available slots by date', () => {
      const slots = [
        new Date('2025-05-21T14:00:00Z'),
        new Date('2025-05-21T14:30:00Z'),
        new Date('2025-05-22T15:00:00Z'),
        new Date('2025-05-22T15:30:00Z')
      ];
      
      const ranges = [
        {
          start: slots[0],
          end: slots[1]
        },
        {
          start: slots[2],
          end: slots[3]
        }
      ];
      
      const result = formatAvailableSlotsResponse(slots, ranges);
      
      expect(result).toHaveProperty('2025-05-21');
      expect(result).toHaveProperty('2025-05-22');
      expect(result['2025-05-21'].availableSlots.length).toBe(2);
      expect(result['2025-05-22'].availableSlots.length).toBe(2);
      expect(result['2025-05-21'].wideOpenRanges.length).toBe(1);
      expect(result['2025-05-22'].wideOpenRanges.length).toBe(1);
    });
  });
  
  describe('formatRangesForDisplay', () => {
    test('should format wide open ranges for human display', () => {
      const formattedResult = {
        '2025-05-21': {
          date: 'Wednesday, May 21, 2025',
          availableSlots: ['9:00 AM', '9:30 AM', '10:00 AM'],
          wideOpenRanges: [{
            start: new Date('2025-05-21T14:00:00Z'),
            end: new Date('2025-05-21T15:00:00Z')
          }]
        }
      };
      
      const displayText = formatRangesForDisplay(formattedResult);
      
      expect(displayText).toContain('Wednesday, May 21, 2025');
      expect(displayText).toContain('Available Start Times:');
      expect(displayText).toContain('- 9:00 AM');
      expect(displayText).toContain('Wide Open Ranges:');
      expect(displayText).toContain('- 9:00 AM to 10:00 AM');
    });
  });
});
