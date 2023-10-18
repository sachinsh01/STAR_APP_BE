require("dotenv").config();
//import readline from "readline";
const OpenAI = require("openai");

var UserModel = require("./models/user");
var ProjectModel = require("./models/project");
var AttendanceModel = require("./models/attendance");
var ResourceMapModel = require("./models/resourceMap");
var TicketModel = require("./models/ticket");
const TimesheetModel = require("./models/timesheet");

const openai = new OpenAI({ apiKey: process.env.API_KEY });

/* const ui = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

ui.prompt(); */

const context = "You're talking as STAR APP. It is a shift time allowance app developed in the Incedo company. This application has 5 Models in Backend. User Model that stores the user information, Project Model that stores the project Information, ResourceMap Model that Maps the users to projects, Attendance Model that stores the hours that the employee has worked in a week in the hours array in attendance and weekStartDate stores the start date of that week, Timesheet Model stores the information when the attendance is submitted for the week. Last, the ticket model that stores the tickets that the user has raised. The information stored in the database is"

async function data() {
    const users = await UserModel.find({})
    const projects = await ProjectModel.find({})
    const resourceMap = await ResourceMapModel.find({})
    const tickets = await TicketModel.find({})
    const attendance = await AttendanceModel.find({})
    const timesheet = await TimesheetModel.find({})

    const fData = {
        users,
        projects,
        resourceMap,
        tickets,
        attendance,
        timesheet
    }

    return context + fData
}



const d = data()
console.log(d)


/* 
    ui.on("line", async input => {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: d },
                { role: "user", content: input }
            ],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0].message.content);
        ui.prompt()
    }) */
