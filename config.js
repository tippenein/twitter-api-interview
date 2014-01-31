switch(process.env.NODE_ENV) {
  case 'dev':
    exports.site = 'localhost';
    exports.port = 8000;
    break;
  default:
    exports.site = "http://fierce-everglades-3598.herokuapp.com";
    break;
}
exports.consumer_key = 'cKL8vtoAWxFKxEi5gaAN2A';
exports.consumer_secret = 'A5WN7bzAexqCsJeUcRKOW598nocy30fyvYqpe8yuU';
// https://dev.twitter.com/docs/api/1.1/get/search/tweets
exports.searchResource = 'https://api.twitter.com/1.1/search/tweets.json';
// https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
exports.userTimelineResource = 'https://api.twitter.com/1.1/statuses/user_timeline.json';

