require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRouter = require("./route/user")
const clientInfoRouter = require("./route/clientInfo")
const workspaceRouter = require("./route/workspace")
const contextRouter = require("./route/context")
const mailRouter = require("./route/mail")

const weave = require("weave")

const app = express()
app.use(cors())
app.use(express.json())

weave.init("mailto-outreach-project");

app.use("/api/v1/user", userRouter)
app.use("/api/v1/client", clientInfoRouter)
app.use("/api/v1/workspace", workspaceRouter)
app.use("/api/v1/context", contextRouter)
app.use("/api/v1/mail", mailRouter)

const main = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB connected successfully")
        app.listen(3000)
        console.log("App is listening on port 3000")
    } catch (err) {
        console.error("Error connecting to DB or Server", err.message)
    }
}

main()