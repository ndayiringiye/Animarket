export const signAgreement = (agreement, user, signature) => {
  if (user.role === "buyer") {
    agreement.signatures.buyer = signature;
  } else if (user.role === "seller") {
    agreement.signatures.seller = signature;
  } else if (user.role === "veterinary") {
    agreement.signatures.vet = signature;
  }

  return agreement;
};