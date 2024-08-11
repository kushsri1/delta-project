const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Listing = require("../models/listing");
const Review = require("../models/review");
const {listingSchema, reviewSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews
//Post Route
router.post("/listings/:id/reviews", 
isLoggedIn,
validateReview, 
wrapAsync(reviewController.createReview)
);

//Delete Route
router.delete(
"/listings/:id/reviews/:reviewId", 
isLoggedIn,
isReviewAuthor,
wrapAsync(reviewController.destroyReview));

module.exports = router;