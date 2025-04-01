const express = require('express');
const apiRouter = require('../router/router')
require("./db.config");
const cors = require("cors");
const { transpileModule } = require('typescript');




const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: transpileModule }))
app.use((req, res, next) => {
    next()
})
app.use('/api/v1', apiRouter)

// app.use((req, res, next) => {
//     res.status(404).send("Page not found")
// })


module.exports = app