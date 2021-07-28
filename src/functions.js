const User = require("./models/User");
const Exercise = require("./models/Exercise")

/* Save the new user */
const createUser = async(username) => {
    let newUser = new User({
        "username": username
    });
    let userSaved = await newUser.save();
    return {
        "username": userSaved.username,
        "_id": userSaved._id
    };
}

/*Search al of the users or a specific user on the database*/
const searchUsers = async(user) => {
    let users = []
    if (user) {
        users = await User.find({ username: user })
    } else {
        users = await User.find({})
    }
    return users
}

/*Search the user with an id*/
const searchUserById = async(id) => {
    let user
    try {
        user = await User.findOne({ _id: id })
    } catch (err) {
        console.log(err)
    }
    return user
}

/*Create a new exercise*/
const createExercise = async(exercise, id) => {
    let username = await searchUserById(id)
    let newExercise = new Exercise({
        "description": exercise.description,
        "duration": exercise.duration,
        "date": (exercise.date) ? exercise.date : undefined,
        "userID": id
    })

    let exerciseSaved = await newExercise.save()
    return {
        "_id": id,
        "username": username.username,
        "date": new Date(exerciseSaved.date).toDateString(),
        "duration": parseInt(exerciseSaved.duration),
        "description": exerciseSaved.description
    }
}

/*Search the exercises that a user has*/
const searchExerciseByUser = async(id, query) => {
    let user = await searchUserById(id)
    let exercises = await Exercise.find({ userID: id })
    let log

    if (!query) {
        log = exercises.map(exer => {
            return {
                "description": exer.description,
                "duration": exer.duration,
                "date": new Date(exer.date).toDateString()
            }
        })
    } else { //filter by a query
        //default query values 
        let from = (query.from) ? new Date(query.from) : new Date(1)
        let to = (query.to) ? new Date(query.to) : new Date()
        let limit = (query.limit) ? parseInt(query.limit) : 99999

        log = exercises.reduce((result, exer, index) => {
            if (exer.date >= from && exer.date <= to && index <= limit - 1) {
                result.push({
                    "description": exer.description,
                    "duration": exer.duration,
                    "date": new Date(exer.date).toDateString()
                })
            }
            return result
        }, [])
    }
    return {
        "_id": id,
        "username": user.userID,
        "count": log.length,
        "log": log
    }

}

module.exports.createUser = createUser
module.exports.searchUsers = searchUsers
module.exports.searchUserById = searchUserById
module.exports.createExercise = createExercise
module.exports.searchExerciseByUser = searchExerciseByUser