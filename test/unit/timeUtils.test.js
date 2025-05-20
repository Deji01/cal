import { parseDateTime, generateTimeSlots, formatDateTime } from '../../services/timeUtils.js';

describe('Time Utilities', () => {
  describe('parseDateTime', () => {
    test('should parse valid datetime string with timezone', () => {
      const result = parseDateTime('2025-05-21T14:00:00-06:00');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-05-21T20:00:00.000Z');
    });
    
    test('should handle UTC timezone offset', () => {
      const result = parseDateTime('2025-05-21T19:00:00Z');
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe('2025-05-21T19:00:00.000Z');
    });
    
    test('should return null for invalid date', () => {
      const result = parseDateTime('invalid-date');
      expect(result).toBeNull();
    });
  });
  
  describe('generateTimeSlots', () => {
    test('should generate 30-minute slots between start and end', () => {
      const start = new Date('2025-05-21T14:00:00Z');
      const end = new Date('2025-05-21T16:00:00Z');
      
      const slots = generateTimeSlots(start, end, 30);
      
      expect(slots.length).toBe(4); // 14:00, 14:30, 15:00, 15:30
      expect(slots[0].toISOString()).toBe('2025-05-21T14:00:00.000Z');
      expect(slots[1].toISOString()).toBe('2025-05-21T14:30:00.000Z');
      expect(slots[2].toISOString()).toBe('2025-05-21T15:00:00.000Z');
      expect(slots[3].toISOString()).toBe('2025-05-21T15:30:00.000Z');
    });
    
    test('should handle empty range', () => {
      const start = new Date('2025-05-21T14:00:00Z');
      const end = new Date('2025-05-21T14:00:00Z');
      
      const slots = generateTimeSlots(start, end, 30);
      expect(slots.length).toBe(0);
    });
  });
  
  describe('formatDateTime', () => {
    test('should format date in specified timezone', () => {
      const date = new Date('2025-05-21T19:00:00Z');
      const formatted = formatDateTime(date, 'America/Chicago');
      
      // Assuming America/Chicago is UTC-6 without DST
      expect(formatted).toMatch(/Wednesday, May 21, 2025, 1:00 PM/);
    });
  });
});
