// Import the OpenAI module
const OpenAI = require("openai");

// Import the necessary models
const UserModel = require("../models/user");
const ProjectModel = require("../models/project");
const AttendanceModel = require("../models/attendance");
const ResourceMapModel = require("../models/resourceMap");
const TicketModel = require("../models/ticket");
const TimesheetModel = require("../models/timesheet");

// Create a new OpenAI instance with the provided API key
const openai = new OpenAI({ apiKey: process.env.API_KEY });

// Load environment variables if not in production mode
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

// Fetches system context data from various models
async function systemContext() {
    // Retrieve data from different models
    const users = await UserModel.find({});
    const projects = await ProjectModel.find({});
    const resourceMap = await ResourceMapModel.find({});
    const tickets = await TicketModel.find({});
    const attendance = await AttendanceModel.find({});
    const timesheet = await TimesheetModel.find({});

    // Define the system context for the STAR APP
    const context = `
        You're talking as STAR APP. It is a shift time allowance app developed in the Incedo company. 
        This application has 5 models in the backend: 
        1. User Model stores user information, 
        2. Project Model stores project information, 
        3. ResourceMap Model maps users to projects, 
        4. Attendance Model stores the hours worked and the start date of the week, 
        5. Timesheet Model stores information when attendance is submitted for the week. 
        Additionally, the Ticket Model stores the tickets raised by users. 
        Do not answer any question that is not about the STAR APP.`;

    return {
        context,
        users,
        projects,
        resourceMap,
        tickets,
        attendance,
        timesheet
    };
}

// Handle the chat response logic
exports.chatResponse = async function (req, res) {
    // Retrieve the system context and handle the OpenAI chat completions
    systemContext().then(async (data) => {
        openai.chat.completions.create({
            messages: [
                { role: "system", content: data.context }, // System context
                { role: "system", content: "users:" + data.users }, // User data
                { role: "system", content: "projects:" + data.projects }, // Project data
                /* { role: "user", content: "timesheet:" + data.timesheet }, */ // Timesheet data (commented out)
                { role: "system", content: "tickets: " + data.tickets + " _id is the primary key" }, // Ticket data
                ...req.body.messages // Additional user messages
            ],
            model: "gpt-3.5-turbo", // Specify the model for OpenAI
        }).then((completion) => {
            return res.send({ "reply": completion.choices[0].message }); // Send the completion message as a reply
        });
    });
};