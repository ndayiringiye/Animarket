import { sendAgreementEmail } from "../../services/emails/emailService.js";
import { processEscrowPayment, releaseEscrowPayment } from "../../services/score/escrowService.js";
import Agreement from "../../models/Agreements/agreementModel.js";
import Animal from "../../models/animals/AnimalModel.js";
import Booking from "../../models/Bookings/bookingModel.js";



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
		createdBy: agreementData.createdBy,
	});

	// Keep the existing post-creation workflow when escrow/email services are configured.
	if (agreementData.processPayment) await processEscrowPayment(agreement);

	return agreement;
};

export { createAgreementService };