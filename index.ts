const prettyms = require('pretty-ms');
const {
    slackMessage,
    send
} = require('./utils');

function SlackNewmanReporter(emitter, reporterOptions, collectionRunOptions) {
    const webhookUrl = reporterOptions.webhookUrl;
    emitter.on('done', (error, summary) => {
        if (error) {
            console.log('error in done')
            return;
        }

        let run = summary.run;
        send(webhookUrl, slackMessage(run.stats, run.timings, run.failures));
    });

}
module.exports = SlackNewmanReporter