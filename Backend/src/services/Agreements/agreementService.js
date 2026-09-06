import { sendAgreementEmail } from "../../services/emails/emailService.js";
import { processEscrowPayment, releaseEscrowPayment } from "../../services/score/escrowService.js";
import Agreement from "../../models/Agreements/agreementModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Booking from "../../models/Bookings/bookingModel.js";
import PDFDocument from "pdfkit";
import cloudinary from "../../config/cloudinary.js";



const uploadAgreementPdf = (agreement, animal, customer, farmer) => new Promise((resolve, reject) => {
	const document = new PDFDocument();
	const chunks = [];
	document.on("data", chunk => chunks.push(chunk));
	document.on("end", () => {
		const upload = cloudinary.uploader.upload_stream(
			{ resource_type: "raw", folder: "agreements", format: "pdf" },
			(error, result) => error ? reject(error) : resolve(result.secure_url)
		);
		upload.end(Buffer.concat(chunks));
	});
	document.on("error", reject);

	document.rect(0, 0, document.page.width, 120).fill('#E8F5E9');
	document.fillColor('#0F172A');
	document.fontSize(22).font('Helvetica-Bold').text("Farm Purchase Agreement", { align: "center" });
	document.moveDown(0.5);
	document.fontSize(10).font('Helvetica').fillColor('#555');
	document.text(`Transaction ID: ${agreement.transactionId}`, { continued: true });
	document.text(`   Date: ${new Date().toDateString()}`, { align: 'right' });
	document.moveDown();

	document.fontSize(12).font('Helvetica-Bold').fillColor('#000').text('Parties', { underline: true });
	document.moveDown(0.3);
	document.fontSize(11).font('Helvetica');
	document.text(`Seller (Farmer): ${farmer?.name || farmer?.email || "Farmer"}`);
	document.text(`Buyer (Customer): ${customer?.name || customer?.email || "Customer"}`);
	document.moveDown();

	document.fontSize(12).font('Helvetica-Bold').text('1. Property Description', { underline: true });
	document.moveDown(0.3);
	document.fontSize(11).font('Helvetica');
	document.text(`Animal: ${animal.name} (${animal.type || ''}, ${animal.breed || ''})`);
	if (animal.age) document.text(`Age: ${animal.age}`);
	if (animal.weight) document.text(`Weight: ${animal.weight} kg`);
	document.moveDown();

	document.fontSize(12).font('Helvetica-Bold').text('2. Purchase Price & Payment', { underline: true });
	document.moveDown(0.3);
	document.fontSize(11).font('Helvetica');
	document.text(`Total Price: ${agreement.price} ${agreement.currency || 'RWF'}`);
	if (agreement.paymentMethod) document.text(`Payment Method: ${agreement.paymentMethod.replace(/_/g, ' ')}`);
	document.moveDown();

	if (agreement.deliveryDate) {
		document.fontSize(12).font('Helvetica-Bold').text('3. Delivery', { underline: true });
		document.moveDown(0.3);
		document.fontSize(11).font('Helvetica');
		document.text(`Expected Delivery Date: ${new Date(agreement.deliveryDate).toDateString()}`);
		document.moveDown();
	}

	const termsSectionNum = agreement.deliveryDate ? '4' : '3';
	document.fontSize(12).font('Helvetica-Bold').text(`${termsSectionNum}. Terms`, { underline: true });
	document.moveDown(0.3);
	document.fontSize(11).font('Helvetica');
	document.text(agreement.terms || 'The parties agree to the standard terms for the sale as set out in this agreement.');
	document.moveDown(2);

	// Signatures
	document.fontSize(11).font('Helvetica');
	document.text('Buyer Signature:', { continued: false });
	document.text(agreement.signatures?.customer ? `  ${agreement.signatures.customer}` : '  ______________________________');
	document.text(`Name: ${customer?.name || customer?.email || "Buyer"}`);
	document.moveDown();
	document.text('Seller Signature:', { continued: false });
	document.text(agreement.signatures?.farmer ? `  ${agreement.signatures.farmer}` : '  ______________________________');
	document.text(`Name: ${farmer?.name || farmer?.email || "Seller"}`);

	document.end();
});

const uploadHotelAgreementPdf = (agreement, animal, hotel, farmer) => new Promise((resolve, reject) => {
        const document = new PDFDocument();
        const chunks = [];
        document.on("data", chunk => chunks.push(chunk));
        document.on("end", () => {
                const upload = cloudinary.uploader.upload_stream(
                        { resource_type: "raw", folder: "agreements", format: "pdf" },
                        (error, result) => error ? reject(error) : resolve(result.secure_url)
                );
                upload.end(Buffer.concat(chunks));
        });
        document.on("error", reject);

        document.rect(0, 0, document.page.width, 120).fill('#E8F5E9');
        document.fillColor('#0F172A');
        document.fontSize(20).font('Helvetica-Bold').text("AniMarket", { align: "center" });
        document.fontSize(14).font('Helvetica').text("Hotel Purchase Agreement", { align: "center" });
        document.moveDown(0.5);
        document.fontSize(10).font('Helvetica').fillColor('#555');
        document.text(`Transaction ID: ${agreement.transactionId}`, { continued: true });
        document.text(`   Date: ${new Date().toDateString()}`, { align: 'right' });
        document.moveDown();

        document.fontSize(12).font('Helvetica-Bold').fillColor('#000').text('Parties', { underline: true });
        document.moveDown(0.3);
        document.fontSize(11).font('Helvetica');
        document.text(`Seller (Farmer): ${farmer?.name || farmer?.email || "Farmer"}`);
        document.text(`Buyer (Hotel): ${hotel?.hotelName || hotel?.email || "Hotel"}`);
        document.moveDown();

        document.fontSize(12).font('Helvetica-Bold').text('1. Animal Description', { underline: true });
        document.moveDown(0.3);
        document.fontSize(11).font('Helvetica');
        document.text(`Animal: ${animal.name} (${animal.type || ''}, ${animal.breed || ''})`);
        if (animal.age) document.text(`Age: ${animal.age}`);
        if (animal.weight) document.text(`Weight: ${animal.weight} kg`);
        document.moveDown();

        document.fontSize(12).font('Helvetica-Bold').text('2. Purchase Price & Payment', { underline: true });
        document.moveDown(0.3);
        document.fontSize(11).font('Helvetica');
        document.text(`Total Price: ${agreement.price} ${agreement.currency || 'RWF'}`);
        if (agreement.paymentMethod) document.text(`Payment Method: ${agreement.paymentMethod.replace(/_/g, ' ')}`);
        document.moveDown();

        document.fontSize(12).font('Helvetica-Bold').text('3. Terms', { underline: true });
        document.moveDown(0.3);
        document.fontSize(11).font('Helvetica');
        document.text(agreement.terms || 'The parties agree to the standard terms for the sale as set out in this agreement, facilitated via the AniMarket platform.');
        document.moveDown(2);

        document.fontSize(11).font('Helvetica');
        document.text('Buyer (Hotel) Signature:', { continued: false });
        document.text(agreement.signatures?.hotel ? `  ${agreement.signatures.hotel}` : '  ______________________________');
        document.text(`Name: ${hotel?.hotelName || hotel?.email || "Hotel"}`);
        document.moveDown();
        document.text('Seller (Farmer) Signature:', { continued: false });
        document.text(agreement.signatures?.farmer ? `  ${agreement.signatures.farmer}` : '  ______________________________');
        document.text(`Name: ${farmer?.name || farmer?.email || "Seller"}`);

        document.end();
});

export const refreshAgreementPdf = async (agreementId) => {
	const agreement = await Agreement.findById(agreementId)
		.populate("parties.customer", "name email")
		.populate("parties.farmer", "name email")
                .populate("parties.hotel", "hotelName email");
	if (!agreement) throw new Error("Agreement not found");
	const animal = await Animal.findById(agreement.animal.animalId);
	if (!animal) throw new Error("Animal not found");
        agreement.pdfUrl = agreement.parties.hotel
                ? await uploadHotelAgreementPdf(agreement, animal, agreement.parties.hotel, agreement.parties.farmer)
                : await uploadAgreementPdf(agreement, animal, agreement.parties.customer, agreement.parties.farmer);
	await agreement.save();
	return agreement;
};

const createAgreementService = async (agreementData) => {
	const animal = await Animal.findById(agreementData.animalId).populate("owner");
	if (!animal) throw new Error("Animal not found");
	const booking = agreementData.bookingId ? await Booking.findById(agreementData.bookingId) : null;
	if (agreementData.bookingId && !booking) throw new Error("Booking not found");
	const paymentMethodMap = {
		momo: "mobile_money",
		bank: "bank_transfer",
		stripe: "card",
	};
	if (booking) {
		const existingAgreement = await Agreement.findOne({ booking: booking._id });
		if (existingAgreement) return existingAgreement;
	}

	const agreement = await Agreement.create({
		title: agreementData.title || `Sale agreement for ${animal.name || "animal"}`,
		booking: booking?._id,
		description: agreementData.description,
		type: agreementData.type || "sale",
		parties: {
			customer: booking?.customer || agreementData.customerId,
			farmer: booking?.farmer || agreementData.farmerId || animal.owner?._id || animal.owner,
                        hotel: agreementData.hotelId,
		},
		animal: {
			animalId: animal._id,
			name: animal.name,
			type: animal.type,
			breed: animal.breed,
			age: animal.age,
			healthStatus: animal.healthStatus,
			weight: animal.weight,
		},
		price: agreementData.price ?? booking?.negotiatedPrice ?? booking?.price ?? animal.price,
		paymentMethod: paymentMethodMap[agreementData.paymentMethod] || agreementData.paymentMethod || "cash",
		transactionId: agreementData.transactionId || `AGR-${Date.now()}-${animal._id}`,
		location: agreementData.location || "To be agreed",
		deliveryDate: agreementData.deliveryDate,
		terms: agreementData.terms,
		createdBy: agreementData.createdBy,
	});
	const agreementWithPdf = await refreshAgreementPdf(agreement._id);

	// Keep the existing post-creation workflow when escrow/email services are configured.
	if (agreementData.processPayment) await processEscrowPayment(agreementWithPdf);

	return agreementWithPdf;
};

export { createAgreementService };
