const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: '',
    },
  });
  var mailoptions = {
    from: '',
    to: options.toEmail,
    subject: 'reset password for your account',
    html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <img width="250" height="250" src="https://img.freepik.com/premium-vector/forgot-password-concept-isolated-white_263070-194.jpg" alt="" />
          <p>your password reset link is</p>
          ${options.message}.
        </body>
      </html>
      `,
  };
  transporter.sendMail(mailoptions, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Email send: ' + result.response);
    }
  });
};

module.exports = sendEmail;
