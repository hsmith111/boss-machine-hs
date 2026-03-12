const checkMillionDollarIdea = (req, res, next) => {
    const weeklyRevenue = Number(req.body.weeklyRevenue);
    const numWeeks = Number(req.body.numWeeks);

    if (!Number.isFinite(weeklyRevenue) || !Number.isFinite(numWeeks)) {
        return res.status(400).send();
    }
    if (weeklyRevenue * numWeeks < 1000000) {
        return res.status(400).send();
    }
    next();
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
