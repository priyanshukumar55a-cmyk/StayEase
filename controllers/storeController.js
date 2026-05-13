const Home = require('../model/home')
const User = require('../model/user')

exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/home-list',{
            registeredHomes: registeredHomes, 
            pageTitle: 'Homes List', 
            currentPage: 'Home',
        })
    })
}

exports.getIndex = (req, res, next) => {
    console.log("Session value ", req.session)
        Home.find().then(registeredHomes => 
            res.render('store/index',{
            registeredHomes: registeredHomes, 
            pageTitle: 'Airbnb Home', 
            currentPage: 'index',
            isLoggedIn: req.session.isLoggedIn
        })
    );
}

exports.getBookings = (req, res, next) => {
    res.render('store/bookings', {
        pageTitle: 'My Bookings', 
        currentPage: 'bookings',
        isLoggedIn: req.session.isLoggedIn
    });
}

exports.getFavouriteList = async (req, res, next) => {
    const user = await User.findById(req.session.user._id).populate('favourites');
    const favouriteHomes = user.favourites;

    console.log(favouriteHomes);

    res.render('store/favourite-list', {
        favouriteHomes: favouriteHomes,
        pageTitle: 'My Favourites',
        currentPage: 'favourites',
        isLoggedIn: req.session.isLoggedIn
    });

};

exports.getHomeDetails = (req, res, next) => {
    const homeId = req.params.homeId;
    Home.findById(homeId).then(home => {
        if(!home){
            console.log("Home not found");
            res.redirect("/homes");
        }
        else{
            res.render('store/home-detail',{
                home: home,
                pageTitle: 'Home Detail', 
                currentPage: 'Home',
                isLoggedIn: req.session.isLoggedIn
            })
        }
    })
}

exports.postAddToFavourite = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if(!user.favourites.includes(homeId)){
        user.favourites.push(homeId);
        await user.save();
    }

    res.redirect("/favourites");
}

exports.postRemoveFromFavourite = async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);
    if(user.favourites.includes(homeId)){
        user.favourites.pull(homeId);
        await user.save();
    }

    res.redirect("/favourites")
}

const getCoordinates = require("../utils/geocode");

exports.createListing = async (req, res) => {
  try {
    const { address } = req.body;

    const { lat, lng } = await getCoordinates(address);

    const newHome = new Home({
      ...req.body,
      address,
      location: {
        type: "Point",
        coordinates: [lng, lat], // IMPORTANT ORDER
      },
    });

    await newHome.save();

    res.redirect("/homes");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
