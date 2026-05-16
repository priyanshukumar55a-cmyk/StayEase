const Home = require('../model/home')
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
    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { homeName, price, address, rating, description } = req.body;

        if (!req.file) {
            console.log("No file uploaded");
            return res.redirect('/host/add-home');
        }

        if (!homeName?.trim() || !price || !address?.trim() || !description?.trim()) {
            console.log("Missing required fields");
            return res.redirect('/host/add-home');
        }

        // multer-storage-cloudinary can return different url props depending on version
        const photo = req.file.path || req.file.secure_url || req.file.url || null;

        if (!photo) {
            console.log('Uploaded file did not return a URL from Cloudinary');
            return res.redirect('/host/add-home');
        }

        console.log("PHOTO URL:", photo);

        // Convert address to coordinates
        const coords = await getCoordinates(address);

        console.log("COORDS:", coords);

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

        console.log("HOME OBJECT:", home);

        await home.save();

        console.log("Home saved successfully");

        res.redirect('/host/host-home-list');

    } catch (err) {

        console.error("ADD HOME ERROR:");
        console.error(err);
        console.error(err.message);
        console.error(err.stack);

        res.status(500).send("Something went wrong");

    }
};

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
        
        home.description = description;

        // If a new photo was uploaded during edit, update the photo URL
        if (req.file) {
            const newPhotoUrl = req.file.path || req.file.secure_url || req.file.url || null;
            if (newPhotoUrl) {
                home.photo = newPhotoUrl;
            } else {
                console.log('Edit: uploaded file did not return a Cloudinary URL');
            }
        }
        
        await home.save();
        console.log('Home updated successfully');
        res.redirect('host/host-home-list');
        
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

        await Home.findByIdAndDelete(homeId);

        console.log("Deleted:", homeId);
        res.redirect('/host/host-home-list');

    } catch (err) {
        console.log("Delete error:", err);
    }
};