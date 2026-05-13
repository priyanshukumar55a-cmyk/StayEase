require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session')
const dns = require("dns");
const MongoDBStore = require('connect-mongodb-session')(session)
const nodemailer = require("nodemailer");
const flash = require("connect-flash");

const app = express();

app.set('view engine','ejs');
app.set('views','views');

const PORT = 3000;

// Use your MongoDB Atlas URL
const DB_PATH =
"mongodb+srv://priyanshukumar:Root@airbnb.rhzqwpw.mongodb.net/stayease?appName=Airbnb";

// Fix DNS issue for MongoDB Atlas
if (DB_PATH.startsWith("mongodb+srv://")) {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

//core module
const path = require("path");

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require('./utils/pathUtil')
const errorsController = require("./controllers/errors");
const authRouter = require('./routes/authRouter');
const multer = require("multer");

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions'
})

app.use((req, res, next) => {
    next();
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Ensure this directory exists and is writable
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};


const multerOptions = {
    storage, 
    fileFilter

}

app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo')) // 'photo' is the name of the file input field in the form
app.use(express.static(path.join(rootDir,'public')))
app.use('/uploads', express.static(path.join(rootDir, 'uploads'))); // Serve uploaded files statically
app.use('/host/uploads', express.static(path.join(rootDir, 'uploads'))); 
app.use('/homes/uploads', express.static(path.join(rootDir, 'uploads'))); // This will allow you to access uploaded files via /homes/uploads/filename.jpg


app.use(session({
    secret: "DSA is fun.",
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.use(flash());
app.use((req, res, next) => {
    res.locals.successMessage = req.flash("success");
    next();
});

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session?.isLoggedIn || false;
    res.locals.user = req.session.user || null;
    next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
    if(req.session.isLoggedIn){
        next();
    } else{
        res.redirect("/login")
    }
});
app.use("/host", hostRouter);


app.use(errorsController.pageNotFound)



// Connect MongoDB
mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:");
    console.log(err);
  });