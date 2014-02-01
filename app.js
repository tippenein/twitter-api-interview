// app.js

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
console.log("callbackURL: " + callbackURL)
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
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oa = req.session.oauth;
    oauth.getOAuthAccessToken(oa.token, oa.token_secret, oa.verifier, function(err, tok, secret, data) {
      if (err) {
        console.log("err: " + err);
      } else {
        req.session.oauth.screen_name = data.screen_name;
        req.session.oauth.access_token = tok;
        req.session.oauth.access_token_secret = secret;
        res.redirect('/');
      }
    });
  } else {
      res.redirect('/');
  }
})

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
        console.log(body)
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

app.get('/timeline/:user', function(req, res) {
  var user = req.params.user;
  var urlCall = config.timelineResource + user;
  request.get({
    url: urlCall,
    oauth: makeOAuth(req),
    json: true
  }, function(err, response, body) {
    if (err) {console.log(err)}
    else {
      res.render('index', {title: 'timeline for \"' + user + '\"',
                           tweets: body,
                           screen_name: user});
    }
  });
});

function makeOAuth(req) {
  var oauth = {
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    token: req.session.oauth.access_token,
    token_secret: req.session.oauth.access_token_secret
  }
  return oauth;
}


app.get('/logout', function(req, res) {
  req.session.oauth = undefined;
  res.redirect('/');
});

app.get('/tweetmap/:user', function(req,res) {
  var user = req.params.user;
})

//passport specific routes
//app.get('/auth/twitter', passport.authenticate('twitter'));
//app.get('/auth/twitter/callback',
//   passport.authenticate('twitter', { successRedirect: '/',
//                                      failureRedirect: '/auth/twitter' }));

app.listen(process.env.PORT || 3000);

