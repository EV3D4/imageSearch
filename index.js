var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 5000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

app.get(['/','/about'], function(req, res) {
  // ejs render automatically looks in the views folder

  res.render('index');
});

app.get('/:Qpath', (req, res) => {

  var id = req.params.Qpath;
  var timestamp
  var myDate
  var unix
  var date
  var month
  var re
  var naturalDate


  if (isNaN(id)) {

    id = id.replace(/%20|\+|\//g, '');

    re = /January|Febuary|March|April|May|June|July|August|September|October|November|December/i;

    month = id.match(re);

    id = id.replace(re, "");

    date = month + " " + id.slice(0, 3) + ", " + id.slice(4, 9);

    myDate = new Date(date);
    unix = myDate.getTime();

    if (!isNaN(unix))
      timestamp = {
        "unix": unix,
        "natural": date
      }
    else
      timestamp = {
        "unix": null,
        "natural": null
      }
  } else {

    naturalDate = new Date(id * 1000);

    switch (naturalDate.getMonth()) {

      case 0:
        month = "January";
        break;

      case 1:
        month = "February";
        break;

      case 2:
        month = "March";
        break;

      case 3:
        month = "April";
        break;

      case 4:
        month = "May";
        break;

      case 5:
        month = "June";
        break;

      case 6:
        month = "July";
        break;

      case 7:
        month = "August";
        break;

      case 8:
        month = "September";
        break;

      case 9:
        month = "October";
        break;

      case 10:
        month = "November";
        break;

      case 11:
        month = "December";
        break;
    }


    date = naturalDate.getDate();

    myDate= month + " " + date + ", " + naturalDate.getFullYear();

    myDate = new Date(myDate);

    unix = myDate.getTime();

    if (!isNaN(unix))
          timestamp = {
        "unix": id,
        "natural": month + " " + date + ", " + naturalDate.getFullYear()
      }
    else

      timestamp = {
        "unix": null,
        "natural": null
      }

  }

  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify(timestamp));

});

app.listen(port, function() {
  console.log('Our app is running on http://localhost:' + port);
});
