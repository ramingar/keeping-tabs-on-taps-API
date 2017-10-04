import {buildResponse, setLinks} from "../utils/responses";

const index = (req, res) => {
    res.status(200).json(setLinks(req, buildResponse({message: 'Server up!!'})));
};

export {index};