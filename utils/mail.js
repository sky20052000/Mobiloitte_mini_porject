require("dotenv").config();
   const nodemailer = require("nodemailer");

   const util = {
          
    sendEmail: async (name, email, token) => {
        try {
            const transport =
                nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: process.env.User_Email,
                        pass: process.env.User_Pass,
                    },
                });

            transport.sendMail({
                from: process.env.User_Email,
                to: email,
                subject: "Verify your email",
                html: `<h1>Email Confirmation </h1>
              <h2>Hello ${name}</h2>
              <a href= http://localhost:7000/api/user/reset_password?token=${token}> Click here to reset your password!</a>
              </div>`,
            }).catch(err => console.log(err));
        } catch (e) {
            return res.status(500).send({ status: false, message: "Something went wrong there is some issue" });
        }
    },
   }

   module.exports = util