const router = require('express').Router()
const verify = require('./verifyToken')
const Event = require('../model/Event')
const User = require('../model/User')
const { addEventValidation } = require('../validation')

router.get('/', verify, async (req, res) => {
  try {
    const events = await Event.find()
    res.status(200).send({
      status: "OK",
      msg: "Get all events successfully",
      data: events
    })
  } catch (err) {
    res.status(404).send({ status: "NOT FOUND", msg: err })
  }
})

router.post('/', verify, async (req, res) => {
  const { error } = addEventValidation(req.body)
  if (error) return res.status(400).send({ status: "ERROR", msg: error.details[0].message })
  
  const { title, date, place, description, quota, organizer } = req.body

  const event = new Event({
    title: title,
    date: date,
    place: place,
    description: description,
    quota: quota,
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
  const { title, date, place, description, quota, organizer } = req.body

  try {
    await Event.updateOne({_id: id}, { 
      title: title,
      date: date,
      place: place,
      description: description,
      quota: quota,
      organizer: organizer 
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

  const { participant, quota } = await Event.findById(id)
  if (participant.includes(uid)) return res.status(400).send({ status: "ERROR", msg: "User has joined" })
  if (participant.length == quota) return res.status(400).send({ status: "ERROR", msg: "Maximum participants" })

  const newParticipant = [...participant, uid]

  try {
    await Event.updateOne({_id: id}, {
      participant: newParticipant
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
      participant: newParticipant
    })
    res.status(200).send({
      status: "OK",
      msg: "Cancel join event successfully"
    })
  } catch (err) {
    res.status(400).send({ status: "ERROR", msg: err })
  }
})

/**
 * List all participants has join the event
 */
router.get('/participants/:id', async (req, res) => {
  const { id } = req.params

  try {
    const { participant } = await Event.findById(id)
    const getParticipants = await User.find({
      _id: {
        $in: participant
      }
    }).select(["name", "email"])
    
    res.status(200).send({
      status: "OK",
      msg: "Get all participants successfully",
      data: getParticipants
    })
  } catch (err) {
    res.status(404).send({ status: "NOT FOUND", msg: err })    
  }
})

module.exports = router