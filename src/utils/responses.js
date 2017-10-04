const codeMessages = {
    400: "Request malformed or has an invalid syntax",
    401: "Unauthorized: access to the requested resource is unauthorized",
    403: "Forbidden: access to the requested resource is forbidden",
    422: "Request was well-formed but it can't be processed"
};

const setPage = (response) => {
    const {total, limit, page, pages, docs} = response;
    const pageSection = Object.assign({}, {total, limit, page, pages});

    return Object.assign({}, {_page: pageSection, docs});
};

const setDocs = (response) => {
    return Object.assign({}, {_page: response._page, _docs: response.docs});
};

const setDoc = (response) => {
    return Object.assign({}, {_page: response._page, _data: response._doc});
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

const setLinks = (req, res) => {

    const _links = {
        'id': '/me',
        'login': '/login',
        'logout': '/logout'
    };

    if (req.user && req.user.id) {
        _links.user = '/user/' + req.user.id;
    }

    return Object.assign({}, {_links, _page: res._page, _docs: res._docs, _data: res._data, _doc: res._doc});
};

export {codeMessages, buildResponse, setLinks};