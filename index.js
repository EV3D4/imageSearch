var express = require('express');
var app = express();

const MongoClient = require('mongodb').MongoClient

let https = require('https');


// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

var subscriptionKey = '5c464dbc4c3b40ddb70edda1e4e6afa0';
var host = 'api.cognitive.microsoft.com';
var path = '/bing/v7.0/images/search';


MongoClient.connect("mongodb://freecodecamp:heroku@ds123976.mlab.com:23976/heroku_ph8p01tk", (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(port, () => {
  })
})


// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.get(['/','/about'], function(req, res) {
  // ejs render automatically looks in the views folder

  res.render('index');
});

app.get(['/search/:Qpath','/search/:Qpath/?'], (reqx, resx) => {


var searchData={"searchQuery":reqx.params.Qpath}
var num=reqx.query
var qoffset=0;

db.collection('recentSearches').save(searchData, (err, result) => {
  if (err) return console.log(err)
})

  let response_handler = function (response) {
      let body = '';
      response.on('data', function (d) {
          body += d;
      });
      response.on('end', function () {

          body = JSON.parse(body)

          if(!isNaN(parseInt(num.offset)))
            qoffset=parseInt(num.offset)

          resx.writeHead(200, {
            'Content-Type': 'application/json'
          });
          resx.end(JSON.stringify(body.value.slice(qoffset,qoffset+10)));

      });
      response.on('error', function (e) {
          console.log('Error: ' + e.message);
      });
  };

  let bing_image_search = function (search) {
    console.log('Searching images for: ' + reqx.params.Qpath);
    let request_params = {
          method : 'GET',
          hostname : host,
          path : path + '?q=' + encodeURIComponent(search),
          headers : {
              'Ocp-Apim-Subscription-Key' : subscriptionKey,
          }
      };

      let req = https.request(request_params, response_handler);
      req.end();
  }

  if (subscriptionKey.length === 32) {
      bing_image_search(reqx.params.Qpath);
  } else {
      console.log('Invalid Bing Search API subscription key!');
      console.log('Please paste yours into the source code.');
  }
});


app.get('/recentSearches', (req, res) => {
  db.collection('recentSearches').find({},{_id:0}).toArray((err, result) => {
    if (err) return console.log(err)
    else if (result.length == 0)
      res.write("No Recent Searches")
    else{
    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(result));
  }
    res.end();
  })
})
