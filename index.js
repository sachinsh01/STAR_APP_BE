var express = require("express")
var cookieParser = require("cookie-parser")
var cors = require("cors")
//const bodyparser = require("body-parser")
var routes = require("./routes")
const Port = 4000

require("./mongoconnection")

var server = express()

server.use(cookieParser())
server.use(cors())
server.use(express.json())
server.use(routes)


server.listen(Port, function() {
    console.log("Server is running on port", Port)
});