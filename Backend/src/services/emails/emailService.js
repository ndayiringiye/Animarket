import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAgreementEmail = async (emails, pdfUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(","),
    subject: "Animal Agreement Document",
    html: `
      <h3>Your Agreement is Ready</h3>
      <p>Download your agreement here:</p>
      <a href="${pdfUrl}">${pdfUrl}</a>
    `,
  };

  return transporter.sendMail(mailOptions);
};