module.change_code = 1;
'use strict';

//require the alexa-app module and create variables
var alexa = require('alexa-app');
var app = new alexa.app('product-registration-skill');
var nforce = require('nforce');

var mobile, postcode, product, company;

app.dictionary = {
    "Products": ["printer", "camera", "console", "scanner", "photocopier", "tv"],
    "Companies": ["canon", "sony", "nintendo"]
};

//This is the welcome message from Alexa
app.launch(function(request, response) {
    response.say('Welcome to sales force product manager.').reprompt('Welcome to sales force product manager.').shouldEndSession(false);
});

//Define an error condition
app.error = function(exception, request, response) {
    console.log(exception + request + response);
    response.say('Sorry an error occurred' + exception);
};

//Define function when session ends - clean up
app.sessionEnded(function(request, response) {
    console.log('SESSION ENDED');
});

// Now the ALEXA fun stuff happens here

app.intent('registerProduct', {
        "slots": {
            "Company": "LITERAL",
            "Product": "LITERAL",
            "Serial": "LITERAL",
            "Mobile": "LITERAL",
            "PostCode": "LITERAL"

        },
        "utterances": ["{new|create|start|} registration for {Company|Companies} {Product|Products}",
            "{new|create|start|} product registration for {Company|Companies} {Product|Products}",
            "New product registration for {Product|Products} from {Company|Companies}",
            "Register {new|my} {Company|Companies} {Product|Products} ",
            "{Mobile}",
            "{Serial}",
            "{PostCode}"
        ]
    },
    function(request, response) {
        product = request.slot('Product');
        company = request.slot('Company');
        mobile = request.slot('Mobile');
        postcode = request.slot('PostCode');
        serialNumber = request.slot('Serial');

        console.log('PRODUCT:' + product + ' COMPANY:' + company + ' MOBILE:' + mobile + ' POSTCODE: ' + postcode + ' SERIAL: ' + serialNumber);
        if (!serialNumber) {
            response.say('OK, can you tell me the serial number of your ' + product);
            response.shouldEndSession(false);
            response.send();
            return false;
        }
        if (!mobile) {
            response.say('Now, can you tell me your mobile phone number');
            response.shouldEndSession(false);
            response.send();
            return false;
        }

        if (!postcode) {
            response.say('And finally, what is your postcode');
            response.shouldEndSession(false);
            response.send();
            return false;
        }

        response.say('Thank you, your ' + product + ' has been registered with ' + company);
        response.send();
        return false;
    }
);

module.exports = app;