const {
    slackUtils
} = require('./slackUtils');

function SlackNewmanReporter(emitter, reporterOptions) {
    if (missingReporterOptions(reporterOptions)) {
        return;
    }
    const webhookUrl = reporterOptions.webhookurl;
    emitter.on('done', (error, summary) => {
        if (error) {
            console.error('error in done')
            return;
        }
        let run = summary.run;
        slackUtils.send(webhookUrl, slackUtils.slackMessage(run.stats, run.timings, run.failures));
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