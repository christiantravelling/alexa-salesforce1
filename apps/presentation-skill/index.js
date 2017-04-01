module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('presentation-skill');

var agenda = [
  "Think about what your app shoud do",
  "Create the Alexa Server",
  "Create the Aleas App to handle your intents",
  "Test your App and view the schema and utterances",
  "Deploy your App to Heroku",
  "Integrate with the Amazon Console"
];

var slides = [
  "Tile Slide",
  "How to Develop Echo Applications",
  "Echo Alexa Case Management",
  "Think About What Your App Should Do",
  "Defining an Interaction Model - Intent Schema",
  "Create the Alexa App Server",
  "Create the Alexa App Skill",
  "Create the Alexa App Part 1 - Variables",
  "Create the Alexa App Part 2 - Launch, Errors and End",
  "Create the Alexa App Part 3 - Intents",
  "Create the Alexa App Part 4 - Assing Cards",
  "Create the Alexa App Part 5 - Interacting with Salesforce",
  "Testing Locally",
  "Deploying and Testing Remotely to Heroku",
  "Integrating with Amazon and Testing on Echo",
  "Skill Information",
  "Interaction Model",
  "Configuration",
  "S S L Certificate",
  "Testing",
  "You Can Now Test on your Actual Device",
  "Closing Slide"
];

app.launch(function(request, response) {
    response.say('Welcome to presentation manager.').reprompt('Welcome again to presentation manager.').shouldEndSession(false);
});

app.error = function(exception, request, response) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say('Sorry an error occured ' + error.message);
};

app.intent('agenda', {
        "slots": {},
        "utterances": ["Agenda",
                       "Agenda for today",
                       "Todays agenda",
                       "What is the agenda",
                       "what is the agenda today"]
    },
    function(request, response) {
        response.say("The agenda has " + agenda.length + " items.");
        response.card({
            type: "Standard",
            title: "Today's Agenda",
            text: "How do develop with Echo and Salesforce",
            image: {
                smallImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo-small.png",
                largeImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo.png"
            }
        });
        response.send();
        return false;
    }
);

app.intent('slideTitle', {
        "slots": {
          "Number":"NUMBER"
        },
        "utterances": ["Slide {1-24|Number}"]
    },
    function(request, response) {
        var number = request.slot('Number');
        response.say("The title of slide " + number + " is " + slides[number-1]);
        response.card({
            type: "Standard",
            title: "Today's Agenda",
            text: "How do develop with Echo and Salesforce",
            image: {
                smallImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo-small.png",
                largeImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo.png"
            }
        });
        response.send();
        return false;
    }
);

app.sessionEnded(function(request, response) {
    // Clean up the user's server-side stuff, if necessary
    console.log("SESSION ENDED");
    // No response necessary
});

module.exports = app;
