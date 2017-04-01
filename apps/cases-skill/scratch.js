module.change_code = 1;
'use strict';

var alexa = require('alexa-app');
var app = new alexa.app('cases-skill');
var nforce = require('nforce');

// used for partial intents
var name;
var subject;
var priority;

// saleforce log in details
var SF_CLIENT_ID = '3MVG99OxTyEMCQ3gpLbNrfR_7CPi4qJaodVDpvY5AHDNm8OKbCJLuGselI19gdyRdf.MDaivybiAmZ5cu.7fe';
var SF_CLIENT_SECRET = '4024960190951116854';
var SF_USERNAME = 'simon.cook@innovate.ul';
var SF_PASSWORD = 'salesforce1';
var SF_CALLBACK_URL = 'http://localhost:3000/oauth/_callback';

var org = nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    redirectUri: SF_CALLBACK_URL,
    mode: 'single'
});

app.dictionary = {
    "subjects": ["printer", "lift", "door", "laptop", "phone", "network", "keyboard", "computer", "mouse"],
    "priorities": ["low", "medium", "high"],
    "names": ["Simon Cook", "Larence Ratcliffe", "Sanjay Pradhan", "John Smith"]
};

app.launch(function(request, response) {
    response.say('Welcome to sales force case manager.').reprompt('Welcome to sales force case manager.').shouldEndSession(false);
});

app.error = function(exception, request, response) {
    console.log(exception)
    console.log(request);
    console.log(response);
    response.say('Sorry an error occured ' + error.message);
};

app.intent('caseCreate', {
        "slots": {
            "Subject": "LITERAL",
            "Priority": "LITERAL",
            "Name": "LITERAL"
        },
        "utterances": ["{new|open|start|} case for {subjects|Subject} with {priorities|Priority} priority for {names|Name}",
                       "{new|open|start|} case for {subjects|Subject} {priorities|Priority} priority for {names|Name}",
                       "{new|open|start|} {priorities|Priority} priority case for {subjects|Subject} name {names|Name}"]
    },
    function(request, response) {
        subject = request.slot('Subject');
        priority = request.slot('Priority');
        name = request.slot('Name');

        //create the object
        var newCase = nforce.createSObject('Case');
        newCase.set('Subject', subject);
        //newCase.set('CreatorName', name);
        newCase.set('Priority', priority);
        newCase.set('Origin', 'Echo');
        newCase.set('Type', 'Problem');
        newCase.set('Status', 'New');
        newCase.set('Description', 'Case opened for ' + name);

        org.authenticate({
            username: SF_USERNAME,
            password: SF_PASSWORD
        }).then(function() {
            return org.insert({
                sobject: newCase
            })
        }).then(function(result) {
            if (result.success) {
                console.log("UTTERANCE: caseCreate - Thank you " + name + ".  I have opened your " + priority + " priority case for the " + subject);
                response.say("Thank you " + name + ".  I have opened your " + priority + " priority case for the " + subject);
                response.card({
                  type: "Standard",
                  title: "Case Created",
                  text: "Thanks you " + name + ".  Your case for " + subject + " with a " + priority + " priority has been raised.",
                  image: {
                    smallImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo-small.png",
                    largeImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo.png"
                  }
                });
                response.send();
            } else {
                console.log("UTTERANCE:caseCreate - Tilt " + JSON.stringify(result));
                response.say("I am afraid I cannot do that " + name);
                response.send();
            }
        }).error(function(err) {
            console.log("UTTERANCE:caseCreate - Tilt " + JSON.stringify(err));
            response.say("I am afraid I cannot do that " + name);
            response.send();
        });
        return false;
    }
);

app.intent('caseOpenCount', {
        "slots": {
        },
        "utterances": ["open cases",
                       "number of open cases",
                       "how many open cases"]
    },
    function(request, response) {
        org.authenticate({
            username: SF_USERNAME,
            password: SF_PASSWORD
        }).then(function() {
            var query = "SELECT Id, Status FROM Case WHERE Status != 'Closed'";
            return org.query({ query: query })
        }).then(function(result) {
            console.log("UTTERANCE: caseOpenCount - You have " +  result.records.length + " open cases");
            response.say("You have " +  result.records.length + " open cases");
            response.card({
              type: "Standard",
              title: "Open Cases",
              text: "You have " +  result.records.length + " open cases.",
              image: {
                smallImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo-small.png",
                largeImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo.png"
              }
            });
            response.send();
        }).error(function(err) {
            console.log("UTTERANCE:caseOpenCount - Tilt " + JSON.stringify(err));
            response.say("I am afraid I cannot do that " + name);
            response.send();
        });
        return false;
    }
);

app.intent('caseHighPriorityCount', {
        "slots": {
        },
        "utterances": ["open high priority cases",
                       "number of open high prioirty cases",
                       "how many open high prioirty cases"]
    },
    function(request, response) {
        org.authenticate({
            username: SF_USERNAME,
            password: SF_PASSWORD
        }).then(function() {
            var query = "SELECT Priority FROM Case WHERE Priority = 'High' AND Status != 'Closed'";
            return org.query({ query: query })
        }).then(function(result) {
            console.log("UTTERANCE: caseOpenCount - You have " +  result.records.length + " high priority open cases");
            response.say("You have " +  result.records.length + " high priority open cases");
            response.card({
              type: "Standard",
              title: "Open Cases",
              text: "You have " +  result.records.length + " open cases.",
              image: {
                smallImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo-small.png",
                largeImageUrl: "https://s3-eu-west-1.amazonaws.com/smc-s3-images/images/salesforce-logo.png"
              }
            });
            response.send();
        }).error(function(err) {
            console.log("UTTERANCE:caseHighPriorityCount - Tilt " + JSON.stringify(err));
            response.say("I am afraid I cannot do that " + name);
            response.send();
        });
        return false;
    }
);

app.sessionEnded(function(request,response) {
    // Clean up the user's server-side stuff, if necessary
    console.log("SESSION ENDED");
    // No response necessary
});

module.exports = app;
