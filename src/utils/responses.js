import {paginate} from 'mongoose-paginate';

const codeMessages = {
    400: "Request malformed or has an invalid syntax",
    401: "Unauthorized: access to the requested resource is unauthorized",
    403: "Forbidden: access to the requested resource is forbidden",
    422: "Request was well-formed but it can't be processed"
};

const setPage = (response) => {
    const {total, limit, page, pages, docs} = response;
    const pageSection = Object.assign({}, {total, limit, page, pages});

    return Object.assign({}, {_result: pageSection, docs});
};

const setDocs = (response) => {
    return Object.assign({}, {_result: response._result, _docs: response.docs});
};

const setDoc = (response) => {
    return Object.assign({}, {_result: response._result, _data: response._doc});
};

const setData = (response) => {
    return Object.assign({}, {'_data': {...response}});
};

const buildResponse = (response) => {
    let newResponse = null;
    if (response.docs) {
        newResponse = setDocs(setPage(response));
    } else if (response._doc) {
        newResponse = setDoc(response);
    } else {
        newResponse = setData(response);
    }
    return newResponse;
};

const getRestOfQuery = (query) => {
    let restOfQuerystring = '';
    Object.keys(query).forEach(function (key) {
        if ('page' !== key && 'limit' !== key) {
            restOfQuerystring += `&${key}=${query[key]}`;
        }
    });
    return restOfQuerystring;
};

const setNextAndPrevious = (request, response) => {
    if (response._result.page === 1 && response._result.page >= response._result.pages) return;

    const page = {};
    const urlWithoutQuery = request.url.split('?')[0];

    const queryLimit = request.query.limit || paginate.options.limit;
    const queryPage = request.query.page || paginate.options.page;

    const next = `${urlWithoutQuery}?page=${Number.parseInt(queryPage) + 1}&limit=${queryLimit}${getRestOfQuery(request.query)}`;
    const previous = `${urlWithoutQuery}?page=${Number.parseInt(queryPage) - 1}&limit=${queryLimit}${getRestOfQuery(request.query)}`;

    if (response._result.page === 1) {
        page.next = next;
    } else if (response._result.page >= response._result.pages) {
        page.previous = previous;
    } else {
        page.next = next;
        page.previous = previous;
    }

    return page;
};

const setLinks = (req, res) => {

    const _links = {
        'login': '/login',
        'logout': '/logout'
    };

    if (req.user && req.user.id) {
        _links.id = '/me';
        _links.user = '/user/' + req.user.id;
        _links.contractsAsCreditor = '/user/' + req.user.id + '/contract';
    }

    if (res._result) {
        _links.page = setNextAndPrevious(req, res);
    }

    return Object.assign({}, {_links, _result: res._result, _docs: res._docs, _data: res._data, _doc: res._doc});
};

export {codeMessages, buildResponse, setLinks};