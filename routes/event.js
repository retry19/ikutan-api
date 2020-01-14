const router = require('express').Router()
const verify = require('./verifyToken')
const Event = require('../model/Event')
const { addEventValidation } = require('../validation')

router.get('/', verify, async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).send({
      status: "OK",
      msg: "Get all event successfully",
      data: events
    })
  } catch (err) {
    res.status(404).send({ status: "NOT FOUND", msg: err })
  }
})

router.post('/', verify, async (req, res) => {
  const { error } = addEventValidation(req.body)
  if (error) return res.status(400).send({ status: "ERROR", msg: error.details[0].message })

  const { title, date, description, organizer } = req.body

  const event = new Event({
    title: title,
    date: date,
    description: description,
    organizer: organizer
  })
  try {
    const savedEvent = await event.save()
    res.status(201).send({
      status: "OK",
      msg: "Event has added!",
      data: { id: savedEvent._id }
    })
  } catch (err) {
    res.status(400).send({
      status: "ERROR",
      msg: err
    })
  }
})

router.get('/:id', verify, async (req, res) => {
  const { id } = req.params

  try {
    const event = await Event.findById(id)
    res.status(200).send({
      status: "OK",
      msg: "Get event successfully",
      data: event
    })
  } catch (err) {
    res.status(404).send({status: "NOT FOUND", msg: err})
  }
})

router.put('/:id', verify, async (req, res) => {
  const { error } = addEventValidation(req.body)
  if (error) return res.status(400).send({ status: "ERROR", msg: error.details[0].message })

  const { id } = req.params
  const { title, date, description, organizer } = req.body

  try {
    await Event.updateOne({_id: id}, { 
      $set: {
        title: title,
        date: date,
        description: description,
        organizer: organizer
      }
    })
    res.status(200).send({ 
      status: "OK",
      msg: "Event updated successfully",
      data: { id: id } 
    })
  } catch (err) {
    res.status(400).send({ status: "ERROR", msg: err })
  }
})

router.delete('/:id', verify, async (req, res) => {
  const { id } = req.params

  try {
    await Event.remove({_id: id})
    res.status(200).send({
      status: "OK",
      msg: "Event deleted successfully"
    })
  } catch (err) {
    res.status(400).send({ status: "ERROR", msg: err })
  }
})

/**
 * Join event
 */
router.put('/join/:id', verify, async (req, res) => {
  const { id } = req.params
  const { uid } = req.body

  const { participant } = await Event.findById(id)
  const newParticipant = [...participant, uid]

  try {
    await Event.updateOne({_id: id}, {
      $set: {
        participant: newParticipant
      }
    })
    res.status(200).send({
      status: "OK",
      msg: "Join to event successfully",
    })
  } catch (err) {
    res.status(400).send({ status: "ERROR", msg: err })
  }
})

/**
 * Cancel to join event
 */
router.delete('/join/:id', verify, async (req, res) => {
  const { id } = req.params
  const { uid } = req.body

  const { participant } = await Event.findById(id)
  const newParticipant = participant.filter(item => item != uid)

  try {
    await Event.updateOne({_id: id}, {
      $set: {
        participant: newParticipant
      }
    })
    res.status(200).send({
      status: "OK",
      msg: "Cancel join event successfully"
    })
  } catch (err) {
    res.status(400).send({ status: "ERROR", msg: err })
  }
})

module.exports = router