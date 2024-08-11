const express = require("express");
const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;
const Review = require("./review");
const { alt } = require("joi");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url: String,
        filename: String,
        alt: String,
    },
    price: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}})
}
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;