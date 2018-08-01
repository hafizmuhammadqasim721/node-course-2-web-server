/**
 * - creatig a webserver
 * - in order to run the server 
 * - in this file we are gona configure various routes, like root of the 
 *   website, pages
 */
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port  = process.env.PORT || 3000;

/**
 * making new express app, to do this we make variable 'app' and set it equal 
 * to the return result of calling 'express' as function.
 */
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
/**
 * - How to set up a static directory: if you have a web site, with html, css, 
 *   javaScript and images, you can go ahead and serv that up, without needing
 *   to provide a custome route, for every single file, whic will be a reall 
 *   burden, 
 *   so setting this up is really simple, before making any update in server.js,
 *   we need to go ahead and create some static assets inside our project, so that
 *   we can make, in this case we create a new directory named 'public' and 
 *   then make one html page named 'help.html' in 'public' directory, that will 
 *   be able to view in the browser, 
 *   - Now we have an html page 'help.html', and goal is to be able to serve, this
 *   page up in express app, without manuely configure it. we gona do it using a 
 *   piece of 'express middleware', 
 
 *   - middleware lets you configure, how your 'express' application works, you 
 *   can take it a kind of third party addon, you saying hey express!, you usually
 *   work like this, but i want you to tweak(adjust) a little bit and work like 
 *   this.
 * 
 *   - in order to add or register some middleware, we call app.use(),it takes 
 *     middleware function you want to use, in our case we need to use a built-in 
 *     piece of middleware, so we are using a function express.static() of 
 *     'express' object. express.static(__dirname + '/public') takes the absolute 
 *     path, to the folder you want to serve up.
 
 *     - '__dirname' store the path to the project directory
 
*     - so now if you try to access 'localhost:3000/help.htm', you will see this 
 *       page up in ur browser,    
 */ 

/**
 * - belwo we use some middleware, and we teach express, how to read from static 
 * directory
 */

 app.use(express.static(__dirname + '/public'));

/**
 * - Express Middleware - is a fintastic tool, its used as addon to the existing
 * functionality, that express has, so if express doesn't have a functionality, 
 * that like to do, you can add some middleware, and tell it how to do things.
 * - middleware can do anything, like loging something to screen, could make some
 * change to the reqest and response object, could be use to determin wheather 
 * someone is loged in or not, could use middleware to respond to a request 
 *   
 */
// registering express static middleware
app.use((req, res, next) => {
    /**
     *  - middelware is not going to move on untill we call next, so if middleware 
     * deos not call next(), your handler for each request will never going to fire.
     */
    
    //loging the requests that come to the server with timestamp
    var now = new Date().toString(); // toString create human readable date
    /**
     * - on request object we have access to every thing about the request, the http
     * method, the url, query parameters, any thing that come from client, weather
     * the client is app, browser or iphone, its all going to be available in the 
     * request object.  
     */
    var log = `${now}: ${req.method}: ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log');
        }
    });
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs', {
//         welcomeMsg: 'We will be back soon!'
//     }); 
// } );

/**
 * - register helper takes two arguments, it takes name of the helper as first 
 * argument and function to run as second argument
 */
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


// Below setting up handler for http get request
app.get('/', (req, res) => {
    //get request for website root
    /**
     * - req store the tone of information about what is commng in,things like
     *   header that we use, any body information, the method that was made with 
     *   the request to the path, 
     * - res has a bunch of methods available to you, so you can response to http
     *   request, you can customize the data you send back, you can set http status
     *   code 
     */
    //sends back as body data
     //res.send('<h1>Hello Express</h1>');
     
     //to send back json content to the screen, just send as object, will automatically converted to json
     
     res.render('home.hbs', {
         pageTitle:'Home Page',
         welcomeMsg: 'Welcome to home page.'
     });

});

app.get('/about', (req, res) => {
    /**
     * - below line, lets you render, any of the template you have set up with your 
     * current view engin.
     * - 'views' directory 
     */
    res.render('about.hbs', {
        pageTitle:'About Page'
    });
});

app.get('/bad', (req, res) => {
    //sending back an object
    res.send({
        error: 'Oops!!! Unable to handle your request'
    });
});
/**
 * - Bind the application to port on our machine,  
 * - 3000 port is vary common to developing locally
 */
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})
