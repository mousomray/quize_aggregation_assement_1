const dotenv=require('dotenv')
dotenv.config()
const nodemailer=require('nodemailer') // Import nodemailer

// This code is came from nodemailer documentation
let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Admin Gmail ID
    pass: process.env.EMAIL_PASS, // Admin password which is generated
  },
})

module.exports= transporter 