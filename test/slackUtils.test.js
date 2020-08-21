const axios = require('axios').default;
const {
    slackUtils
} = require('../slackUtils');
const prettyms = require('pretty-ms');

jest.mock('axios');

describe('slackUtils', () => {
    describe('send()', () => {
        test('should not send slack notification if error', async () => {
            axios.mockRejectedValue(new Error('test error'));
            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
            const result = await slackUtils.send('test', '{"test":"test"}');
            expect(result).toEqual(false);
            expect(consoleErrorSpy).toBeCalled();   
        });
        test('should send slack notification if no error', async () => {
            const mockPayload = {
                method: 'POST',
                url: 'test',
                data: '{"test":"test"}',
                headers: {
                    'content-type': 'application/json',
                },
            };
            const mockResponse = { data: 'Hello' }
            axios.mockResolvedValue(mockResponse);
            const result = await slackUtils.send('test', '{"test":"test"}')
            expect(result).toEqual(mockResponse);
            expect(axios).toBeCalled();
            expect(axios).toBeCalledWith(mockPayload);
        });
    });

    describe('slackMessage()', () => {
        const mockFail = [{
            "error": {
                "name": "AssertionError",
                "index": 0,
                "test": "Status code is 400",
                "message": "expected response to have status code 400 but got 200",
                "stack": "AssertionError: expected response to have status code 400 but got 200\n   at Object.eval sandbox-script.js:1:2)",
            },
            "source": {
                "name": "footest"
            }
        },
        {
            "error": {
                "name": "AssertionError",
                "index": 0,
                "test": "Status code is 400",
                "message": "expected response to have status code 400 but got 200",
                "stack": "AssertionError: expected response to have status code 400 but got 200\n   at Object.eval sandbox-script.js:1:2)",
            },
            "source": {
                "name": "footest"
            }
        },
        {
            "error": {
                "name": "AssertionError",
                "index": 0,
                "test": "Status code is 400",
                "message": "expected response to have status code 400 but got 200",
                "stack": "AssertionError: expected response to have status code 400 but got 200\n   at Object.eval sandbox-script.js:1:2)",
            },
            "source": {
                "name": "footest2"
            }
        }]        
        const mockTimings = {
            started: 1593395581284,
            completed: 1593395582633
          }
        
        const mockStats = {
            requests: { total: 4, pending: 0, failed: 0 },
          }
          test('should return jsonfile', () => {
              const result = slackUtils.slackMessage(mockStats, mockTimings, mockFail);
              const duration = prettyms(mockTimings.completed - mockTimings.started)
              expect(result).toContain(`{"type":"mrkdwn","text":"Total Tests:"},{"type":"mrkdwn","text":"4"}`);
              expect(result).toContain(`{"type":"mrkdwn","text":"Test Passed:"},{"type":"mrkdwn","text":"2"}`);
              expect(result).toContain(`{"type":"mrkdwn","text":"Test Failed:"},{"type":"mrkdwn","text":"2"}`);
              expect(result).toContain(`{"type":"mrkdwn","text":"Test Duration:"},{"type":"mrkdwn","text":"${duration}"}`)
          });
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
});
