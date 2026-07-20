const express = require('express');
const router = express.Router({ mergeParams: true });
const { addReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/:id/reviews', protect, addReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
