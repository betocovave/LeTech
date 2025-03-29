const WaterFlowData = require('../models/waterFlowData');

// Get water flow data for a user
exports.getData = async (req, res) => {
  try {
    const userId = req.user.userId; // User ID from JWT token
    
    // Get date range filter if provided
    const { startDate, endDate } = req.query;
    let query = { user_id: userId };
    
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const data = await WaterFlowData.find(query).sort({ timestamp: -1 });
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting water flow data:', error);
    res.status(500).json({ message: 'Error getting water flow data' });
  }
};

// Add new water flow data
exports.addData = async (req, res) => {
  try {
    const { flow_value } = req.body;
    const userId = req.user.userId; // User ID from JWT token
    
    const newData = new WaterFlowData({
      user_id: userId,
      flow_value: flow_value
    });
    
    await newData.save();
    res.status(201).json({ message: 'Data added successfully', data: newData });
  } catch (error) {
    console.error('Error adding water flow data:', error);
    res.status(500).json({ message: 'Error adding water flow data' });
  }
};