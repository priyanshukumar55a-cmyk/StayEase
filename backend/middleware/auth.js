module.exports = {
    ensureAuth: (req, res, next) => {
        if (req.session?.isLoggedIn && req.session?.user) {
            return next();
        }

        // API vs EJS handling
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        return res.redirect('/login');
    },

    ensureGuest: (req, res, next) => {
        if (!req.session?.isLoggedIn) {
            return next();
        }

        return res.redirect('/');
    },

    ensureHost: (req, res, next) => {
        if (
            req.session?.isLoggedIn &&
            req.session?.user &&
            req.session.user.userType === 'host'
        ) {
            return next();
        }

        if (req.originalUrl.startsWith('/api')) {
            return res.status(403).json({ message: "Forbidden" });
        }

        return res.redirect('/');
    }
};