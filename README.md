# newman-reporter-slackmsg

Custom [newman](https://github.com/postmanlabs/newman) reporter to send message to [slack](https://slack.com/)


### How to install 
 npm run i -g newman-reporter-slackmsg

### How to use
 newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slack-webhookurl '<webhookurl>'
