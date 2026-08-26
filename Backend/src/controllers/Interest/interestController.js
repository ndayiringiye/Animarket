import * as interestService from "../../services/Interest/interestService.js";

export const createInterestRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const interest = await interestService.createInterestRequestService(
      userId,
      data
    );

    return res.status(201).json({
      success: true,
      message: "Interest request submitted successfully",
      data: interest,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserInterestRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const interests = await interestService.getUserInterestRequestsService(
      userId
    );

    return res.status(200).json({
      success: true,
      count: interests.length,
      data: interests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
