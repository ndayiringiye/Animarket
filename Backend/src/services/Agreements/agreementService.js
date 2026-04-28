import Agreement from "../models/Agreement.js";
import Animal from "../models/Animal.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

// ─────────────────────────────
// TRANSACTION ID
// ─────────────────────────────
const generateTransactionId = () =>
  "TXN-" + Date.now() + "-" + Math.floor(Math.random() * 10000);

// ─────────────────────────────
// AUTO TERMS GENERATOR
// ─────────────────────────────
const generateTerms = (data) => {
  const { type, animal, service, price, currency } = data;

  if (type === "sale") {
    return `
SALE AGREEMENT

Seller transfers ownership of ${animal.name}.
Buyer agrees to pay ${price} ${currency}.
Ownership transfers after payment confirmation.
`;
  }

  if (type === "veterinary_service") {
    return `
VETERINARY SERVICE AGREEMENT

Veterinarian performs ${service.type} on ${animal.name}.
Service cost: ${service.cost} ${currency}.
Payment due upon completion.
`;
  }

  if (type === "job_request") {
    return `
JOB REQUEST AGREEMENT

Veterinarian requests permission to treat ${animal.name}.
Service type: ${service.type}.
Requires owner approval before execution.
`;
  }

  return "STANDARD AGREEMENT";
};

// ─────────────────────────────
// PDF GENERATOR
// ─────────────────────────────
const generateAgreementPDF = async (agreement, animal, parties) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `agreement-${agreement.transactionId}.pdf`;
      const filePath = path.join("tmp", fileName);

      fs.mkdirSync("tmp", { recursive: true });

      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(18).text("ANIMAL AGREEMENT", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Transaction ID: ${agreement.transactionId}`);
      doc.text(`Type: ${agreement.type}`);
      doc.text(`Date: ${new Date().toDateString()}`);
      doc.moveDown();

      doc.text(`Animal: ${animal.name} (${animal.type})`);
      doc.text(`Price: ${agreement.price} ${agreement.currency}`);
      doc.moveDown();

      doc.text("TERMS:");
      doc.text(agreement.terms);

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

// ─────────────────────────────
// CLOUDINARY UPLOAD
// ─────────────────────────────
const uploadPDFToCloud = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "agreements",
  });

  fs.unlinkSync(filePath);
  return result.secure_url;
};

// ─────────────────────────────
// MAIN SERVICE
// ─────────────────────────────
export const createAgreementService = async ({
  type,
  buyerId,
  sellerId,
  vetId,
  requesterId,
  animalId,
  paymentMethod,
  deliveryDate,
  service,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Get animal
    const animal = await Animal.findById(animalId)
      .populate("owner")
      .session(session);

    if (!animal) throw new Error("Animal not found");

    const seller = animal.owner;

    // 2. Create agreement
    const agreementDoc = await Agreement.create(
      [
        {
          title: `Agreement - ${animal.name}`,
          type,

          parties: {
            buyer: buyerId,
            seller: sellerId,
            veterinarian: vetId,
            requester: requesterId,
          },

          animal: {
            animalId: animal._id,
            name: animal.name,
            type: animal.type,
            breed: animal.breed,
            age: animal.age,
            healthStatus: animal.health.healthStatus,
            weight: animal.weight,
          },

          service,

          price: animal.price || service?.cost || 0,
          currency: animal.currency || "RWF",

          paymentMethod,
          transactionId: generateTransactionId(),
          deliveryDate,

          terms: generateTerms({
            type,
            animal,
            service,
            price: animal.price,
            currency: animal.currency,
          }),

          location: animal.location?.district || "N/A",

          createdBy: buyerId || requesterId,
        },
      ],
      { session }
    );

    const agreement = agreementDoc[0];

    // 3. Lock animal for sale only
    if (type === "sale") {
      animal.isAvailable = false;
      await animal.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    // 4. PDF generation
    const pdfPath = await generateAgreementPDF(agreement, animal, {
      buyerId,
      sellerId,
      vetId,
    });

    // 5. Upload PDF
    const pdfUrl = await uploadPDFToCloud(pdfPath);

    // 6. Save final doc
    agreement.pdfUrl = pdfUrl;
    await agreement.save();

    // 7. Email hook (ready for integration)
    agreement.emailSent = true;
    await agreement.save();

    console.log("📧 Agreement ready:", pdfUrl);

    return {
      agreement,
      downloadLink: pdfUrl,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};