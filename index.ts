const prettyms = require('pretty-ms');
const {
    slackMessage,
    send
} = require('./slackmsg');

function SlackNewmanReporter(emitter, reporterOptions, collectionRunOptions) {
    const url = 'https://hooks.slack.com/services/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';
    emitter.on('done', (error, summary) => {
        if (error) {
            console.log('error in done')
            return;
        }

        let run = summary.run;
        send(url, slackMessage(run.stats, run.timings, run.failures));
    });

}
module.exports = SlackNewmanReporter