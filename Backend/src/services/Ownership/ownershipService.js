import Animal from "../../models/animals/AnimalModel.js";

export const listOwnershipDocs = async () => {
  const animals = await Animal.find({
    $or: [
      { previousOwnerAgreementPhoto: { $exists: true, $ne: null } },
      { previousOwnerIdPhoto: { $exists: true, $ne: null } }
    ]
  }).populate("owner", "name phone");

  return animals.map((a) => ({
    _id: a._id,
    documentId: `OWN-${a._id.toString().slice(-6).toUpperCase()}`,
    animalName: a.name,
    animalTag: a._id.toString().slice(-6).toUpperCase(),
    passportId: a._id.toString(),
    breed: a.breed,
    sex: a.gender,
    ownerName: a.previousOwnerName || (a.owner && a.owner.name) || "Unknown",
    farmerId: a.owner ? a.owner._id?.toString() || a.owner.toString() : "",
    phone: a.previousOwnerPhone || (a.owner && a.owner.phone) || "",
    location: [a.location?.district, a.location?.province, a.location?.country].filter(Boolean).join(", "),
    documentType: a.previousOwnerIdType || "Ownership Agreement",
    fileUrl: a.previousOwnerAgreementPhoto || a.previousOwnerIdPhoto || "",
    submittedAt: a.createdAt,
    status: a.ownershipDocStatus || "pending"
  }));
};

export const updateOwnershipDocStatus = async (animalId, status) => {
  const animal = await Animal.findById(animalId);
  if (!animal) {
    const err = new Error("Animal not found");
    err.status = 404;
    throw err;
  }
  animal.ownershipDocStatus = status;
  await animal.save();
  return animal;
};
