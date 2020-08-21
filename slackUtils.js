const prettyms = require('pretty-ms');
const axios = require('axios').default;
var jsonminify = require("jsonminify");

// creates message for slack
function slackMessage(stats, timings, failures) {
    let parsedFailures = parseFailures(failures);
    let failureMessage = `
    "attachments": [
        {
            "mrkdwn_in": ["text"],
            "color": "#FF0000",
            "author_name": "Newman Tests",
            "title": ":fire: Failures :fire:",
            "fields": [
                ${failMessage(parsedFailures)}
            ],
            "footer": "Smoke Test",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        }
    ]`
    let successMessage = `
    "attachments": [
        {
            "mrkdwn_in": ["text"],
            "color": "#008000",
            "author_name": "Newman Tests",
            "title": ":white_check_mark: All Passed :white_check_mark:",
            "footer": "Smoke Test",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        }
    ]`
    return jsonminify(`
    {
        "blocks": [
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Test Summary*"
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": "Total Tests:"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "${stats.requests.total}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "Test Passed:"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "${stats.requests.total - parsedFailures.length}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "Test Failed:"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "${parsedFailures.length}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "Test Duration:"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "${prettyms(timings.completed - timings.started)}"
                    },
                ],
            },
            {
                "type": "divider"
            },
        ],
        ${failures.length > 0 ? failureMessage : successMessage }
       }`);
}

// Takes fail report and parse it for further processing
function parseFailures(failures) {
    return failures.reduce((acc, failure, index) => {
        if (index === 0) {
            acc.push({
                name: failure.source.name || 'No Name',
                tests: [{
                    name: failure.error.name || 'No test name',
                    test: failure.error.test || 'connection error',
                    message: failure.error.message || 'No Error Message'
                }]
            });
        } else if (acc[acc.length - 1].name !== failure.source.name) {
            acc.push({
                name: failure.source.name || 'No Name',
                tests: [{
                    name: failure.error.name || 'No test name',
                    test: failure.error.test || 'connection error',
                    message: failure.error.message || 'No Error Message'
                }]
            });
        } else {
            acc[acc.length - 1].tests.push({
                name: failure.error.name || 'No test name',
                test: failure.error.test || 'connection error',
                message: failure.error.message || 'No Error Message'
            })
        }
        return acc;
    }, []);
}
// Takes parsedFailures and create failMessages
function failMessage(parsedFailures) {
    return parsedFailures.reduce((acc, failure) => {
        acc = acc + `
        {
            "title": "${failure.name}",
            "short": false
        },
        ${failErrors(failure.tests)}`
        return acc;
    }, '');
}
// Takes failMessages and create Error messages for each failures
function failErrors(parsedErrors) {
    return parsedErrors.reduce((acc, error, index) => {
        acc = acc + `
        {
            "value": "*\`${index +1}. ${error.name} - ${error.test}\`*",
            "short": false
        },`;
        return acc;
    }, '');

}
// sends the message to slack via POST to webhook url
async function send(slackHookUrl, message) {
    const payload = {
        method: 'POST',
        url: slackHookUrl,
        data: message,
        headers: {
            'content-type': 'application/json',
        },
    };
    let result;
    try {
        result = await axios(payload);
    } catch (e) {
        result = false;
        console.error(`Error in sending message to slack ${e}`);
    }
    return result;
}

exports.slackUtils = {
    send,
    slackMessage
};