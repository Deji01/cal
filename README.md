# Calendar Availability Service

A Node.js service for checking calendar availability and finding open meeting slots.

## Overview

This service provides an API to check availability in calendars and recommend available time slots for scheduling meetings. It uses Express.js and provides webhook endpoints for integration with other services.

## Features

- Check if a specific time slot is available
- Find and return available time slots
- Configurable working hours and time zones
- RESTful API endpoints

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Deji01/cal.git
   cd cal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the application:
   
   The default configuration is in `config.js`. You can modify the following settings:
   - Working hours (start and end time)
   - Time zone
   - Meeting slot duration
   - Default lookahead period
   - API port (defaults to 3000 or from environment variable)

## Running the Application

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon, which automatically restarts when changes are made.

### Production Mode

```bash
npm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns status `200 OK` with a JSON response `{ status: 'OK' }` if the server is running.

### Get Available Slots

```
POST /webhook/getslots
```

Request body format:
```json
{
  "message": {
    "toolCalls": [
      {
        "id": "call-123",
        "function": {
          "arguments": {
            "starttime": "2023-05-10T14:00:00Z",
            "endtime": "2023-05-10T15:00:00Z"
          }
        }
      }
    ]
  }
}
```

Response:
- If the requested slot is available, returns confirmation
- If unavailable, returns alternative available slots

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Configuration

The main configuration file is `config.js`:

```javascript
const config = {
  calendar: {
    workdayStart: "09:00:00",
    workdayEnd: "18:00:00",
    timezone: "America/Chicago",
    slotDurationMinutes: 30,
    defaultLookAheadDays: 7
  },
  api: {
    port: process.env.PORT || 3000
  }
};
```
