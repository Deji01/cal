class ResponseFormatter {
  static formatAvailability(availability) {
    return availability
      .map(({ date, availableSlots, wideOpenRanges }) => {
        const times = availableSlots.map((time) => `- ${time}`).join('\n');
        const ranges = wideOpenRanges.length
          ? wideOpenRanges.map((range) => `- ${range.start} to ${range.end}`).join('\n')
          : "None";
          
        return `### ${date}\nAvailable Start Times:\n${times}\n\nWide Open Ranges:\n${ranges}`;
      })
      .join('\n\n');
  }
}

module.exports = ResponseFormatter;
