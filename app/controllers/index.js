/**
 * Module dependencies.
 */
var mongoose = require('mongoose');


exports.render = function(req, res) {
    res.render('index.html', {
        title: "Test"
    });
};
