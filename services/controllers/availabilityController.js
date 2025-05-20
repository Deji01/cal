import { checkSlotAvailability, getAvailableSlots } from '../services/calendarService';

/**
 * Handle the getSlots request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function handleGetSlots(req, res) {
  try {
    const { starttime, endtime } = req.body.message.toolCalls[0].function.arguments;
    const toolCallId = req.body.message.toolCalls[0].id;
    
    // Check if the requested slot is available
    const isAvailable = await checkSlotAvailability(starttime, endtime);
    
    if (isAvailable) {
      // Slot is available, return simple confirmation
      res.json({
        results: [{
          toolCallId,
          result: `available:${isAvailable}`
        }]
      });
    } else {
      // Slot is not available, find alternatives
      const { formattedAvailability } = await getAvailableSlots(
        starttime.split('T')[0] + 'T00:00:00Z',
        new Date(new Date(starttime).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      );
      
      // Clean up the formatted availability for response
      const cleanedMessage = formattedAvailability
        .replace(/\n/g, ' ')
        .replace(/\s*:\s*/g, ':')
        .replace(/\s+/g, ' ')
        .trim();
      
      res.json({
        results: [{
          toolCallId,
          result: `The original time is not available, here are available slots:${cleanedMessage}`
        }]
      });
    }
  } catch (error) {
    console.error('Error handling getSlots request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}

module.exports = {
  handleGetSlots
};
