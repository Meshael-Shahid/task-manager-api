const express = require('express')
require('./db/mongoose')

const userRouter  = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
const app = express()
const port = process.env.PORT

//automatically parses the json
app.use(express.json())

//routes
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})