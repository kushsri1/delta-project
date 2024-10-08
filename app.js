if(process.env.NODE_ENV != "production") {
require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const metohdOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const { MongoClient } = require('mongodb');

const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");


const dbUrl = process.env.ATLASDB_URL;

if (!dbUrl) {
  throw new Error('MongoDB connection string is not defined');
};

const client = new MongoClient(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
.then(() => console.log('Connected successfully to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: true}));
app.use(metohdOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  client: client,
  collectionName: 'sessions',
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on("error", ()=> {
  console.log("Error in Mongo Session Store", err)
})


const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=> {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.get("/demouser", async(req, res)=> {
  let fakeUser = new User({
    email: "student@gmail.com",
    username: "delta-student",
  });
  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
})

app.use("/", listingRouter);
app.use("/", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next)=> {
  next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next)=> {
  let {statusCode=500, message="Something went wrong"} = err;
  res.status(statusCode).render("error.ejs", {message})
  // res.status(statusCode).send(message);
})

app.listen(8080, ()=> {
    console.log("app is listening to port 8080");
})