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
    const token = reporterOptions.token || '';
    const reportingUrl = reporterOptions.reportingurl || '';
    let channel = reporterOptions.channel || '';
    let limitFailures = reporterOptions.limitFailures || null;


    emitter.on('done', (error, summary) => {
        if (error) {
            console.error('error in done')
            return;
        }
        let run = summary.run;

        if (run.failures.length > 0 && reporterOptions.failuresChannel) {
            channel = reporterOptions.failuresChannel;
        }

        slackUtils.send(webhookUrl, slackUtils.slackMessage(run.stats, run.timings, run.failures, run.executions, messageSize, collection, environment, channel, reportingUrl, limitFailures), token);
    });

    function missingReporterOptions(reporterOptions) {
        let missing = false;
        if (!reporterOptions.webhookurl) {
            console.error('Missing Slack Webhook Url');
            missing = true;
        }
        if (reporterOptions.webhookurl === 'https://slack.com/api/chat.postMessage') {
            if (!reporterOptions.token) {
                console.error('Missing Bearer Token');
                missing = true;
            }
            if (!reporterOptions.channel) {
                console.error('Missing channel');
                missing = true;
            }
        }
        return missing;
    }
}
module.exports = SlackNewmanReporter