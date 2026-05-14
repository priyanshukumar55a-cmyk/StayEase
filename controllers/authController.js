const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const crypto = require("crypto");
const transporter = require("../utils/mailer");
const BASE_URL = process.env.BASE_URL;

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        currentPage: 'login',
        errors: [],
        oldInput: { email: '' }
    });
}
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'SignUp', 
        currentPage: 'signup',
        errors: [],
        oldInput: { firstName: '', lastName: '', email: '', userType: '', user: {}, }
    });
}

exports.postSignup = [
    check("firstName")
        .trim()
        .notEmpty().withMessage("First name is required.")
        .isLength({ min: 2 }).withMessage("First name must be at least 2 characters long.")
        .matches(/^[A-Za-z]+$/).withMessage("First name must contain only letters."),

    check("lastName")   
        .trim()
        .isLength({ min: 2 }).withMessage("Last name must be at least 2 characters long.")
        .matches(/^[A-Za-z]*$/).withMessage("Last name must contain only letters."),

    check("email")
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Please enter a valid email.")
        .normalizeEmail(),

    check("password")
        .notEmpty().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long.")
        .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/).withMessage("Password must contain at least one number.")
        .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character.")
        .trim(),

    check("confirmPassword")
        .notEmpty().withMessage("Confirm Password is required.")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match.");
            }
            return true;
        }),

    check("userType")
        .notEmpty().withMessage("User type is required.")
        .isIn(["host", "guest"]).withMessage("User type must be either 'host' or 'guest'."),

    check("terms")
        .equals("on").withMessage("You must accept the terms and conditions."),


    async (req, res, next) => {  
        const { firstName, lastName, email, password, confirmPassword, userType, terms } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                pageTitle: 'SignUp',
                currentPage: 'signup',
                errors: errors.array().map(err => err.msg),
                oldInput: { firstName, lastName, email, userType }
            });
        }

        try {
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(422).render('auth/signup', {
                    pageTitle: 'SignUp',
                    currentPage: 'signup',
                    errors: ["Email already exists"],
                    oldInput: { firstName, lastName, email, userType }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const rawToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

            const user = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                userType,
                verificationToken: hashedToken,
                tokenExpiry: Date.now() + 3600000
            });

            await user.save();

            // FLASH MESSAGE
            req.flash("success", "Check your email for verification");

            const verifyUrl = `${BASE_URL}/verify-email?token=${rawToken}`;

            try {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: email,
                    subject: "Verify your email for stayEase",
                    html: `
                        <table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff; margin-top:40px; border-radius:10px; padding:30px;"> <!-- Logo / Brand --> <tr> <td align="center" style="font-size:24px; font-weight:bold; color:#ff385c;"> StayEase </td> </tr> <!-- Heading --> <tr> <td style="padding-top:20px; font-size:20px; font-weight:bold; color:#333;"> Confirm your email address </td> </tr> <!-- Message --> <tr> <td style="padding-top:10px; color:#555; font-size:14px; line-height:1.6;"> Welcome to StayEase! 🎉 <br><br> Please confirm your email address to start exploring homes and bookings. </td> </tr> <!-- Button --> <tr> <td align="center" style="padding:30px 0;"> <a href="${verifyUrl}" style="background:#ff385c; color:white; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold;"> Verify Email </a> </td> </tr> <!-- Fallback --> <tr> <td style="font-size:12px; color:#888; word-break:break-all;"> If the button doesn’t work, copy and paste this link into your browser:<br> ${verifyUrl} </td> </tr> <!-- Footer --> <tr> <td style="padding-top:20px; font-size:12px; color:#aaa; text-align:center;"> If you didn’t create an account, you can safely ignore this email. </td> </tr> </table> </td> </tr>
                    `
                });
            } catch (mailError) {
                await User.deleteOne({ _id: user._id });
                console.error("Failed to send verification email:", mailError);
                return res.status(500).render('auth/signup', {
                    pageTitle: 'SignUp',
                    currentPage: 'signup',
                    errors: ["Unable to send verification email. Please try again later."],
                    oldInput: { firstName, lastName, email, userType, terms },
                });
            }

            res.redirect('/login');

        } 
        catch(err) {
            return res.status(422).render('auth/signup', {
                pageTitle: 'SignUp',
                currentPage: 'signup',
                errors: [err.message],
                oldInput: { firstName, lastName, email, userType, terms },
            });
        }
    }
];

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'login',
                errors: ["Invalid email or password."],
                oldInput: { email },
            });
        }

    if (!user.isVerified) {
        return res.status(403).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'login',
            errors: ["Please verify your email first."],
            oldInput: { email },
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(422).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'login',
            errors: ["Invalid email or password."],
            oldInput: { email },
        });
    }

    req.session.user = {
        _id: user._id.toString(),
        email: user.email,
        userType: user.userType
    };
    req.session.isLoggedIn = !!req.session.user;

    req.session.save(err => {
        if (err) {
            console.log(err);
            return res.redirect('/login');
        }
        res.redirect('/');
    });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/login');
    })
}

exports.getVerifyEmail = async (req, res, next) => {
    console.log("VERIFY ROUTE HIT");
    console.log("Token:", req.query.token);

    const hashedToken = crypto.createHash("sha256").update(req.query.token).digest("hex");

    const user = await User.findOne({
        verificationToken: hashedToken,
        tokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).send("Invalid or expired token.");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();
    res.redirect('/login?verified=true');
};

