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

      // Professional Purchase Agreement Header
      doc.rect(0, 0, doc.page.width, 140).fill('#E6F7C6');
      doc.fillColor('#0F172A');
      doc.fontSize(28).font('Helvetica-Bold').text('Purchase Agreement', { align: 'center', valign: 'center' });
      doc.moveDown(2);

      // Agreement meta
      doc.moveDown();
      doc.fontSize(10).font('Helvetica').fillColor('#000');
      doc.text(`Transaction ID: ${agreement.transactionId}`, { continued: true }).text(`   Date: ${new Date().toDateString()}`, { align: 'right' });
      doc.moveDown();

      // Parties
      doc.fontSize(12).font('Helvetica-Bold').text('Parties', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').text(`Seller: ${seller?.name || 'Seller'}`);
      doc.text(`Buyer: ${buyer?.name || 'Buyer'}`);
      doc.moveDown();

      // Subject
      doc.fontSize(12).font('Helvetica-Bold').text('Subject Matter of the Agreement', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').text(`The Seller agrees to sell and convey to the Buyer the following animal:`);
      doc.moveDown(0.2);
      doc.text(`- Animal: ${animal.name} (${animal.type || ''}, ${animal.breed || ''})`);
      doc.text(`- Age: ${animal.age || 'N/A'}`);
      doc.text(`- Health status: ${animal.health?.healthStatus || 'N/A'}`);
      doc.moveDown();

      // Price and payment
      doc.fontSize(12).font('Helvetica-Bold').text('Purchase Price and Payment Terms', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').text(`Total Purchase Price: ${agreement.price || animal.price} ${agreement.currency || animal.currency}`);
      doc.moveDown(0.2);
      doc.text('Payment Method: ' + (agreement.paymentMethod || 'To be agreed'));
      doc.moveDown();

      // Terms
      doc.fontSize(12).font('Helvetica-Bold').text('Terms', { underline: true });
      doc.moveDown(0.5);
      if (agreement.terms) {
        doc.fontSize(11).font('Helvetica').text(agreement.terms);
      } else {
        doc.fontSize(11).font('Helvetica').text('The parties agree to the standard terms for the sale as set out in this agreement.');
      }
      doc.moveDown(1);

      // Signature placeholders
      const sigY = doc.y + 20;
      doc.moveDown(2);
      doc.fontSize(11).text('Seller Signature:', { continued: false });
      doc.moveDown(3);
      doc.text('______________________________', { continued: true });
      doc.moveDown(1);
      doc.text('Name: ' + (seller?.name || 'Seller'));
      doc.moveDown(2);
      doc.text('Buyer Signature:', { continued: false });
      doc.moveDown(3);
      doc.text('______________________________', { continued: true });
      doc.moveDown(1);
      doc.text('Name: ' + (buyer?.name || 'Buyer'));

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