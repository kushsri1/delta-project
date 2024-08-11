const express = require("express");
const mongoose = require('mongoose');
const Listing = require("../models/listing");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({
      ...obj, 
      owner: "66b65a1c242c348a0f7b2449"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();