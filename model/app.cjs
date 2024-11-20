  // Required modules
  require('dotenv').config(); // Load environment variables from .env file
  const express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./User.cjs"),
    flash = require("connect-flash"),
    path = require('path');

  const stripe = require('stripe')(process.env.stripe_api); // Initialize stripe with your API key

  // const hostname = '192.168.32.115';
  const port = 3000;

  // Create Express app
  const app = express();
  app.use(express.static(path.join(__dirname, '../public')));

  // MongoDB connection
  mongoose.connect("mongodb://127.0.0.1:27017/Data", {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(err => {
      console.error("Could not connect to MongoDB:", err);
    });

  // Set up view engine
  app.set("view engine", "ejs");
  app.set('views', path.join(__dirname, '../views'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json()); // Add this to parse JSON bodies

  // Session and flash messages setup
  app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
  }));
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  // Middleware to pass flash messages to views
  app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
  });

  // Routes
  app.get("/", (req, res) => {
    res.render("index");
  });

// Success route
app.get("//success", (req, res) => {
  res.sendFile("success.html", { root: path.join(__dirname, '../public') });
});

// Cancel route
app.get("//cancel", (req, res) => {
  res.sendFile("cancel.html", { root: path.join(__dirname, '../public') });
});

  app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
  });

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.post("/register", async (req, res) => {
    try {
      const user = await User.register(new User({ username: req.body.username }), req.body.password);
      passport.authenticate("local")(req, res, () => {
        res.redirect("/login");
      });
    } catch (error) {
      req.flash("error", "Registration error: " + error.message);
      res.redirect("/register");
    }
  });

  // Render login form
  app.get("/login", (req, res) => {
    res.render("login", { error: req.flash("error") });
  });

  // Handle user login
  app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        console.error("Error during authentication:", err);
        return next(err);
      }
      if (!user) {
        req.flash("error", "Invalid username or password.");
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return next(err);
        }
        return res.redirect("/userindex");
      });
    })(req, res, next);
  });

  // Show user index page
  app.get("/userindex", isLoggedIn, (req, res) => {
    res.render("userindex", { user: req.user });
  });

  // Handle user logout 
  app.get("/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error("Error during logout:", err);
        return next(err);
      }
      res.redirect('/');
    });
  });

  // Authentication middleware
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    req.flash("error", "You must be logged in to view that page.");
    res.redirect("/login");
  }


  app.post("/stripe-checkout", async (req, res) => {
    try {
      const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              images: [item.productImg], // Ensure this is a full URL
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity,
        };
      });
  
      const domain = process.env.DOMAIN.replace(/\/$/, ""); // Remove trailing slash

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${domain}/success`,
        cancel_url: `${domain}/cancel`,
        line_items: lineItems,
        billing_address_collection: "required",
      });
      
  
      console.log("Stripe session created:", session); // Log the session for debugging
      res.json({ url: session.url }); // Send session URL back as JSON
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, Request URL: ${req.url}`);
    next();
  });
  
  // Start the server
  app.listen(port, () => {
    console.log("Server Has Started!");
  });


  // app.listen(port, hostname, () => {
  //   console.log(`The application started successfully on http://${hostname}:${port}/`);
  // });
