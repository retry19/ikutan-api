const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }, 
  quota: {
    type: Number,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participant: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
})

module.exports = mongoose.model('Event', eventSchema)