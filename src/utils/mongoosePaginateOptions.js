import {paginate} from 'mongoose-paginate';

export default (req) => {
    return {
        page: Number.parseInt(req.query.page) || paginate.options.page,
        limit: Number.parseInt(req.query.limit) || paginate.options.limit
    };
}