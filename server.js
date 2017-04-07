const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


app.use((req, res, next) => { // create your own middleware and register it with .use
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
       if(err){
           console.log('Unable to open the file');
       }
    });
    next();
});

// app.use((req, res, next) => { // another custom middleware, dont add next() to stop rest of the script being rendered like when website is in maintenance
//    res.render('maintenance.hbs')
// });

app.use(express.static(__dirname + '/public')); // built in middleware


hbs.registerHelper('getCurrentYear', () => {
   return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


app.get('/', (req, res) => {
   res.setHeader('Last-Modified', (new Date()).toUTCString()); //to disable cache
 //  next();  // to sort out, cache and 304 status code  https://vlasenko.org/2011/10/12/expressconnect-static-set-last-modified-to-now-to-avoid-304-not-modified/
     // res.send('<h1>Hello Express!</h1>');
 res.render('home.hbs',{
     pageTitle: 'Home Page',
     welcomeMessage: 'Welcome to my website',


 });

});

app.get('/about', (req, res) => {
   res.render('about.hbs', {
       pageTitle: 'About Page',

   });

});

app.get('/bad', (req, res) => {
   res.send({
       errorMessage : 'Unable to handle request'
   }) ;
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
