const Partner = require('../models/Partner');


// fetch all the available attendants
exports.getAvailableAttendants = async (req, res) => {
    const { dateTime } = req.body;
  
    try {
        const availableAttendants = await Partner.find({
            status: true,
            availableFrom: { $lte: dateTime },  // Attendant is available from this time or earlier
            availableTo: { $gte: dateTime }     // Attendant is available until this time or later
          });
      
        res.json(availableAttendants);
    } catch (error) {
        console.error('Error fetching available attendants:', error);
        throw error;
    }
}