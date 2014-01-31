var express  = require('express')
  , passport = require('passport')
  , config   = require('./config')
  , TwitterStrategy = require('passport-twitter').Strategy;

var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.session({ secret: 'keyboard sloth' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

var callback = config.site + ":" + config.port + "/callback";


passport.use(new TwitterStrategy({
    consumerKey: config.consumer_key,
    consumerSecret: config.consumer_secret,
    callbackURL: config.site + ":" + config.port + "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/', function(req, res) {
  if (req.user) {
    res.render('index', { user: req.user });
  } else {
    res.redirect('/login')
  }
});

app.get('/search', function(req, res) {
  console.log(req.query.q);
  res.send("q= " + req.query.q)
});

app.get('/login', function(req, res) {
  console.log('login');
  res.render('login', { title: "login to Tweetmap-funtime"
                      , user: req.user });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//passport specific routes
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

app.listen(8000);

