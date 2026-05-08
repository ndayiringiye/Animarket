import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendAgreementEmail = async (emails, pdfUrl, transactionId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: emails.join(","),
    subject: `Animal Purchase Agreement - ${transactionId}`,
    html: `
      <h3>Your Animal Purchase Agreement is Ready</h3>
      <p>Please find the official agreement attached to this email for your records.</p>
      <p>Alternatively, you can download it via this link:</p>
      <a href="${pdfUrl}">${pdfUrl}</a>
    `,
    attachments: [
      {
        filename: `Agreement_${transactionId}.pdf`,
        path: pdfUrl, 
        contentType: 'application/pdf'
      }
    ],
  };

  return transporter.sendMail(mailOptions);
};
