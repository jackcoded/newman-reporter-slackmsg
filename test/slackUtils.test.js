const axios = require('axios').default;
const {
    slackUtils
} = require('../slackUtils');
const prettyms = require('pretty-ms');

/* eslint-disable no-undef */
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
                url: 'testurl',
                data: '{"test":"test"}',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer '
                },
            };
            const mockResponse = { data: 'Hello' }
            axios.mockResolvedValue(mockResponse);
            const result = await slackUtils.send('testurl', '{"test":"test"}', '')
            expect(result).toEqual(mockResponse);
            expect(axios).toBeCalledWith(mockPayload);
        });

        test('should send slack notification with token', async () => {
            const mockPayload = {
                method: 'POST',
                url: 'https://slack.com/api/chat.postMessage',
                data: '{"test":"test"}',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': 'Bearer faketoken'
                },
            };
            const mockResponse = { data: 'Hello' }
            axios.mockResolvedValue(mockResponse);
            const result = await slackUtils.send('https://slack.com/api/chat.postMessage', '{"test":"test"}', 'faketoken')
            expect(result).toEqual(mockResponse);
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
                "test": "Test fail",
                "message": "expected 'footest' fail",
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
                "test": "Status code is 500",
                "message": "expected response to have status code 500 but got 200 test more than 100 characters blah blah blah blah blah blah blah",
                "stack": "AssertionError: expected response to have status code 500 but got 200\n   at Object.eval sandbox-script.js:1:2)",
            },
            "source": {
                "name": "footest2"
            }
        }
        ]
        const mockTimings = {
            started: 1593395581284,
            completed: 1593395582633
        }

        const mockFailStats = {
            requests: { total: 4, pending: 0, failed: 2 },
            assertions: { total: 2, failed: 1 }
        }

        const mockPassStats = {
            requests: { total: 4, pending: 0, failed: 0 },
            assertions: { total: 2, failed: 0 }
        }

        const mockExecutions = [
            {
                "assertions": [
                    {
                        "assertion": "Status code is 500",
                        "skipped": false
                    }
                ]
            },
            {
                "assertions": [
                    {
                        "assertion": "Status code is 200",
                        "skipped": true
                    }
                ]
            }
        ];

        test('should return good result', () => {
            const result = slackUtils.slackMessage(mockPassStats, mockTimings, [], mockExecutions, 100, '', '', '#general');

            const duration = prettyms(mockTimings.completed - mockTimings.started)
            // should include channel name if given for channel override
            expect(result).toContain(`"channel":"#general"`);
            // successful message 
            expect(result).toContain(`{"type":"mrkdwn","text":"Total Tests:"},{"type":"mrkdwn","text":"4"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Passed:"},{"type":"mrkdwn","text":"3"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Failed:"},{"type":"mrkdwn","text":"0"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Skipped:"},{"type":"mrkdwn","text":"1"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Duration:"},{"type":"mrkdwn","text":"${duration}"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Assertions:"},{"type":"mrkdwn","text":"Total: 2  Failed: 0"}`);
            expect(result).toContain(`:white_check_mark: All Passed :white_check_mark:`);
        });


        test('should return message with collection and environment', () => {
            const collectionFileName = 'testCollection'
            const environmentFileName = 'testEnvironment';
            const result = slackUtils.slackMessage(mockFailStats, mockTimings, [], mockExecutions, 100, collectionFileName, environmentFileName);

            expect(result).toContain(`{"type":"mrkdwn","text":"Collection: ${collectionFileName} \\n Environment: ${environmentFileName}"}}`)
        });

        test('should return message truncate by message size', () => {
            const result = slackUtils.slackMessage(mockFailStats, mockTimings, mockFail, mockExecutions, 106);

            expect(result).toContain(`Expected - response to have status code 500 but got 200 test more than 100 characters blah blah blah blah ...`);
        });

        test('should return failure result', () => {
            const result = slackUtils.slackMessage(mockFailStats, mockTimings, mockFail, [], 100);
            const duration = prettyms(mockTimings.completed - mockTimings.started)
            
            expect(result).toContain(`{"type":"mrkdwn","text":"Total Tests:"},{"type":"mrkdwn","text":"4"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Passed:"},{"type":"mrkdwn","text":"2"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Failed:"},{"type":"mrkdwn","text":"2"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Skipped:"},{"type":"mrkdwn","text":"0"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Assertions:"},{"type":"mrkdwn","text":"Total: 2  Failed: 1"}`);
            expect(result).toContain(`{"type":"mrkdwn","text":"Test Duration:"},{"type":"mrkdwn","text":"${duration}"}`);
            //failures
            expect(result).toContain(`:fire: Failures :fire:`);
            expect(result).toContain(`footest`);
            expect(result).toContain(`1. AssertionError - Status code is 400`);
            expect(result).toContain(`2. AssertionError - Test fail`);
            expect(result).toContain(`Expected - response to have status code 400 but got 200`);
            // should expect clean error message
            expect(result).toContain(`Expected - footest fail`);
            expect(result).toContain(`footest2`);
            expect(result).toContain(`1. AssertionError - Status code is 500`);
            // should truncate error message
            expect(result).toContain(`Expected - response to have status code 500 but got 200 test more than 100 characters blah blah blah...`);
        }); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

});
