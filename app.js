// app.js

var express   = require('express'),
    passport  = require('passport'),
    request   = require('request'),
//    OAuth     = require('oauth').OAuth
    config    = require('./config'),
    TwitterStrategy = require('passport-twitter').Strategy;

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.cookieParser() );
  app.use(express.bodyParser() );
  app.use(express.methodOverride() );
  app.use(express.session({ secret: 'keyboard sloth' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var callbackURL = "http://127.0.0.1:3000/auth/twitter/callback";
// var oauthT = new OAuth(
//     'https://api.twitter.com/oauth/request_token',
//     'https://api.twitter.com/oauth/access_token',
//     config.consumer_key,
//     config.consumer_secret,
//     '1.0',
//     callbackURL,
//     'HMAC-SHA1'
//     );

//var callback = config.site + ":" + config.port + "/callback";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new TwitterStrategy({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: callbackURL
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/', function(req, res) {
  res.render('index', {
    title: config.title,
    user: req.user });
});

app.get('/search', function(req, res) {
  var urlCall = config.searchResource + "?q=" + req.query.q;
  console.log(passport)
  var oauth = {
      consumer_key: config.consumer_key,
      consumer_secret: config.consumer_secret,
      token: passport.session.oauth.access_token,
      token_secret: passport.session.oauth.access_token_secret
  };
  request.get({
      url: urlCall,
      oauth: oauth,
      json: true
  }, function(err, response, body) {
    console.log(body)
    if (err) {console.log("meh:" + err); }
    else {
      res.render('index', { title:'Searched \"' + req.query.q,
                            tweets: body.statuses });
    }
  });
});

app.get('/login', function(req, res) {
  res.render('login', { title: "login to Tweetmap-funtime"
                      , user: req.user });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/tweetmap/:user', function(req,res) {
  var user = req.params.user;
})

//passport specific routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/auth/twitter' }));

app.listen(process.env.PORT || 3000);

