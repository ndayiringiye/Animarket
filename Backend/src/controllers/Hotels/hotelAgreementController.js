import HotelAgreement from "../../models/Hotels/hotelAgreementModel.js";
import Hotel from "../../models/Hotels/hotelModel.js";
import crypto from "crypto";

// Create hotel agreement
export const createHotelAgreement = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      hotelOneId,
      hotelTwoId,
      startDate,
      endDate,
      services,
      financialTerms,
      cancellationTerms,
      liabilityInsurance,
      disputeResolution,
      confidentialityTerms,
      shareableData,
    } = req.body;

    // Validation
    if (!title || !type || !hotelOneId || !hotelTwoId || !startDate) {
      return res.status(400).json({
        message: "title, type, hotelOneId, hotelTwoId, and startDate are required",
        status: 400,
      });
    }

    if (hotelOneId === hotelTwoId) {
      return res.status(400).json({
        message: "Cannot create agreement between the same hotel",
        status: 400,
      });
    }

    // Check if both hotels exist
    const hotelOne = await Hotel.findById(hotelOneId);
    const hotelTwo = await Hotel.findById(hotelTwoId);

    if (!hotelOne || !hotelTwo) {
      return res.status(404).json({
        message: "One or both hotels not found",
        status: 404,
      });
    }

    // Check if hotels can make agreements
    if (!hotelOne.canMakeAgreements || !hotelTwo.canMakeAgreements) {
      return res.status(403).json({
        message: "One or both hotels are not authorized to make agreements",
        status: 403,
      });
    }

    // Create agreement
    const newAgreement = await HotelAgreement.create({
      title,
      description,
      type,
      parties: {
        hotelOne: hotelOneId,
        hotelTwo: hotelTwoId,
      },
      startDate,
      endDate,
      services,
      financialTerms,
      cancellationTerms,
      liabilityInsurance,
      disputeResolution,
      confidentialityTerms,
      shareableData,
      createdBy: hotelOneId,
      status: "draft",
    });

    // Add agreement to both hotels
    await Hotel.findByIdAndUpdate(
      hotelOneId,
      { $push: { agreements: newAgreement._id } },
      { new: true }
    );

    await Hotel.findByIdAndUpdate(
      hotelTwoId,
      { $push: { agreements: newAgreement._id } },
      { new: true }
    );

    return res.status(201).json({
      message: "Hotel agreement created successfully",
      status: 201,
      data: newAgreement,
    });
  } catch (error) {
    console.error("Create hotel agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get hotel agreement by ID
export const getHotelAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;

    const agreement = await HotelAgreement.findById(agreementId)
      .populate("parties.hotelOne", "hotelName email city")
      .populate("parties.hotelTwo", "hotelName email city")
      .populate("createdBy", "hotelName")
      .populate("approvedBy", "name");

    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    return res.status(200).json({
      message: "Agreement retrieved successfully",
      status: 200,
      data: agreement,
    });
  } catch (error) {
    console.error("Get hotel agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Get all agreements for a hotel
export const getHotelAgreements = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { status } = req.query;

    let query = {
      $or: [
        { "parties.hotelOne": hotelId },
        { "parties.hotelTwo": hotelId },
      ],
    };

    if (status) {
      query.status = status;
    }

    const agreements = await HotelAgreement.find(query)
      .populate("parties.hotelOne", "hotelName email")
      .populate("parties.hotelTwo", "hotelName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Agreements retrieved successfully",
      status: 200,
      count: agreements.length,
      data: agreements,
    });
  } catch (error) {
    console.error("Get hotel agreements error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Update hotel agreement
export const updateHotelAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const updates = req.body;

    // Prevent updating certain fields
    delete updates.parties;
    delete updates.createdBy;

    const agreement = await HotelAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    // Only draft or pending agreements can be updated
    if (!["draft", "pending_approval"].includes(agreement.status)) {
      return res.status(400).json({
        message: `Cannot update agreement with status: ${agreement.status}`,
        status: 400,
      });
    }

    const updatedAgreement = await HotelAgreement.findByIdAndUpdate(
      agreementId,
      updates,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Agreement updated successfully",
      status: 200,
      data: updatedAgreement,
    });
  } catch (error) {
    console.error("Update hotel agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Send agreement for approval
export const sendAgreementForApproval = async (req, res) => {
  try {
    const { agreementId, recipientHotelId } = req.params;

    const agreement = await HotelAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    if (agreement.status !== "draft") {
      return res.status(400).json({
        message: "Only draft agreements can be sent for approval",
        status: 400,
      });
    }

    // Verify recipient is one of the parties
    if (
      !agreement.parties.hotelOne.toString().includes(recipientHotelId) &&
      !agreement.parties.hotelTwo.toString().includes(recipientHotelId)
    ) {
      return res.status(403).json({
        message: "Recipient hotel is not a party to this agreement",
        status: 403,
      });
    }

    const updatedAgreement = await HotelAgreement.findByIdAndUpdate(
      agreementId,
      { status: "sent", emailSent: true },
      { new: true }
    );

    return res.status(200).json({
      message: "Agreement sent for approval",
      status: 200,
      data: updatedAgreement,
    });
  } catch (error) {
    console.error("Send agreement for approval error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Accept agreement
export const acceptAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { hotelId, signature } = req.body;

    const agreement = await HotelAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    if (!["sent", "pending_approval"].includes(agreement.status)) {
      return res.status(400).json({
        message: "Agreement cannot be accepted in its current status",
        status: 400,
      });
    }

    // Check if hotel is a party to agreement
    const isHotelOne = agreement.parties.hotelOne.toString() === hotelId;
    const isHotelTwo = agreement.parties.hotelTwo.toString() === hotelId;

    if (!isHotelOne && !isHotelTwo) {
      return res.status(403).json({
        message: "Hotel is not a party to this agreement",
        status: 403,
      });
    }

    // Update signature
    if (isHotelOne) {
      agreement.signatures.hotelOneSignature = signature;
      agreement.signatures.hotelOneSignedAt = new Date();
    } else {
      agreement.signatures.hotelTwoSignature = signature;
      agreement.signatures.hotelTwoSignedAt = new Date();
    }

    // Check if both parties have signed
    if (agreement.signatures.hotelOneSignature && agreement.signatures.hotelTwoSignature) {
      agreement.status = "active";
    } else {
      agreement.status = "pending_approval";
    }

    const updatedAgreement = await agreement.save();

    return res.status(200).json({
      message: "Agreement accepted successfully",
      status: 200,
      data: updatedAgreement,
    });
  } catch (error) {
    console.error("Accept agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Reject agreement
export const rejectAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { hotelId, rejectionReason } = req.body;

    const agreement = await HotelAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    if (!["sent", "pending_approval"].includes(agreement.status)) {
      return res.status(400).json({
        message: "Agreement cannot be rejected in its current status",
        status: 400,
      });
    }

    // Check if hotel is a party to agreement
    if (
      agreement.parties.hotelOne.toString() !== hotelId &&
      agreement.parties.hotelTwo.toString() !== hotelId
    ) {
      return res.status(403).json({
        message: "Hotel is not a party to this agreement",
        status: 403,
      });
    }

    const updatedAgreement = await HotelAgreement.findByIdAndUpdate(
      agreementId,
      {
        status: "rejected",
        notes: rejectionReason || "Rejected by hotel",
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Agreement rejected",
      status: 200,
      data: updatedAgreement,
    });
  } catch (error) {
    console.error("Reject agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};

// Terminate agreement
export const terminateAgreement = async (req, res) => {
  try {
    const { agreementId } = req.params;
    const { hotelId, terminationReason } = req.body;

    const agreement = await HotelAgreement.findById(agreementId);
    if (!agreement) {
      return res.status(404).json({
        message: "Agreement not found",
        status: 404,
      });
    }

    if (agreement.status !== "active") {
      return res.status(400).json({
        message: "Only active agreements can be terminated",
        status: 400,
      });
    }

    // Check if hotel is a party to agreement
    if (
      agreement.parties.hotelOne.toString() !== hotelId &&
      agreement.parties.hotelTwo.toString() !== hotelId
    ) {
      return res.status(403).json({
        message: "Hotel is not a party to this agreement",
        status: 403,
      });
    }

    const updatedAgreement = await HotelAgreement.findByIdAndUpdate(
      agreementId,
      {
        status: "terminated",
        terminatedBy: hotelId,
        terminationReason: terminationReason || "Terminated by hotel",
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Agreement terminated successfully",
      status: 200,
      data: updatedAgreement,
    });
  } catch (error) {
    console.error("Terminate agreement error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      status: 500,
    });
  }
};
