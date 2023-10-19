// Import required packages and modules
const express = require("express"); // Import the express framework
const cookieParser = require("cookie-parser"); // Import the cookie-parser middleware
const cors = require("cors"); // Import the cors middleware for handling Cross-Origin Resource Sharing
const routes = require("./routes"); // Import the routes module
const Port = 4000; // Define the port number on which the server will run

// Establish connection to MongoDB
require("./mongoconnection"); // Import and execute the code for establishing a connection to MongoDB

// Create an instance of the Express server
const server = express();

// Use the cookie-parser middleware
server.use(cookieParser());

// Enable Cross-Origin Resource Sharing (CORS) for the server
server.use(cors());

// Parse incoming requests with JSON payloads
server.use(express.json());

// Use the defined routes for the server
server.use(routes);

require("dotenv").config();
const readline =  require("readline");
const OpenAI = require("openai");

const UserModel = require("./models/user");
const ProjectModel = require("./models/project");
const AttendanceModel = require("./models/attendance");
const ResourceMapModel = require("./models/resourceMap");
const TicketModel = require("./models/ticket");
const TimesheetModel = require("./models/timesheet");

const openai = new OpenAI({ apiKey: process.env.API_KEY });

const ui = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ui.prompt();

const context = "You're talking as STAR APP. It is a shift time allowance app developed in the Incedo company. This application has 5 Models in Backend. User Model that stores the user information, Project Model that stores the project Information, ResourceMap Model that Maps the users to projects, Attendance Model that stores the hours that the employee has worked in a week in the hours array in attendance and weekStartDate stores the start date of that week, Timesheet Model stores the information when the attendance is submitted for the week. Last, the ticket model that stores the tickets that the user has raised. The information stored in the database is"

async function data() {
    const users = await UserModel.find({})
    const projects = await ProjectModel.find({})
    const resourceMap = await ResourceMapModel.find({})
    const tickets = await TicketModel.find({})
    const attendance = await AttendanceModel.find({})
    const timesheet = await TimesheetModel.find({})

    const fData = {
        users
    }

    return context + users
}



ui.on("line", async input => {
    data().then(async (d) => {
        const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: d },
            { role: "user", content: input }
        ],
        model: "gpt-3.5-turbo",
    });
    
    console.log(completion.choices[0].message.content);
    })
    ui.prompt()
})




// Start the server and listen on the specified port
server.listen(Port, function() {
    console.log("Server is running on port", Port); // Print a message indicating that the server is running and listening on the specified port
});