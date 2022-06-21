// Conectamos con la base de datos y requerimos los modulos necesarios.
const getConnection = require('../getConnections');

// Creamos la funcion que selecciona los elementos a filtrar.
const selectAllNoticesQuery = async (theme, order, direction = 'DESC') => {
    let connection;

    try {
        connection = await getConnection();

        order = order === 'likes' ? 'likes' : 'N.createdAt';
        direction = direction === 'asc' ? 'ASC' : 'DESC';

        let notices;

        // Si hay palabra clave "keyword" buscamos los notices que contengan esa palabra
        // clave. De lo contrario retornamos todos los notices.

        if (theme) {
            [notices] = await connection.query(
                `
                SELECT  N.id, N.title, N.intro, N.theme, N.image, N.createdAt, SUM(IFNULL(L.vote = 1, 0)) AS likes, SUM(IFNULL(L.vote = 0, 0)) AS dislikes 
                FROM notices N
                LEFT JOIN likes L
                ON (N.id = L.idNotice)
                WHERE N.theme LIKE ?
                GROUP BY N.id 
                ORDER BY ${order} ${direction}
                `,
                [`%${theme}%`]
            );
        } else {
            [notices] = await connection.query(
                `
                SELECT N.id, N.title, N.intro, N.theme, N.image, N.createdAt, SUM(IFNULL(L.vote = 1, 0)) AS likes, SUM(IFNULL(L.vote = 0, 0)) AS dislikes 
                FROM notices N
                LEFT JOIN likes L
                ON (N.id = L.idNotice)
                GROUP BY N.id 
                ORDER BY ${order} ${direction}
                `
            );
        }

        return notices;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
module.exports = selectAllNoticesQuery;
