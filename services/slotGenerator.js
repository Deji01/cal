const { generateTimeSlots } = require('./timeUtils');

/**
 * Find available time slots between meetings during a workday
 * @param {Date} workdayStart - Start of workday
 * @param {Date} workdayEnd - End of workday
 * @param {Array<{start: Date, end: Date}>} meetings - Array of meetings
 * @param {number} slotDurationMinutes - Duration of each slot in minutes
 * @returns {Date[]} - Array of available slot start times
 */
function findAvailableSlots(workdayStart, workdayEnd, meetings, slotDurationMinutes) {
  // If no meetings, the entire day is available
  if (!meetings || meetings.length === 0) {
    return generateTimeSlots(workdayStart, workdayEnd, slotDurationMinutes);
  }
  
  // Sort meetings by start time
  const sortedMeetings = [...meetings].sort((a, b) => a.start - b.start);
  
  let availableSlots = [];
  let lastEndTime = new Date(workdayStart);
  
  // Find gaps between meetings
  for (const meeting of sortedMeetings) {
    if (meeting.start > lastEndTime) {
      // There's a gap between last meeting's end and this meeting's start
      const slotsInGap = generateTimeSlots(
        lastEndTime, 
        meeting.start, 
        slotDurationMinutes
      );
      availableSlots = [...availableSlots, ...slotsInGap];
    }
    
    // Update last end time if the current meeting ends later
    if (meeting.end > lastEndTime) {
      lastEndTime = new Date(meeting.end);
    }
  }
  
  // Check for available time after the last meeting
  if (lastEndTime < workdayEnd) {
    const slotsAfterLastMeeting = generateTimeSlots(
      lastEndTime,
      workdayEnd,
      slotDurationMinutes
    );
    availableSlots = [...availableSlots, ...slotsAfterLastMeeting];
  }
  
  return availableSlots;
}

/**
 * Find periods with multiple consecutive available slots
 * @param {Date[]} slots - Available time slots
 * @param {number} slotDurationMinutes - Slot duration in minutes
 * @param {number} minimumConsecutiveSlots - Minimum number of consecutive slots to consider a wide open range
 * @returns {Array<{start: Date, end: Date}>} - Wide open time ranges
 */
function findWideOpenRanges(slots, slotDurationMinutes, minimumConsecutiveSlots = 3) {
  if (!slots || slots.length < minimumConsecutiveSlots) {
    return [];
  }
  
  const sortedSlots = [...slots].sort((a, b) => a - b);
  const ranges = [];
  
  let rangeStart = null;
  let lastSlot = null;
  let consecutiveCount = 1;
  const slotDurationMs = slotDurationMinutes * 60 * 1000;
  
  for (let i = 0; i < sortedSlots.length; i++) {
    const currentSlot = sortedSlots[i];
    
    if (lastSlot !== null) {
      const timeDiff = currentSlot - lastSlot;
      
      if (Math.abs(timeDiff - slotDurationMs) < 1000) { // Allow 1 second margin of error
        // This slot is consecutive to the previous one
        if (consecutiveCount === 1) {
          rangeStart = lastSlot;
        }
        consecutiveCount++;
      } else {
        // This slot is not consecutive, check if we have a range to add
        if (consecutiveCount >= minimumConsecutiveSlots) {
          ranges.push({
            start: rangeStart,
            end: lastSlot
          });
        }
        
        // Reset consecutive counter
        consecutiveCount = 1;
      }
    }
    
    lastSlot = currentSlot;
  }
  
  // Check if the last sequence forms a range
  if (consecutiveCount >= minimumConsecutiveSlots && rangeStart !== null) {
    ranges.push({
      start: rangeStart,
      end: lastSlot
    });
  }
  
  return ranges;
}

module.exports = {
  findAvailableSlots,
  findWideOpenRanges
};
