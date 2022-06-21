const getConnection = require('../getConnections');

const editNoticeQuery = async (idNotice, title, intro, text, image, theme) => {
    let connection;

    try {
        connection = await getConnection();

        // Actualizamos la Noticia.
        await connection.query(
            `UPDATE notices
             SET title = '${title}', intro = '${intro}', text = '${text}', image = '${image}', theme = '${theme}'
             WHERE id = ?`,
            [idNotice]
        );
    } finally {
        if (connection) connection.release();
    }
};

module.exports = editNoticeQuery;
