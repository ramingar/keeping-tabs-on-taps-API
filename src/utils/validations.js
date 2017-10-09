const isValidNewStatus = (newStatus, currentStatus) => {
    const previousContractStatus = {
        'accepted': 'waiting',
        'cleared': 'accepted'
    };

    return previousContractStatus[newStatus] === currentStatus;
};

const isValidRequester = (userTypeRequester, statusRequested) => {
    const statusAccordingUser = {
        'debtor': 'accepted',
        'creditor': 'cleared'
    };

    return statusAccordingUser[userTypeRequester] === statusRequested;
};

export {isValidNewStatus, isValidRequester};