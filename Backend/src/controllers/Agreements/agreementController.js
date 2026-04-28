import Agreement from "../models/Agreement.js";
import Animal from "../models/Animal.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import cloudinary from "../config/cloudinary.js";

// Transaction ID
const generateTransactionId = () => {
  return "TXN-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
};

// Generate PDF file locally
const generateAgreementPDF = async (agreement, animal, buyer, seller) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `agreement-${agreement.transactionId}.pdf`;
      const filePath = path.join("tmp", fileName);

      const doc = new PDFDocument();

      fs.mkdirSync("tmp", { recursive: true });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // HEADER
      doc.fontSize(20).text("ANIMAL PURCHASE AGREEMENT", { align: "center" });
      doc.moveDown();

      // CONTENT
      doc.fontSize(12).text(`Transaction ID: ${agreement.transactionId}`);
      doc.text(`Date: ${new Date().toDateString()}`);
      doc.moveDown();

      doc.text(`Seller: ${seller.name}`);
      doc.text(`Buyer: ${buyer.name}`);
      doc.moveDown();

      doc.text(`Animal: ${animal.name} (${animal.type}, ${animal.breed})`);
      doc.text(`Price: ${animal.price} ${animal.currency}`);
      doc.text(`Health: ${animal.health.healthStatus}`);
      doc.moveDown();

      doc.text("Terms:");
      doc.text(agreement.terms);
      doc.moveDown();

      doc.text("This document is legally binding in digital form.");

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

// Upload PDF to Cloudinary
const uploadPDFToCloud = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: "raw",
    folder: "agreements",
  });

  fs.unlinkSync(filePath); // delete local file
  return result.secure_url;
};

// MAIN SERVICE
export const createAgreementService = async ({
  buyerId,
  animalId,
  paymentMethod,
  deliveryDate,
  buyerPhone, // NEW
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch animal
    const animal = await Animal.findById(animalId)
      .populate("owner")
      .session(session);

    if (!animal) throw new Error("Animal not found");
    if (!animal.isAvailable) throw new Error("Animal not available");

    const seller = animal.owner;

    if (seller._id.toString() === buyerId) {
      throw new Error("Buyer cannot be seller");
    }

    // 2. Create agreement
    const agreementDoc = await Agreement.create(
      [
        {
          title: `Animal Purchase Agreement - ${animal.name}`,
          buyer: buyerId,
          seller: seller._id,

          animal: {
            animalId: animal._id,
            name: animal.name,
            type: animal.type,
            breed: animal.breed,
            age: animal.age,
            healthStatus: animal.health.healthStatus,
            weight: animal.weight,
          },

          price: animal.price,
          currency: animal.currency,
          paymentMethod,
          transactionId: generateTransactionId(),
          deliveryDate,
          location: animal.location?.district,
          createdBy: buyerId,
        },
      ],
      { session }
    );

    const agreement = agreementDoc[0];

    // 3. Lock animal
    animal.isAvailable = false;
    await animal.save({ session });

    await session.commitTransaction();
    session.endSession();

    // 4. Generate PDF
    const pdfPath = await generateAgreementPDF(
      agreement,
      animal,
      { name: "Buyer" },
      seller
    );

    // 5. Upload PDF to Cloudinary
    const pdfUrl = await uploadPDFToCloud(pdfPath);

    // 6. Save PDF URL in agreement
    agreement.pdfUrl = pdfUrl;
    await agreement.save();

    // 7. OPTIONAL: Send SMS (pseudo integration)
    if (buyerPhone) {
      console.log(`📱 SMS sent to ${buyerPhone}`);
      console.log(`Download Agreement: ${pdfUrl}`);

      // REAL INTEGRATION (Twilio or Africa's Talking):
      // sendSMS(buyerPhone, `Your agreement is ready: ${pdfUrl}`);
    }

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