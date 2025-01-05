import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';
import CollaborativeFilter from 'collaborative-filter';

export class RecommendationService {
  static async getUserRecommendations(userId) {
    try {
      // Get user's reviews and preferences
      const userReviews = await Review.find({ user: userId });
      const allUsers = await User.find({});
      const allRestaurants = await Restaurant.find({});

      // Create ratings matrix
      const ratingsMatrix = [];
      for (const user of allUsers) {
        const userRatings = [];
        for (const restaurant of allRestaurants) {
          const review = await Review.findOne({
            user: user._id,
            restaurant: restaurant._id,
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

      // Get recommended restaurant details
      const recommendedRestaurants = await Promise.all(
        recommendations.map(async (score, index) => {
          if (score > 0) {
            const restaurant = allRestaurants[index];
            const existingReview = userReviews.find(review => 
              review.restaurant.toString() === restaurant._id.toString()
            );

            if (!existingReview) {
              return {
                ...restaurant.toObject(),
                recommendationScore: score,
              };
            }
          }
          return null;
        })
      );

      return recommendedRestaurants.filter(Boolean);
    } catch (error) {
      console.error('Recommendation error:', error);
      throw error;
    }
  }
}