const { Schema, model } = require("mongoose")

const exerciseSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: true
    }
})

module.exports = new model("Exercise", exerciseSchema)