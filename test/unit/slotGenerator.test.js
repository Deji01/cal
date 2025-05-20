import { 
  findAvailableSlots, 
  findWideOpenRanges
} from '../../services/slotGenerator.js';

describe('Slot Generator', () => {
  describe('findAvailableSlots', () => {
    test('should find available slots between meetings', () => {
      const workdayStart = new Date('2025-05-21T14:00:00Z'); // 9 AM in CST
      const workdayEnd = new Date('2025-05-21T23:00:00Z');   // 6 PM in CST
      
      const meetings = [
        { 
          start: new Date('2025-05-21T16:00:00Z'), // 11 AM CST
          end: new Date('2025-05-21T17:00:00Z')    // 12 PM CST
        },
        { 
          start: new Date('2025-05-21T19:00:00Z'), // 2 PM CST
          end: new Date('2025-05-21T20:00:00Z')    // 3 PM CST
        }
      ];
      
      const slots = findAvailableSlots(workdayStart, workdayEnd, meetings, 30);
      
      // We expect:
      // 9:00 - 11:00 = 4 slots
      // 12:00 - 2:00 = 4 slots
      // 3:00 - 6:00 = 6 slots
      // Total: 14 slots
      expect(slots.length).toBe(14);
    });
    
    test('should handle no meetings', () => {
      const workdayStart = new Date('2025-05-21T14:00:00Z');
      const workdayEnd = new Date('2025-05-21T23:00:00Z');
      
      const slots = findAvailableSlots(workdayStart, workdayEnd, [], 30);
      
      // 9 hour workday = 18 half-hour slots
      expect(slots.length).toBe(18);
    });
  });
  
  describe('findWideOpenRanges', () => {
    test('should identify consecutive slots as wide open ranges', () => {
      const slots = [
        new Date('2025-05-21T14:00:00Z'),
        new Date('2025-05-21T14:30:00Z'),
        new Date('2025-05-21T15:00:00Z'),
        // Gap
        new Date('2025-05-21T16:00:00Z'),
        new Date('2025-05-21T16:30:00Z'),
        new Date('2025-05-21T17:00:00Z'),
        new Date('2025-05-21T17:30:00Z'),
      ];
      
      const ranges = findWideOpenRanges(slots, 30);
      
      expect(ranges.length).toBe(2);
      expect(ranges[0].start).toEqual(slots[0]);
      expect(ranges[0].end).toEqual(slots[2]);
      expect(ranges[1].start).toEqual(slots[3]);
      expect(ranges[1].end).toEqual(slots[6]);
    });
    
    test('should require at least 3 consecutive slots for a wide open range', () => {
      const slots = [
        new Date('2025-05-21T14:00:00Z'),
        new Date('2025-05-21T14:30:00Z'),
        // Gap
        new Date('2025-05-21T16:00:00Z'),
        new Date('2025-05-21T16:30:00Z'),
      ];
      
      const ranges = findWideOpenRanges(slots, 30);
      
      expect(ranges.length).toBe(0);
    });
  });
});
