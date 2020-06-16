const prettyms = require('pretty-ms');
const axios = require('axios').default;
var jsonminify = require("jsonminify");

function slackMessage(stats, timings, failures) {
    let parsedFailures = parseFailures(failures);
    let failureMessage = `
    "attachments": [
        {
            "mrkdwn_in": ["text"],
            "color": "#FF0000",
            "author_name": "NWS DR Smoke Tests",
            "title": ":fire: Failures :fire:",
            "fields": [
                ${failMessage(parsedFailures)}
            ],
            "footer": "Slack API",
            "footer_icon": "https://platform.slack-edge.com/img/default_application_icon.png",
        }
    ]`
    return jsonminify(`
    {
        "blocks": [{
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "*Newman Test Summary*"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "fields": [{
                        "type": "mrkdwn",
                        "text": "Total Test:"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "${stats.requests.total}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "Test passed:"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "${stats.requests.total - parsedFailures.length}"
                    },
                    {
                        "type": "mrkdwn",
                        "text": "Test failed:"
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
        ],
        ${failures.length > 0 ? failureMessage : '' }
       }`);
}


function parseFailures(failures) {
    return failures.reduce((acc, failure, index) => {
        if (index === 0) {
            acc.push({
                name: failure.source.name || undefined,
                tests: [{
                    name: failure.error.name || 'unknown',
                    test: failure.error.test || 'connection error',
                    message: failure.error.message
                }]
            });
        } else if (acc[acc.length - 1].name !== failure.source.name) {
            acc.push({
                name: failure.source.name,
                tests: [{
                    name: failure.error.name,
                    test: failure.error.test,
                    message: failure.error.message
                }]
            });
        } else {
            acc[acc.length - 1].tests.push({
                name: failure.error.name,
                test: failure.error.test,
                message: failure.error.message
            })
        }
        return acc;
    }, []);
}

function failMessage(parsedFailures) {
    return parsedFailures.reduce((acc, failure) => {
        acc = acc + `
        {
            "title": "${failure.name}",
            "short": false
        },
        ${parseFailErrors(failure.tests)}`
        return acc;
    }, '');
}

function parseFailErrors(parsedErrors) {
    return parsedErrors.reduce((acc, error, index) => {
        acc = acc + `
        {
            "value": "${index +1}. ${error.name} - ${error.test}",
            "short": false
        },`;
        return acc;
    }, '');

}

async function send(slackHookUrl, message, contentType) {
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
        console.log(`Error in sending message to slack ${e}`);
    }
    return result;
}

exports.send = send;
exports.slackMessage = slackMessage;