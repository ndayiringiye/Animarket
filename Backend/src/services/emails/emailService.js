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

export const sendZoomMeetingNotification = async ({ email, ownerName, animalName, title, meetingDate, meetingLink, password }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Zoom meeting scheduled for ${animalName}`,
    html: `
      <h3>Zoom meeting scheduled</h3>
      <p>Hello ${ownerName || "Animal owner"},</p>
      <p>A customer scheduled a Zoom meeting about <strong>${animalName}</strong>.</p>
      <p><strong>Meeting:</strong> ${title}</p>
      <p><strong>Date:</strong> ${new Date(meetingDate).toLocaleString()}</p>
      <p><a href="${meetingLink}">Join Zoom meeting</a></p>
      ${password ? `<p><strong>Password:</strong> ${password}</p>` : ""}
    `
  });
};

export const sendVeterinaryRequestNotification = async ({ email, customerName, customerPhone, animalName, animalLocation, animalImage, preferredDate, notes }) => {
  const location = animalLocation && Object.values(animalLocation).filter(Boolean).join(", ");

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Veterinary visit requested for ${animalName}`,
    html: `
      <h3>New veterinary visit request</h3>
      <p>A customer has requested a veterinary visit.</p>
      <p><strong>Customer:</strong> ${customerName || "Customer"}</p>
      ${customerPhone ? `<p><strong>Customer phone:</strong> ${customerPhone}</p>` : ""}
      <p><strong>Animal:</strong> ${animalName}</p>
      ${location ? `<p><strong>Animal location:</strong> ${location}</p>` : ""}
      ${animalImage ? `<p><strong>Animal image:</strong> <a href="${animalImage}">View image</a></p><img src="${animalImage}" alt="${animalName}" style="max-width: 400px;" />` : ""}
      <p><strong>Preferred date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
      ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
    `
  });
};
