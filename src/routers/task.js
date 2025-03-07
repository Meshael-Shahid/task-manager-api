const express = require('express')
const Task = require('../models/task.js')
const auth = require('../middleware/auth')
const router = new express.Router()

//adds new task in the db
router.post('/tasks', auth, async (req, res) => {
    
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

//displays all the tasks from the db
//includes sorting as well
router.get('/tasks', auth, async (req, res) => {

    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')

        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        //Simple method
        // const tasks = await Task.find({owner: req.user._id})

        // We can do it by populate method as well
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        

        if (req.user.tasks === 0) {
            return res.status(404).send('No Task found')
        }
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

//displays a particular task from the db
router.get('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Task.find({_id: req.params.id, owner: req.user._id})
        
        if (task.length === 0) {
            return res.status(404).send('No Task found')
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Updates a task details
router.patch('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({
            error: "Invalid Updates"
        })
    }

    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if (!task) {
            return res.status(404).send('No Task found')
        }

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//Deletes a task
router.delete('/tasks/:id', auth, async (req, res) => {
    
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('No task found')
        }

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router