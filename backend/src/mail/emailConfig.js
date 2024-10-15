import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Replace with your SMTP server
    port: 465,
    auth: {
      user: "triptales56@gmail.com", // Replace with your SMTP username
      pass: process.env.MAIL_PASSWORD, // Replace with your SMTP password
    },
  });
  
  // Common email sending function
  export const sendEmail = async (to, subject, html) => {
    const mailOptions = {
      from: '"Trip Tales" <triptales56@gmail.com>', // Change sender email
      to,
      subject,
      html,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully", info);
    } catch (error) {
      console.error(`Error sending email:`, error);
      throw new Error(`Failed to send email: ${error}`);
    }
  };

