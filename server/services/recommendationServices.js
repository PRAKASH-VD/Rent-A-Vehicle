import User from '../models/User.js';
import Vehicle from '../models/Vehicle.js';
import Review from '../models/Review.js';
import CollaborativeFilter from 'collaborative-filter';

export class RecommendationService {
  static async getUserRecommendations(userId) {
    try {
      // Get user's reviews and preferences
      const userReviews = await Review.find({ user: userId });
      const allUsers = await User.find({});
      const allVehicles = await Vehicle.find({});

      // Create ratings matrix
      const ratingsMatrix = [];
      for (const user of allUsers) {
        const userRatings = [];
        for (const vehicle of allVehicles) {
          const review = await Review.findOne({
            user: user._id,
            vehicle: vehicle._id,
          });
          userRatings.push(review ? review.rating : 0);
        }
        ratingsMatrix.push(userRatings);
      }

      // Get user index
      const userIndex = allUsers.findIndex(user => 
        user._id.toString() === userId.toString()
      );

      // Get recommendations using collaborative filtering
      const recommendations = CollaborativeFilter.cFilter(
        ratingsMatrix,
        userIndex,
        5, // number of similar users to consider
        'pearson' // correlation coefficient
      );

      // Get recommended vehicle details
      const recommendedVehicles = await Promise.all(
        recommendations.map(async (score, index) => {
          if (score > 0) {
            const vehicle = allVehicles[index];
            const existingReview = userReviews.find(review => 
              review.vehicle.toString() === vehicle._id.toString()
            );

            if (!existingReview) {
              return {
                ...vehicle.toObject(),
                recommendationScore: score,
              };
            }
          }
          return null;
        })
      );

      return recommendedVehicles.filter(Boolean);
    } catch (error) {
      console.error('Recommendation error:', error);
      throw error;
    }
  }
}