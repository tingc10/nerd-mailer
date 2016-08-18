var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    config = require('./config.json');

var mailgun = require('mailgun-js')({apiKey: config.key, domain: config.domain});
 


app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");

  next();
});

app.post('/sendEmail', function(req, res){
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;
  var data = {
    from: 'Form Response <nerd@tingchen.me>',
    to: email,
    subject: 'Thank you for submitting our form!',
    text: 'Hey ' + firstName + ' ' + lastName +',\nThank you for completing our form!'
  };
  mailgun.messages().send(data, function (error, body) {
    if(error) {
      console.log(error);
      res.status(400).send('There was an error sending your email');
    } else {
      res.status(200).send('Success!');
    }
  });
});

server.listen(app.get('port'), function(){
  console.log('Emailer running on Port ' + app.get('port'));
});
