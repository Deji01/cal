# Calendar Availability Service - Project Overview

## Introduction
The Calendar Availability Service is a Node.js application designed to check calendar availability and find open meeting slots. It provides a RESTful API that can integrate with various calendar services (primarily Google Calendar) to determine free time slots for scheduling meetings.

## Project Architecture
The project follows a modular architecture with clear separation of concerns:

1. **API Layer**: Express.js web server that handles incoming requests
2. **Controllers**: Process requests and coordinate between services
3. **Services**: Core business logic for availability checking and slot generation
4. **Integration**: External service connections (Google Calendar API)
5. **Utilities**: Helper functions for time handling and formatting

## Core Components

### 1. Express Application (app.js)
This is the entry point of the application that:
- Sets up the Express.js server
- Configures middleware (body-parser)
- Defines API routes
- Provides a health check endpoint
- Starts the server when run directly

### 2. Configuration (config.js)
Contains application-wide settings including:
- Working hours (start/end times)
- Default timezone (America/Chicago)
- Meeting slot duration (30 minutes)
- Default look-ahead period (7 days)
- API port configuration

### 3. Availability Controller (services/controllers/availabilityController.js)
Handles incoming requests and coordinates the application flow:
- `handleGetSlots`: Processes webhook requests to check slot availability
  - If the requested slot is available, returns confirmation
  - If unavailable, finds alternative available time slots

### 4. Calendar Service (services/integration/calendarService.js)
Integrates with Google Calendar API to:
- Initialize and manage Google Calendar API client
- Check availability for specific time slots
- Retrieve all events in a date range
- Find available slots considering working hours and existing meetings
- Generate formatted availability responses

Two primary functions:
- `checkSlotAvailability`: Checks if a specific time slot is free
- `getAvailableSlots`: Finds all available slots in a date range

### 5. Slot Generator (services/slotGenerator.js)
Contains algorithms for finding available meeting times:
- `findAvailableSlots`: Identifies free time between meetings during a workday
- `findWideOpenRanges`: Locates periods with multiple consecutive available slots

### 6. Time Utilities (services/timeUtils.js)
Helper functions for date and time operations:
- `parseDateTime`: Converts strings to Date objects
- `generateTimeSlots`: Creates time slot arrays between start and end times
- `formatDateTime`: Formats dates for human-readable display with timezone support

### 7. Formatters (services/formatters.js)
Format availability data for responses:
- `formatAvailableSlotsResponse`: Groups available slots by date
- `formatRangesForDisplay`: Creates human-readable text representation of availability

## Data Flow

1. **Request Handling**:
   - Client sends a webhook request to `/webhook/getslots` with start and end times
   - Express routes the request to `handleGetSlots` controller

2. **Availability Checking**:
   - Controller extracts time parameters from request
   - Calls `checkSlotAvailability` to determine if the slot is free
   - If available, returns simple confirmation

3. **Alternative Slot Finding** (if requested slot is unavailable):
   - Controller calls `getAvailableSlots` to find alternatives
   - Calendar service fetches all events for the date range
   - For each workday (excluding weekends):
     - Filters events for the current day
     - Uses `findAvailableSlots` to identify free times
     - Uses `findWideOpenRanges` to find consecutive free slots

4. **Response Formatting**:
   - Available slots are grouped by date
   - Formatter creates human-readable representation
   - Controller returns the formatted response to the client

## Configuration Options

The application can be configured through the `config.js` file:
- `workdayStart`: Start time of the workday (default: "09:00:00")
- `workdayEnd`: End time of the workday (default: "18:00:00")
- `timezone`: Default timezone (default: "America/Chicago")
- `slotDurationMinutes`: Length of each meeting slot (default: 30)
- `defaultLookAheadDays`: Days to look ahead when finding slots (default: 7)
- `port`: API server port (default: 3000 or from environment variable)

## Running the Application

- Development mode: `npm run dev` (uses nodemon for auto-reload)
- Production mode: `npm start`
- Testing: `npm test`, `npm run test:watch`, or `npm run test:coverage`

## API Endpoints

1. **Health Check**: `GET /health`
   - Returns status `200 OK` with `{ status: 'OK' }` when server is running

2. **Get Available Slots**: `POST /webhook/getslots`
   - Request format includes start and end times
   - Returns availability status and alternative slots if needed

## Testing Structure

The project includes a comprehensive test suite organized into:
- Unit tests: Testing individual components in isolation
- Integration tests: Testing interactions between components
- End-to-end tests: Testing the entire application flow

## Summary

The Calendar Availability Service is a well-structured application that leverages the Google Calendar API to provide availability checking and meeting slot recommendation. Its modular design allows for easy maintenance and extension, while the comprehensive API makes it suitable for integration with various scheduling systems. 