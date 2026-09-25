import { listOwnershipDocs, updateOwnershipDocStatus } from "../../services/Ownership/ownershipService.js";

export const getOwnershipDocsList = async (req, res) => {
  try {
    const data = await listOwnershipDocs();
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to load ownership documents" });
  }
};

export const updateOwnershipDocStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const animal = await updateOwnershipDocStatus(id, status);
    return res.status(200).json({ message: "Status updated", data: animal });
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message || "Could not update status" });
  }
};
