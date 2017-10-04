import test from 'tape';
import {buildResponse} from "../src/utils/responses";

test('-------- Util buildResponse', (assert) => {
    const message = 'Response expected doesn\'t match with the actual response';

    const response = {
        'total': 1,
        'limit': 50,
        'page': 1,
        'pages': 1,
        'docs': [
            {
                '_id': 'blablablabla',
                'created': '2017-10-04T15:10:47.472Z',
                'payment': 'Another 2kg hamburger with chips and beer',
                'concept': 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                'status': 'waiting'
            }
        ]
    };

    const responseExpected = {
        '_page': {
            'total': 1,
            'limit': 50,
            'page': 1,
            'pages': 1
        },
        'docs': [
            {
                '_id': 'blablablabla',
                'created': '2017-10-04T15:10:47.472Z',
                'payment': 'Another 2kg hamburger with chips and beer',
                'concept': 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                'status': 'waiting'
            }
        ]
    };

    const actualResponse = buildResponse(response);

    assert.deepEqual(actualResponse, responseExpected, message);
    assert.end();
});