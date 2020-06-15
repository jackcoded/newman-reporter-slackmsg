const prettyms = require('pretty-ms');
const axios = require('axios').default;
var jsonminify = require("jsonminify");

function slackMessage(stats, timings, failures) {
    let parsedFailures = parseFailures(failures);
    // console.log(failMessage(parsedFailures));
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
            ${failMessage(parsedFailures)}
        ]}`);
}


function parseFailures(failures) {
    return failures.reduce((acc, failure, index) => {
        if (index === 0) {
            acc.push({
                name: failure.source.name || undefined,
                tests: [{
                    name: failure.error.test || 'connection error',
                    error: failure.error.message
                }]
            });
        } else if (acc[acc.length - 1].name !== failure.source.name) {
            acc.push({
                name: failure.source.name,
                tests: [{
                    name: failure.error.test,
                    error: failure.error.message
                }]
            });
        } else {
            acc[acc.length - 1].tests.push({
                name: failure.error.test,
                error: failure.error.message
            })
        }
        return acc;
    }, []);
}

function failMessage(parsedFailures) {
   return parsedFailures.reduce((acc, failure) => {
        acc = acc + `{"type":"divider"},{"type":"section","text":{"type":"mrkdwn","text":":fire: ${failure.name} :fire:"}},{"type":"divider"},`
        return acc;
   }, '');
}

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
        console.log(`Error in sending message to slack ${e}`);
    }
    return result;
}

exports.send = send;
exports.slackMessage = slackMessage;