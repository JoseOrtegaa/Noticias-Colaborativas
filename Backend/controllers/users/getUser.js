const selectUserByIdQuery = require('../../db/userQueries/selectUserByIdQuery');

const getUser = async (req, res, next) => {
    try {
        // Obtenemos el id del usuario del cual queremos la información.
        const { idUser } = req.params;

        // Obtenemos la información del usuario.
        const user = await selectUserByIdQuery(idUser);

        res.send({
            status: 'ok',
            data: {
                user,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = getUser;
