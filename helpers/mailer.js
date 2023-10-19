// Import necessary modules
const nodemailer = require("nodemailer");
const moment = require('moment');

// Load environment variables in development environment
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Create a mail transporter with Gmail service and authentication
let mailTransporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail service for mailing
  auth: {
    user: process.env.STAR_EMAIL, // Use the email from environment variables
    pass: process.env.STAR_PASS, // Use the password from environment variables
  },
});

// Function to send an email with user credentials
exports.email = function (user, password) {

  // Define email details including the sender, receiver, subject, and HTML content
  let details = {
    from: "starapp.incedo@gmail.com", // Sender's email
    to: user.email, // Receiver's email
    subject: "STAR APP: Account Created", // Email subject
    html: `<!DOCTYPE html>
    <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
    
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
      <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet" type="text/css"><!--<![endif]-->
      <style>
        * {
          box-sizing: border-box;
        }
    
        body {
          margin: 0;
          padding: 0;
        }
    
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }
    
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }
    
        p {
          line-height: inherit
        }
    
        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }
    
        .image_block img+div {
          display: none;
        }
    
        @media (max-width:700px) {
          .desktop_hide table.icons-inner {
            display: inline-block !important;
          }
    
          .icons-inner {
            text-align: center;
          }
    
          .icons-inner td {
            margin: 0 auto;
          }
    
          .image_block img.fullWidth {
            max-width: 100% !important;
          }
    
          .mobile_hide {
            display: none;
          }
    
          .row-content {
            width: 100% !important;
          }
    
          .stack .column {
            width: 100%;
            display: block;
          }
    
          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }
    
          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
    
          .row-1 .column-1 .block-2.heading_block td.pad {
            padding: 10px 60px 30px !important;
          }
    
          .row-1 .column-1 .block-2.heading_block h1 {
            font-size: 33px !important;
          }
    
          .row-5 .column-1 .block-1.heading_block h2 {
            font-size: 20px !important;
          }
    
          .row-3 .column-1 .block-1.paragraph_block td.pad {
            padding: 5px 30px !important;
          }
        }
      </style>
    </head>
    
    <body style="background-color: #1a30eb; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
      <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1a30eb;">
        <tbody>
          <tr>
            <td>
              <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #fff; border-bottom: 0 solid #fff; border-left: 0 solid #fff; border-radius: 30px 30px 0 0; border-right: 0px solid #fff; border-top: 0 solid #fff; color: #000; width: 680px; margin: 0 auto;" width="680">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <div class="spacer_block block-1" style="height:40px;line-height:40px;font-size:1px;">&#8202;</div>
                              <table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-bottom:30px;padding-left:60px;padding-right:60px;padding-top:30px;text-align:center;width:100%;">
                                    <h1 style="margin: 0; color: #020b22; direction: ltr; font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 40px; font-weight: 700; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0;">Account created on the STAR APP</h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 680px; margin: 0 auto;" width="680">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                    <div class="alignment" align="center" style="line-height:10px"><img class="fullWidth" src="https://703c827c22.imgdist.com/public/users/Integrators/BeeProAgency/1062338_1047553/STAR.png" style="display: block; height: auto; border: 0; max-width: 442px; width: 100%;" width="442" alt="Social profile" title="Social profile"></div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 680px; margin: 0 auto;" width="680">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 60px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad" style="padding-bottom:5px;padding-left:60px;padding-right:60px;padding-top:5px;">
                                    <div style="color:#878787;direction:ltr;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:center;mso-line-height-alt:19.2px;">
                                      <p style="margin: 0; margin-bottom: 16px;">Your account credentials are:</p>
                                      <p style="margin: 0; margin-bottom: 16px;">Email: ${user.email}</p>
                                      <p style="margin: 0;">Password: ${password}</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000; width: 680px; margin: 0 auto;" width="680">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-left: 50px; padding-right: 50px; padding-top: 40px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad" style="padding-bottom:15px;padding-left:30px;padding-right:30px;padding-top:10px;">
                                    <div style="color:#888888;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:20px;font-weight:400;line-height:120%;text-align:center;mso-line-height-alt:24px;">
                                      <p style="margin: 0;">Regards,</p>
                                      <p style="margin: 0;">Team STAR</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f2f5ff; border-radius: 0 0 30px 30px; color: #000; width: 680px; margin: 0 auto;" width="680">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 15px; padding-top: 15px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td class="pad" style="padding-bottom:20px;padding-top:20px;text-align:center;width:100%;">
                                    <h2 style="margin: 0; color: #1a30eb; direction: ltr; font-family: Poppins, Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">Time Tracking, Simplified.</h2>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                <tbody>
                  <tr>
                    <td>
                      <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #1a30eb; color: #000; width: 680px; margin: 0 auto;" width="680">
                        <tbody>
                          <tr>
                            <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-top: 25px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                              <table class="paragraph_block block-1" width="100%" border="0" cellpadding="20" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                <tr>
                                  <td class="pad">
                                    <div style="color:#fafafa;font-family:Poppins, Arial, Helvetica, sans-serif;font-size:10px;line-height:150%;text-align:center;mso-line-height-alt:15px;">
                                    <p style="margin: 0; word-break: break-word; color: #fff;">Questions? Reply us at this Email.</p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table><!-- End -->
    </body>
    </html>` // HTML content of the email
  };


  // Send the email using the configured mail transporter
  mailTransporter
    .sendMail(details)
    .then(() => {
      console.log("Credentials Sent!"); // Log a success message when the email is sent
    })
    .catch((error) => {
      console.log(error); // Log an error if the email fails to send
    });
};

// Function to send an email for a filled timesheet
exports.timesheetEmail = function (user, timesheet) {

  // Define email details including the sender, receiver, subject, and HTML content
  let details = {
    from: "starapp.incedo@gmail.com", // Sender's email
    to: user.email, // Receiver's email
    subject: `STAR APP: Timesheet Filled ${moment(timesheet.startDate).format("DD-MM-YY")}`, // Email subject
    html: `
      <html>
        <body>
          <p>Hello ${user.name},</p>
          <p>Your timesheet has been successfully filled for the week ${moment(timesheet.startDate).format("MMM DD, YYYY")}.</p>
          <p>Thank you!</p>
        </body>
      </html>
    `, // HTML content of the email
  };  
  
  // Send the email using the configured mail transporter
  mailTransporter
    .sendMail(details)
    .then(() => {
      console.log("Mail Sent!"); // Log a success message when the email is sent
    })
    .catch((error) => {
      console.log(error); // Log an error if the email fails to send
    });
};