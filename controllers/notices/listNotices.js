const selectAllNoticesQuery = require('../../db/noticesQueries/selectAllNoticesQuery');

const listNotices = async (req, res, next) => {
    try {
        const { theme, order, direction } = req.query;

        const notices = await selectAllNoticesQuery(theme, order, direction);

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
