import { google } from 'googleapis';
import config from '../../config.js';
import { parseDateTime } from '../timeUtils.js';
import { findAvailableSlots, findWideOpenRanges } from '../slotGenerator.js';
import { formatAvailableSlotsResponse, formatRangesForDisplay } from '../formatters.js';

// Initialize Google Calendar API client
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/calendar.readonly']
});

let calendarClient = null;

/**
 * Get Google Calendar API client
 * @returns {Promise<Object>} - Calendar API client
 */
async function getCalendarClient() {
  if (!calendarClient) {
    const authClient = await auth.getClient();
    calendarClient = google.calendar({ version: 'v3', auth: authClient });
  }
  return calendarClient;
}

/**
 * Check if a specific time slot is available (no existing events)
 * @param {string} startTime - Start time in ISO format
 * @param {string} endTime - End time in ISO format
 * @param {string} calendarId - Calendar ID to check
 * @returns {Promise<boolean>} - Whether the slot is available
 */
async function checkSlotAvailability(startTime, endTime, calendarId = 'primary') {
  try {
    const calendar = await getCalendarClient();
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
      maxResults: 1 // We only need to know if there's at least one event
    });
    
    // If there are any events in this time range, the slot is not available
    return response.data.items.length === 0;
  } catch (error) {
    console.error('Error checking slot availability:', error);
    throw error;
  }
}

/**
 * Get available time slots for a date range
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @param {string} calendarId - Calendar ID to check
 * @returns {Promise<Object>} - Available slots and formatted response
 */
async function getAvailableSlots(startDate, endDate, calendarId = 'primary') {
  try {
    const calendar = await getCalendarClient();
    
    // Get all events in the date range
    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate,
      timeMax: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: 'startTime'
    });
    
    const events = response.data.items;
    
    // Process each day in the range
    const startDateTime = parseDateTime(startDate);
    const endDateTime = parseDateTime(endDate) || 
                       new Date(startDateTime.getTime() + config.calendar.defaultLookAheadDays * 24 * 60 * 60 * 1000);
    
    const currentDate = new Date(startDateTime);
    currentDate.setHours(0, 0, 0, 0);
    
    const endSearchDate = new Date(endDateTime);
    endSearchDate.setHours(23, 59, 59, 999);
    
    let allAvailableSlots = [];
    
    // Process each day in the date range
    while (currentDate <= endSearchDate) {
      // Skip weekends
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Set workday start/end times for this day
        const workdayStart = new Date(`${dateStr}T${config.calendar.workdayStart}`);
        const workdayEnd = new Date(`${dateStr}T${config.calendar.workdayEnd}`);
        
        // Filter events for this day
        const dayEvents = events.filter(event => {
          const eventStart = parseDateTime(event.start.dateTime || event.start.date);
          const eventDay = eventStart.toISOString().split('T')[0];
          return eventDay === dateStr;
        }).map(event => ({
          start: parseDateTime(event.start.dateTime || event.start.date),
          end: parseDateTime(event.end.dateTime || event.end.date)
        }));
        
        // Find available slots for this day
        const daySlots = findAvailableSlots(
          workdayStart,
          workdayEnd,
          dayEvents,
          config.calendar.slotDurationMinutes
        );
        
        allAvailableSlots = [...allAvailableSlots, ...daySlots];
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Find wide open ranges
    const wideOpenRanges = findWideOpenRanges(
      allAvailableSlots,
      config.calendar.slotDurationMinutes
    );
    
    // Format response
    const formattedResponse = formatAvailableSlotsResponse(
      allAvailableSlots,
      wideOpenRanges
    );
    
    const formattedAvailability = formatRangesForDisplay(formattedResponse);
    
    return {
      availableSlots: allAvailableSlots,
      wideOpenRanges,
      formattedResponse,
      formattedAvailability
    };
  } catch (error) {
    console.error('Error getting available slots:', error);
    throw error;
  }
}

export { checkSlotAvailability, getAvailableSlots };
