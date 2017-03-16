'use strict';

// HTTP request
var request = require('request');
var cheerio = require('cheerio');
var s = require("underscore.string"); // Data Wranglinh : Get Data  + Cleaning data
var async = require('async');


const mongoose = require('mongoose');

// Connect Mongoose to our local server (Nothing is like home )
mongoose.connect("mongodb://localhost/proverbs", (err) => {
    if(err) console.log(err);

    console.log(`The connection has been established on mongodb://localhost/proverbs`);
});

var Citation = mongoose.model('Citation', {
    author: String,
    quote: String
});
var getPageProverbes = function(numberPage, callback) {
    var url = '';
    if(numberPage==1) {
        url = 'http://www.brainyquote.com/quotes/topics/topic_positive.html';
    } else {
        url = 'http://www.brainyquote.com/quotes/topics/topic_positive'+numberPage+'.html';
    }
    var proverbes = [];
    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html); // Load html to cheerio

            $('#name').filter(function() {
                var data = $(this);
                name = data.text();
                profile.name = name;
            });

            $('#quotesList > div').each(function() {
                var author = $(this).find('.bq-aut > a').text();
                var quote = $(this).find('.bqQuoteLink > a').text();
                var proverbe = {author: author, quote: quote};
                proverbes.push(proverbe);
            });
            return callback(null, proverbes);

        } else {
            return callback(error);
        }
    });
};

async.times(39, function(n, next){
    getPageProverbes(n, function(err, proverbes) {
      next(err, proverbes);
  });
}, function(err, allProverbes) {
    if(err) {
        console.log(err);
    } else {
        allProverbes.forEach((arrayProverbs)=> {
            arrayProverbs.forEach((proverb) => {
                let citation = new Citation(proverb);
                citation.save();
            });
        });
    }
});
