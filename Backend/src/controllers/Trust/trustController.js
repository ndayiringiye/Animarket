import * as trustService from "../../services/Trust/trustService.js";

export const verifyTrustScore = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await trustService.verifyTrustScoreService(userId);

    return res.status(200).json({
      success: true,
      message: "Trust score verified successfully",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
