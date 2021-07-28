const mongoose = require("mongoose")
require("dotenv").config()
const uri = process.env.MONGO_URI


mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    })
    .catch(err => console.log(err));

const db = mongoose.connection;

db.once("open", () => {
    console.log("Database conected")
})

db.on("error", err => {
    console.log(err)
})