switch(process.env.NODE_ENV) {
  case 'dev':
    exports.site = 'http://127.0.0.1:3000';
    break;
  default:
    exports.site = "http://fierce-everglades-3598.herokuapp.com";
    break;
}
exports.title = "Tweet App Thingy!";
exports.consumer_key = 'cKL8vtoAWxFKxEi5gaAN2A';
exports.consumer_secret = 'A5WN7bzAexqCsJeUcRKOW598nocy30fyvYqpe8yuU';
exports.access_token = '16987909-KvjBMG8qtH4joJ5WBHOcbdUS26xgjFLHUqaoIisqg';
exports.token_secret = 'jE5u2BdG6tHzPnSAEePiB2XZ0ndIkjkeMkgutRjcxw85C';

// https://dev.twitter.com/docs/api/1.1/get/search/tweets
exports.searchResource = 'https://api.twitter.com/1.1/search/tweets.json';
// https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
exports.timelineResource = 'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=';
exports.tokenResource = 'https://twitter.com/oauth/authenticate?oauth_token=';
exports.mapApiKey = 'AIzaSyBBrytUA4Qtf8Rrudxrdx5RpYmfd9-gZ8E';
