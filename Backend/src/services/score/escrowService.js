// src/services/score/escrowService.js
const COMMISSION_AMOUNT = 2000; // fixed RWF commission to admin, per your requirement

// Called when payment enters escrow — calculates the split but doesn't move money yet
export const processEscrowPayment = async (booking) => {
    const totalAmount = booking.negotiatedPrice || booking.price;

    if (totalAmount <= COMMISSION_AMOUNT) {
        throw new Error("Animal price must be greater than the commission amount");
    }

    booking.commissionAmount = COMMISSION_AMOUNT;
    booking.farmerPayoutAmount = totalAmount - COMMISSION_AMOUNT;
    booking.paymentStatus = "held_in_escrow";
    booking.escrowStatus = "holding";

    await booking.save();
    return booking;
};

// Called when booking completes — "releases" the split (logged for now; wire real MoMo/Flutterwave payout here later)
export const releaseEscrowPayment = async (booking) => {
    if (booking.escrowStatus !== "holding") {
        throw new Error("No funds currently held in escrow for this booking");
    }

    console.log(`Releasing ${booking.commissionAmount} RWF commission to admin`);
    console.log(`Releasing ${booking.farmerPayoutAmount} RWF to farmer (farmer: ${booking.farmer})`);

    booking.paymentStatus = "paid";
    booking.escrowStatus = "released";
    booking.isPaid = true;

    await booking.save();
    return booking;
};