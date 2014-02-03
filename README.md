twitter api interview project
===

Hosted on heroku at http://fierce-everglades-3598.herokuapp.com

##Goals

Build a node.js application that authenticates a twitter user to the twitter
API and then uses the following API calls with a simple interface wrapped
around it.

1. Provide a search page that uses the GET search/tweets to search tweets,
return the search result to a new page or ajax load them in.

2. Allow the user to click details of the user on each tweet to a new page that
returns information from GET statuses/user_timeline

3. Check the code into github and share the repo with us.

4. Bonus Item Tweet Map. From #2 use the user name or type in a user name to
GET statuses/user_timeline, for up to 100 tweets that have geo coordinates
place these tweets on a google map.

5. Bonus Item  deploy the app to Heroku. If not make sure it can run from your
local with any further special instructions.

notes:

- if using this in a dev environment, set the `CONSUMER_KEY` and `CONSUMER_SECRET` env variables,
    otherwise use `heroku config:set CONSUMER_KEY=etc..`
- Node version must be below 0.10.7 because of Jade :(
