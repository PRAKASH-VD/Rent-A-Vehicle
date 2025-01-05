import { RecommendationService } from '../services/recommendationServices.js';

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const recommendations = await RecommendationService.getUserRecommendations(req.user._id);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};