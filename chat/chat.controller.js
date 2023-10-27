const OpenAI = require("openai");

const UserModel = require("../models/user");
const ProjectModel = require("../models/project");
const AttendanceModel = require("../models/attendance");
const ResourceMapModel = require("../models/resourceMap");
const TicketModel = require("../models/ticket");
const TimesheetModel = require("../models/timesheet");

const openai = new OpenAI({ apiKey: process.env.API_KEY });

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

async function systemContext() {
    const users = await UserModel.find({});
    const projects = await ProjectModel.find({});
    const resourceMap = await ResourceMapModel.find({});
    const tickets = await TicketModel.find({});
    const attendance = await AttendanceModel.find({});
    const timesheet = await TimesheetModel.find({});

    // Define the context for your STAR APP
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
    }
}

exports.chatResponse = async function (req, res) {

    systemContext().then(async (data) => {
        openai.chat.completions.create({
            messages: [
                { role: "system", content: data.context },
                { role: "user", content: "users:" + data.users },
                { role: "user", content: "projects:" + data.projects },
                /* { role: "user", content: "timesheet:" + data.timesheet }, */
                { role: "user", content: "tickets: " + data.tickets + " _id is the primary key"},
                ...req.body.messages
            ],
            model: "gpt-3.5-turbo",
        }).then((completion) => {
            return res.send({"reply": completion.choices[0].message});
        })
    })
}