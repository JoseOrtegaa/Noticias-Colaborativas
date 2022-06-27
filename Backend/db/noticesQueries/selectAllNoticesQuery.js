// Conectamos con la base de datos y requerimos los modulos necesarios.
const { generateError } = require('../../helpers');
const getConnection = require('../getConnections');

// Creamos la funcion que selecciona los elementos a filtrar.
const selectAllNoticesQuery = async (keyword) => {
    let connection;

    try {
        connection = await getConnection();

        let notices;

        // Si hay palabra clave "keyword" buscamos los notices que contengan esa palabra
        // clave. De lo contrario retornamos todos los notices.

        if (keyword) {
            [notices] = await connection.query(
                `
                SELECT  N.id, N.text, N.title, U.name, N.intro, N.theme, N.image, N.createdAt, SUM(IFNULL(L.vote = 1, 0)) AS likes, SUM(IFNULL(L.vote = 0, 0)) AS dislikes 
                FROM notices N
                LEFT JOIN likes L
                ON (N.id = L.idNotice)
                LEFT JOIN users U
                ON N.idUser = U.id
                WHERE N.theme LIKE ?
                GROUP BY N.id 
                ORDER BY N.createdAt DESC
                `,
                [`%${keyword}%`]
            );
        } else {
            [notices] = await connection.query(
                `
                SELECT N.id, N.title, U.name, N.text, N.intro, N.theme, N.image, N.createdAt, SUM(IFNULL(L.vote = 1, 0)) AS likes, SUM(IFNULL(L.vote = 0, 0)) AS dislikes 
                FROM notices N
                LEFT JOIN likes L
                ON (N.id = L.idNotice)
                LEFT JOIN users U
                ON N.idUser = U.id
                GROUP BY N.id 
                ORDER BY N.createdAt DESC
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
