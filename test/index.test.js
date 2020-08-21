const slackNewmanReporter = require('../index');
const { slackUtils } = require('../slackUtils');
const events = require('events');

jest.mock('../slackUtils');

describe('SlackNewmanReporter', () => {
    let mockEmitter;
    const summary = {run: { stats: '', failures: {}, timings: {}}}

    beforeEach(() => {
        mockEmitter = new events.EventEmitter();
    });

    test('should show error if missing reporterOption values ', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        
        slackNewmanReporter(mockEmitter, {}, {});
        
        expect(consoleErrorSpy).toBeCalledTimes(1);
        expect(slackUtils.send).not.toHaveBeenCalled();
        expect(slackUtils.slackMessage).not.toHaveBeenCalled();
    });

    test('should show error if emit error in emitter', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        slackNewmanReporter(mockEmitter, {webhookurl: 'test'}, {});
        mockEmitter.emit('done', 'error');
        
        expect(consoleErrorSpy).toBeCalledTimes(1);
        expect(slackUtils.send).not.toHaveBeenCalled();
        expect(slackUtils.slackMessage).not.toHaveBeenCalled();
    });

    test('should start slack reporter given no errors', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        slackNewmanReporter(mockEmitter, {webhookurl: 'test'}, {});
        mockEmitter.emit('done', '', summary);

        expect(slackUtils.send).toHaveBeenCalled();
        expect(slackUtils.slackMessage).toHaveBeenCalled();
        expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
});
