import test from 'tape';
import {buildResponse, setLinks} from '../src/utils/responses';

test('-------- Util buildResponse(): multi result', (assert) => {
    const message = 'Response expected must match with the actual response';

    const responseTemp = {
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
        '_docs': [
            {
                '_id': 'blablablabla',
                'created': '2017-10-04T15:10:47.472Z',
                'payment': 'Another 2kg hamburger with chips and beer',
                'concept': 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                'status': 'waiting'
            }
        ]
    };

    const actualResponse = buildResponse(responseTemp);

    assert.deepEqual(actualResponse, responseExpected, message);
    assert.end();
});

test('-------- Util buildResponse(): single result', (assert) => {
    const message = 'Response expected must match with the actual response';

    const responseTemp = {

        '_id': 'blablablabla',
        'created': '2017-10-04T15:10:47.472Z',
        'payment': 'Another 2kg hamburger with chips and beer',
        'concept': 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
        'status': 'waiting'

    };

    const responseExpected = {
        '_data': {
            '_id': 'blablablabla',
            'created': '2017-10-04T15:10:47.472Z',
            'payment': 'Another 2kg hamburger with chips and beer',
            'concept': 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
            'status': 'waiting'
        }
    };

    const actualResponse = buildResponse(responseTemp);

    assert.deepEqual(actualResponse, responseExpected, message);
    assert.end();
});

test('-------- Util setLinks()', (assert) => {
    const message = 'Response expected must match with the actual response';

    const request = {
        'originalUrl': '/user/1111/contract',
        'user': {
            'id': '1111'
        }
    };

    const responseTemp = {
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
        '_links': {
            'id': '/me',
            'login': '/login',
            'logout': '/logout',
            'user': '/user/1111'
        },
        '_page': {
            'total': 1,
            'limit': 50,
            'page': 1,
            'pages': 1
        },
        '_docs': [
            {
                '_id': 'blablablabla',
                'created': '2017-10-04T15:10:47.472Z',
                'payment': 'Another 2kg hamburger with chips and beer',
                'concept': 'We bet that I didn\'t eat a 2kg hamburger in less than 10 minutes',
                'status': 'waiting'
            }
        ],
        _data: undefined,
        _doc: undefined
    };

    const actualResponse = setLinks(request, buildResponse(responseTemp));

    assert.deepEqual(actualResponse, responseExpected, message);
    assert.end();
});