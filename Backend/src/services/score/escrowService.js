export const processEscrowPayment = async (agreement) => {
  // Simulate escrow holding
  agreement.paymentStatus = "pending";

  console.log("💰 Payment locked in escrow");

  return agreement;
};

export const releaseEscrowPayment = async (agreement) => {
  agreement.paymentStatus = "paid";

  console.log("✅ Payment released to seller/vet");

  return agreement;
};