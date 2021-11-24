# newman-reporter-slackmsg

Custom [Newman](https://github.com/postmanlabs/newman) reporter to send message to [Slack](https://slack.com/)

<img src="https://github.com/jackcoded/newman-reporter-slackmsg/blob/master/testResults.png?raw=true" width="450"  height="550">

## Before you get started
- Install [Newman](https://github.com/postmanlabs/newman) ``` $ npm run i -g newman ```
- Create a [Slack incoming webhook url](https://api.slack.com/messaging/webhooks)
or
- Create a [Slack bot to send to channel or user dynamically](https://api.slack.com/messaging/sending)

## Installation
 ```CLI
 npm i -g newman-reporter-slackmsg
 ```

## Usage
```CLI
 newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slackmsg-webhookurl '<webhookurl>'
```

## Usage with channel override bot
```CLI
 newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slackmsg-webhookurl '<https://slack.com/api/chat.postMessage>' --reporter-slackmsg-token '<bearer token>' --reporter-slackmsg-channel '<channel or userid>'
```

## Reporter Options Optionals
```
 --reporter-slackmsg-messageSize '<messageSize>' e.g 150
 --reporter-slackmsg-token '<bearer token>' e.g xoxb-XXXXXXXXXXXX-TTTTTTTTTTTTTT
 --reporter-slackmsg-channel '<channel>' e.g #general
 --reporter-slackmsg-failuresChannel '<channel>' e.g. #alerts
 --reporter-slackmsg-collection '<collectionName> e.g test.json
 --reporter-slackmsg-environment '<environmentName> e.g env.json
 --reporter-slackmsg-reportingurl '<URL> e.g https://127.0.1/index.html
  --reporter-slackmsg-limitFailures '<limitFailures>; e.g 5

```


## Reporter Options
**webhookurl** 
Webhook URL to point to the slack api where results are published

**collection** 
Option to add the name of collection file onto the message

**environment**
Option to add the name of environment file onto the message

**messageSize**
Option to change the message size, defaulted to 100

**token**
Option to use bearer token for slack bots for channel override

**channel**
Option to select channel or user receive the result

**failuresChannel**
Option to select channel or user to receive failures

**limitFailures**
Option to limit the amount failures shown in slack

