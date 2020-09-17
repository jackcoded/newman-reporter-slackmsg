const {
    slackUtils
} = require('./slackUtils');

function SlackNewmanReporter(emitter, reporterOptions) {
    if (missingReporterOptions(reporterOptions)) {
        return;
    }
    const webhookUrl = reporterOptions.webhookurl;
    const messageSize = reporterOptions.messageSize || 100;
    const collection = reporterOptions.collection || '';
    const environment = reporterOptions.environment || '';


    emitter.on('done', (error, summary) => {
        if (error) {
            console.error('error in done')
            return;
        }
        let run = summary.run;
        console.log(run.stats);
        slackUtils.send(webhookUrl, slackUtils.slackMessage(run.stats, run.timings, run.failures, messageSize, collection, environment));
    });
    
    function missingReporterOptions(reporterOptions) {
        let missing = false;
        if (!reporterOptions.webhookurl) {
            console.error('Missing Slack Webhook Url');
            missing = true;
        }
        return missing;
    }
}
module.exports = SlackNewmanReporter