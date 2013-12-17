/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User');

/**
 * Signup
 */
exports.signup = function(req, res) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    message = 'Username already exists';
                    break;
                default:
                    message = 'Please fill all the required fields';
            }

            return res.send(400, {
                message: message
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                res.send(400, err);
            } else {
                res.jsonp(user);
            }
        });
    });
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            res.send(400, info);
        } else {
            req.logIn(user, function(err) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.jsonp(user);
                }
            });
        }
    })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User.findOne({
        _id: id
    }).exec(function(err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};