export const signAgreement = (agreement, user, signature) => {
  if (!agreement.signatures) agreement.signatures = {};
  if (user.role === "customer") {
    agreement.signatures.customer = signature;
  } else if (user.role === "farmer") {
    agreement.signatures.farmer = signature;
  } else if (user.role === "veterinary") {
    agreement.signatures.vet = signature;
  } else {
    throw new Error(`Role '${user.role}' is not permitted to sign this agreement`);
  }
  agreement.signedAt = agreement.signedAt || new Date();
  return agreement;
};
