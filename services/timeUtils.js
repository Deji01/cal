class TimeUtils {
  /**
   * Parse a datetime string into a Date object
   * @param {string} dateTimeStr - The datetime string to parse
   * @returns {Date|null} - Parsed Date object or null if invalid
   */
  static parseDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return isNaN(date) ? null : date;
  }

  /**
   * Generate time slots between start and end times
   * @param {Date} start - Start time
   * @param {Date} end - End time
   * @param {number} durationMinutes - Duration of each slot in minutes
   * @returns {Date[]} - Array of slot start times
   */
  static generateTimeSlots(start, end, durationMinutes = 30) {
    const slots = [];
    const durationMs = durationMinutes * 60 * 1000;
    
    let current = new Date(start);
    
    while (current < end) {
      slots.push(new Date(current));
      current = new Date(current.getTime() + durationMs);
    }
    
    return slots;
  }

  /**
   * Format a date object to a human-readable string
   * @param {Date} date - The date to format
   * @param {string} timezone - The timezone to use for formatting
   * @returns {string} - Formatted date string
   */
  static formatDateTime(date, timezone = 'America/Chicago') {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }
}

// Add these standalone function exports
const parseDateTime = TimeUtils.parseDateTime;
const generateTimeSlots = TimeUtils.generateTimeSlots;
const formatDateTime = TimeUtils.formatDateTime;

export { TimeUtils, parseDateTime, generateTimeSlots, formatDateTime };
