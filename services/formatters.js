import { formatDateTime } from "./timeUtils.js";
import config from "../config.js";
/**
 * Format available slots and ranges by date
 * @param {Date[]} slots - Available time slots
 * @param {Array<{start: Date, end: Date}>} ranges - Wide open time ranges
 * @returns {Object} - Formatted availability by date
 */
function formatAvailableSlotsResponse(slots, ranges) {
  const slotsByDate = {};

  // Group slots by date
  slots.forEach((slot) => {
    const dateKey = slot.toISOString().split("T")[0];

    if (!slotsByDate[dateKey]) {
      slotsByDate[dateKey] = {
        date:
          formatDateTime(
            new Date(`${dateKey}T12:00:00Z`),
            config.calendar.timezone
          ).split(",")[0] +
          "," +
          formatDateTime(
            new Date(`${dateKey}T12:00:00Z`),
            config.calendar.timezone
          ).split(",")[1],
        availableSlots: [],
        wideOpenRanges: [],
      };
    }

    slotsByDate[dateKey].availableSlots.push(
      formatDateTime(slot, config.calendar.timezone).split(", ").pop()
    );
  });

  // Add ranges to corresponding dates
  ranges.forEach((range) => {
    const dateKey = range.start.toISOString().split("T")[0];

    if (slotsByDate[dateKey]) {
      slotsByDate[dateKey].wideOpenRanges.push(range);
    }
  });

  return slotsByDate;
}

/**
 * Format availability data into human-readable text
 * @param {Object} formattedData - Availability data by date
 * @returns {string} - Formatted text
 */
function formatRangesForDisplay(formattedData) {
  const timezone = config.calendar.timezone;

  return Object.entries(formattedData)
    .map(([dateKey, data]) => {
      const { date, availableSlots, wideOpenRanges } = data;

      const slotsText = availableSlots.map((time) => `- ${time}`).join("\n");

      const rangesText =
        wideOpenRanges.length > 0
          ? wideOpenRanges
              .map((range) => {
                const startTime = range.start.toLocaleTimeString("en-US", {
                  timeZone: timezone,
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });
                const endTime = range.end.toLocaleTimeString("en-US", {
                  timeZone: timezone,
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                });

                return `- ${startTime} to ${endTime}`;
              })
              .join("\n")
          : "None";

      return `### ${date}\nAvailable Start Times:\n${slotsText}\n\nWide Open Ranges:\n${rangesText}`;
    })
    .join("\n\n");
}

export { formatAvailableSlotsResponse, formatRangesForDisplay };
