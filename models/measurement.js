const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    measurement: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    tags: {
        muid: String,
        quality:  String
    },
    '0100011D00FF': {
        type: Number
    },
    '0100021D00FF': {
        type: Number
    }
});

module.exports = mongoose.model('measurement', MeasurementSchema);
