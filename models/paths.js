const mongoose = require('mongoose')

const pathSchema = new mongoose.Schema({
    ID: {
        type: String,
        required: true
    },
    FilePath: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('paths', pathSchema)