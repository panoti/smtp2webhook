const nodemailer = require("nodemailer");

// 1️⃣  Configure a transporter that talks to Ethereal
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 9425,
  secure: false, // upgrade later with STARTTLS
  ignoreTLS: true, // Ignore TLS certificate issues
  auth: {
    user: 'dev',
    pass: 'test123',
  },
});

// 2️⃣  Send a message
transporter
  .sendMail({
    from: "Example app <no-reply@example.com>",
    to: "user@example.com",
    subject: "Hello from tests ✔",
    text: "This message was sent from a Node.js integration test.",
    html: "<b>This message was sent from a Node.js integration test.</b>",
  })
  .then((info) => {
    console.log("Message sent: %s", info.messageId);
    // Preview the stored message in Ethereal's web UI
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
})
.catch(console.error);

