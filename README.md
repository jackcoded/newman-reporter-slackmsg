# newman-reporter-slackmsg

Custom newman reporter for slack

### How to install 
 npm run i -g newman-reporter-slackmsg

### How to use
 newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slack-webhookurl '<webhookurl>'
