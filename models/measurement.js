const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    measurement: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    '0100011D00FF': {
        type: Number,
        required: true
    },
    '0100021D00FF': {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('measurement', MeasurementSchema);
