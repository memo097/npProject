const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, username, email, password, password_confirm} = req.body;
    let errors = [];

    // Check required fields
    if(!name || !username || !email || !password || !password_confirm){
        errors.push({ msg: 'Please Fill in all fields' });
    }

    // Check passwords match
    if(password !== password_confirm) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check passwords length
    if(password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            username,
            email,
            password,
            password_confirm
        })
    } else {
        // Validation passed
        User.findOne({ email: email})
            .then(user => {
                console.log(user)
                if(user) {
                    // User exists
                    errors.push({ msg: 'Email is already registered'});

                    res.render('register', {
                        errors,
                        name,
                        username,
                        email,
                        password,
                        password_confirm
                    })
                }else {
                    const newUser = new User({
                        name,
                        username,
                        email,
                        password
                    });
                    
                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered');
                                res.redirect('login');
                            })
                            .catch(err =>  console.log(err));
                    }) )
                }
            })
    }
})

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true,
    })(req, res, next);
});

// LogOut Handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;