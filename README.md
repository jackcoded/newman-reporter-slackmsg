# newman-reporter-slackmsg

Custom [newman](https://github.com/postmanlabs/newman) reporter to send message to [slack](https://slack.com/)


### How to install 
 ```cli npm run i -g newman-reporter-slackmsg
 ```

### How to use
 ```cli newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slack-webhookurl '<webhookurl>'
 ```
