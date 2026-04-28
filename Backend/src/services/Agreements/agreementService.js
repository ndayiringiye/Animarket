import { sendAgreementEmail } from "./emailService.js";
import { processEscrowPayment, releaseEscrowPayment } from "./escrowService.js";

// inside createAgreementService AFTER creation

// 🔒 STEP 1: escrow lock
await processEscrowPayment(agreement);

// 📄 STEP 2: generate + upload PDF (already exists)

// 📧 STEP 3: send email
const emails = ["buyer@email.com", "seller@email.com"]; // replace with real users

await sendAgreementEmail(emails, pdfUrl);

agreement.emailSent = true;
await agreement.save();