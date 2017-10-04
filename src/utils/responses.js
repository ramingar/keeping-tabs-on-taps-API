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

const buildResponse = (response) => {
    return setDocs(setPage(response));
};

export {codeMessages, buildResponse};