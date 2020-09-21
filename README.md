# newman-reporter-slackmsg

Custom [Newman](https://github.com/postmanlabs/newman) reporter to send message to [Slack](https://slack.com/)

<img src="https://github.com/jackcoded/newman-reporter-slackmsg/blob/master/testResults.png?raw=true" width="500"  height="450">

## Before you get started
- Install [Newman](https://github.com/postmanlabs/newman) ``` $ npm run i -g newman ```
- Create a [Slack incoming webhook url](https://api.slack.com/messaging/webhooks)

## Installation
 ```CLI
 npm i -g newman-reporter-slackmsg
 ```

## Usage
```CLI
 newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slackmsg-webhookurl '<webhookurl>'
```
```CLI optionals with collection, environment, messageSize
 newman run <collectionFilePath> -e <environmentFilePath> --suppress-exit-code -r slackmsg --reporter-slackmsg-webhookurl '<webhookurl>', --reporter-slackmsg-collection '<collectionName>' --reporter-slackmsg-environment '<environmentName>' --reporter-slackmsg-messageSize '<messageSize>'
```

## Reporter Options
**webhookurl** 
Webhook URL to point to the slack channel where results are published

**messageSize**
Option to change the message size, defaulted to 100

**collection** 
Option to add the name of collection file onto the message

**environment**
Option to add the name of environment file onto the message
