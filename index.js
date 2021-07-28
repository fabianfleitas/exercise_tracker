require("./src/connection")
const express = require("express")
const cors = require("cors")
const app = express()
const port = 3000
const { createUser, searchUsers, searchUserById, createExercise, searchExerciseByUser } = require("./src/functions")

app.use(express.urlencoded({ extended: false }));
app.use(cors({ optionsSuccessStatus: 200 }))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.listen(port, () => {
    console.log("App is listening")
})

/* Receives an username and creates a new user */
app.post("/api/users", async(req, res) => {
    try {
        let createdUser = await createUser(req.body.username)
        res.json(createdUser)
    } catch (err) {
        let searchUser = await searchUsers(req.body.username)
        if (searchUser) {
            res.send("Username already taken")
        } else {
            res.send("Error")
            console.log(err)
        }
    }
})

/*Show the total of users */
app.get("/api/users", async(req, res) => {
    let users = await searchUsers()
    res.send(users)
})

/*Receives the data of the form and redirect to the correct url */
app.post("/", async(req, res) => {
    res.redirect(307, "/api/users/" + req.body.id + "/exercises")
})

/* Receives the data and creates a new exercise for the user */
app.post("/api/users/:id/exercises", async(req, res) => {
    let searchedUser = await searchUserById(req.params.id)
    if (searchedUser) {
        let createdExercise = await createExercise(req.body, req.params.id);
        res.json(createdExercise)
    } else {
        res.send("User not found")
    }
})

/* Show the logs of the user*/
app.get("/api/users/:_id/logs", async(req, res) => {
    let logs
    if (Object.entries(req.query).length > 0) {
        logs = await searchExerciseByUser(req.params._id, req.query)
    } else {
        logs = await searchExerciseByUser(req.params._id)
    }
    res.send(logs)
})