# newman-reporter-slackmsg

Custom [newman](https://github.com/postmanlabs/newman) reporter to send message to [slack](https://slack.com/)

<img src="https://github.com/jackcoded/newman-reporter-slackmsg/blob/master/testResults.png?raw=true" width="450"  height="400">


## Installation
 ```CLI
 npm run i -g newman-reporter-slackmsg
 ```

## Usage
 ```CLI
 newman run <collectionFile> -e <environmentFile> --suppress-exit-code -r slackmsg --reporter-slack-webhookurl '<webhookurl>'
 ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
