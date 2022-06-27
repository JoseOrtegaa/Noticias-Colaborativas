const selectAllNoticesQuery = require('../../db/noticesQueries/selectAllNoticesQuery');

const listNotices = async (req, res, next) => {
    try {
        const { keyword } = req.query;

        console.log(keyword);

        const notices = await selectAllNoticesQuery(keyword);

        res.send({
            status: 'ok',
            data: {
                notices,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = listNotices;
