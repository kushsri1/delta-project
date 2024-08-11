const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const path = require("path");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

listingController = require("../controllers/listings.js")

//Index Route
router.get("/listings", wrapAsync(listingController.index));

//New Route
router.get("/listings/new", isLoggedIn, listingController.renderNewForm)


//Show route
router.get("/listings/:id", wrapAsync(listingController.showListing));

// Create Route
router.post("/listings", 
isLoggedIn,
upload.single("listing[image]"),
validateListing, 
wrapAsync(listingController.createListing));

//Edit Route
router.get("/listings/:id/edit",
isLoggedIn,
isOwner,
 wrapAsync(listingController.renderEditForm)
);

//Update Route
router.put("/listings/:id",
isLoggedIn,
isOwner,
upload.single("listing[image]"),
validateListing, 
wrapAsync(listingController.updateListing));

//Delete Route
router.delete("/listings/:id",
isLoggedIn,
isOwner,
 wrapAsync(listingController.destroyListing));

module.exports = router;