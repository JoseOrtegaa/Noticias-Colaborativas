const getConnection = require('../getConnections');

const { generateError } = require('../../helpers');

const selectNotice = async (idNotice) => {
    let connection;

    try {
        connection = await getConnection();

        //Actualizamos la Noticia
        const [notice] = await connection.query(
            `SELECT idUser, title, intro, text, image, theme FROM notices WHERE id = ?`,
            [idNotice]
        );

        if (notice.length < 1) {
            throw generateError('Usuario no encontrado', 404);
        }

        return notice;
    } finally {
        if (connection) connection.release();
    }
};

module.exports = selectNotice;
