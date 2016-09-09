var request = require('request');
var cheerio = require('cheerio');
var Feed = require('feed');
var jsdom = require('jsdom').jsdom;
var express = require('express');

// We use express as simply web framework.
var app = express();

var generateFeedFromUser = function (username, callable) {
  request(url, function (error, result) {
    var dom = jsdom(result.body);
    var result = dom.querySelectorAll('script[type="text/javascript"]');
    console.log(result.length);

    // the result is an object, let's first convert it to an array.
    // @todo This should be easier ...
    var i = 0;
    var array = [];
    for (i = 0; i < result.length; i++) {
      array.push(result[i]);
    }
    var dom_nodes = array.filter(function (a) {
      return a.getAttribute('src') === null;
    });

    // This is super hacky isn't it?  ¯\_(ツ)_/¯
    var window = {};
    // We select the second last script tag, where the initial react state is stored.
    eval(dom_nodes[dom_nodes.length - 2].innerHTML);
    var feed = new Feed({title: 'My feed', description: "mu", link: url});

    // here are the images ... yeah!
    // Let's generate the feed 🚀
    window._sharedData.entry_data.ProfilePage[0].user.media.nodes.forEach(function (a) {
      var url = a.display_src;
      feed.addItem({
        title: "muh",
        description: '<img src="' + url + '"/>',
      });
    });

    var output = feed.render('rss-2.0');
    callable(output);
  };
};

// Pass a commando line argument to select the user to render.
// For example _minnur.
var username = process.argv[2];
var url = "https://www.instagram.com/" + username;
app.get('/feed.xml', function (req, res) {
    generateFeedFromUser(function (output) {
      res.send(output);
    });
  });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


