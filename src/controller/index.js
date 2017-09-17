

const index = (req, res) => {
    res.status(200).json({message: 'Server up!!'});
};

export {index};