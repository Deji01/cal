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

export default config;