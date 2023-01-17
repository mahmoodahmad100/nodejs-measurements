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
        muid: String,
        quality:  String
    },
    '0100011D00FF': {
        type: Number,
        default: function() {
            let value = this['0100011D00FF'];
            if (typeof value == 'object' || value == null || !value) {
              return 0;
            }
            return value;
        }
    },
    '0100021D00FF': {
        type: Number,
        default: function() {
            let value = this['0100021D00FF'];
            if (typeof value == 'object' || value == null || !value) {
                return 0;
            }
            return value;
        }
    }
});

module.exports = mongoose.model('measurement', MeasurementSchema);
