const mongoose = require('mongoose');

const waterFlowSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  flow_value: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('WaterFlowData', waterFlowSchema);