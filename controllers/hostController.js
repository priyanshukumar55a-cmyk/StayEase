const Home = require('../model/home')
const path = require('path');
const fs = require('fs');
const getCoordinates = require('../utils/geocode');

exports.getAddHome = (req, res, next) => {
    res.render('host/edit-home', {pageTitle: 'Add Home to airbnb', currentPage: 'addHome', editing : false,
    isLoggedIn: req.session.isLoggedIn,
    user: req.session.user || {}
    });
}

exports.getHostHomes = (req, res, next) => {
        Home.find().then(registeredHomes => 
            res.render('host/host-home-list',{
            registeredHomes: registeredHomes, 
            pageTitle: 'Host Homes List', 
            currentPage: 'host-homes',
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user || {}
        })
    );
}

exports.postAddHome = async (req, res, next) => {
    const {homeName, price, address, rating, description} = req.body;

    if(!req.file){
        console.log("No file uploaded");
        return res.redirect('/host/add-home');
    }

    if (!homeName || !price || !address || !rating || !description) {
        console.log("Missing required fields");
        return res.redirect('/host/add-home');
    }

    console.log(req.file);

    const photo = req.file.path;
    
    // Convert address to coordinates
    const coords = await getCoordinates(address);
    const home = new Home({
        homeName, 
        price, 
        address,
        location: {
            type: "Point",
            coordinates: [coords.lng, coords.lat]
        }, 
        rating, 
        photo, 
        description
    });

    console.log('Home object created:', home);

    home.save().then(() => {
        console.log('Home saved successfully');
        res.redirect('host-home-list');
    }).catch(err => {
        console.log('Error saving home: ', err);
        res.redirect('/host/add-home');
    });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';

    Home.findById(homeId).then(home => {
        if(!home){
            console.log("Home not found for editing")
            return res.redirect("host/host-home-list")
        }
        console.log(homeId, editing, home);
        res.render('host/edit-home', {
            home: home,
            pageTitle: 'Edit your Home', 
            currentPage: 'host-homes',
            editing : editing,
            isLoggedIn: req.session.isLoggedIn,
            user: req.session.user || {}
        });
    })
}

exports.postEditHome = async (req, res, next) => {
    const {id, homeName, price, address, rating, description} = req.body;
    
    if (!id || !homeName || !price || !address || !rating || !description) {
        console.log("Missing required fields");
        return res.redirect('/host/host-home-list');
    }
    
    try {
        const home = await Home.findById(id);
        if (!home) {
            console.log("Home not found");
            return res.redirect('/host/host-home-list');
        }
        
        home.homeName = homeName;
        home.price = price;
        home.address = address;
        home.rating = rating;
        
        // Convert address to coordinates
        const coords = await getCoordinates(address);
        home.location = {
            type: "Point",
            coordinates: [coords.lng, coords.lat]
        };
        
        if(req.file){
            fs.unlink(home.photo, (err) => {
                if(err){
                    console.log("Error while deleting old photo ", err);
                }
                else{
                    console.log("Old photo deleted successfully");
                }
            })
            home.photo = req.file.path;
        }
        
        home.description = description;
        
        await home.save();
        console.log('Home updated successfully');
        res.redirect('host-home-list');
        
    } catch (err) {
        console.log("Error while updating home: ", err);
        res.redirect('/host/host-home-list');
    }
}

exports.postDeleteHome = async (req, res, next) => {
    const homeId = req.params.homeId;

    try {
        const home = await Home.findById(homeId);

        if (!home) {
            console.log("Home not found");
            return res.redirect("/host/host-home-list");
        }

        // ✅ delete image using DB path (NOT req.file)
        if (home.photo) {
            const filePath = path.join(__dirname, '..', home.photo);

            fs.unlink(filePath, (err) => {
                if (err) console.log("Error deleting file:", err);
                else console.log("Photo deleted successfully");
            });
        }

        await Home.findByIdAndDelete(homeId);

        console.log("Deleted:", homeId);
        res.redirect('/host/host-home-list');

    } catch (err) {
        console.log("Delete error:", err);
    }
};