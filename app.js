// app.js

// Since this file is still under 200 LOC it's not worth splitting into
// separate routes files, imo

var express   = require('express'),
    request   = require('request'),
    OAuth     = require('oauth').OAuth,
    config    = require('./config'),
    _         = require('underscore');
    // passport hides some things that I needed.. So I ditched that

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.cookieParser() );
  app.use(express.bodyParser() );
  app.use(express.methodOverride() );
  app.use(express.session({secret: "keyboard sloth"}));
  app.use(app.router);
});

var callbackURL = config.site + "/auth/twitter/callback";
var oauth = new OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    config.consumer_key,
    config.consumer_secret,
    '1.0',
    callbackURL,
    'HMAC-SHA1'
    );

// -- index --
app.get('/', function(req, res) {
  if (!req.session.oauth) {
    res.render('login', {title: config.title + " : Login"});
  } else {
    res.render('index', {title: config.title});
  }
});

// -- login --
app.get('/login', function(req, res) {
  oauth.getOAuthRequestToken(function(err, tok, secret, data) {
    if (err) {
      console.log("err: " + err);
    } else {
      req.session.oauth = {};
      req.session.oauth.token = tok;
      req.session.oauth.token_secret = secret;
      res.redirect(config.tokenResource + tok);
    }
  });
});

// -- callback --
app.get('/auth/twitter/callback', function(req, res) {
  if (!_.isUndefined(req.session.oauth)) {
    var oa = req.session.oauth;
    oa.verifier = req.query.oauth_verifier;
    oauth.getOAuthAccessToken(oa.token, oa.token_secret, oa.verifier, function(err, tok, secret, data) {
      if (err) {
        console.log("err: " + err);
      } else {
        oa.screen_name = data.screen_name;
        oa.access_token = tok;
        oa.access_token_secret = secret;
        res.redirect('/');
      }
    });
  } else {
    // not authenticated
    res.redirect('/');
  }
});

// -- search --
app.get('/search', function(req, res) {
  if (!_.isUndefined(req.session.oauth)) {
    var q = req.query.q;
    if (q) {
      var urlCall = config.searchResource + "?q=" + q;
      request.get({
          url: urlCall,
          oauth: makeOAuth(req),
          json: true
      }, function(err, response, body) {
        if (err) {console.log("meh:" + err); }
        else {
          res.render('index', { title:'Searched \"' + q + "\"",
                                tweets: body.statuses });
        }
      });
    }
  } else {
    // not authenticated
    res.redirect('/');
  }
});

// -- timeline --
app.get('/timeline/:user', function(req, res) {
  if (!_.isUndefined(req.session.oauth)) {
    var user = req.params.user;
    var urlCall = config.timelineResource + user;
    request.get({
      url: urlCall,
      oauth: makeOAuth(req),
      json: true
    }, function(err, response, body) {
      if (err) {console.log(err);}
      else {
        res.render('index', {title: 'timeline for \"' + user + '\"',
                            tweets: body,
                            screen_name: user});
      }
    });
  } else {
    res.redirect('/');
  }

});

// -- tweetmap --
app.get('/tweetmap/:user', function(req,res) {
  var user = req.params.user;
  var apiEndpoint = config.timelineResource + user;
  request.get({
    url: apiEndpoint,
    oauth: makeOAuth(req),
    json: true
  }, function(err, response, body) {
    if (err) {console.log(err);}
    else {
      var tweets = body;
      var coords = [];
      var msgs   = [];
      _.each(tweets, function(tweet) {
        if (tweet.place) {
          coords.push(tweet.place.bounding_box.coordinates[0][0]);
          msgs.push(tweet.text);
        }
      });
      var locations = {coordinates: coords, messages: msgs};
      res.render('tweetmap', {
        title: 'tweetmap for ' + user,
        tweets: tweets,
        screen_name: user,
        key: config.mapApiKey,
        locations: JSON.stringify(locations)
      });
    }
  });
});

app.get('/logout', function(req, res) {
  req.session.oauth = undefined;
  res.redirect('/');
});

function makeOAuth(req) {
  //utility function for making oauth hash
  var oauth = {
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    token: req.session.oauth.access_token,
    token_secret: req.session.oauth.access_token_secret
  };
  return oauth;
}

app.listen(process.env.PORT || 3000);
console.log('listening on ' + config.site);

