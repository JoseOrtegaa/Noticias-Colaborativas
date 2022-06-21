// Importamos la query de likesQueries.js.
const likesQueries = require('../../db/noticesQueries/likesQueries');

// Creamos la funcion de likes.
const likes = async (req, res, next) => {
    try {
        // Obtenemos el id de la noticia y el id del usuario.
        const { idNotice } = req.params;

        const { idUser } = req;

        const { vote } = req.body;

        // Llamamos a la funcion likeQueries.
        await likesQueries(idNotice, idUser, vote);

        // Condición que arroja mensaje de estatus like.
        if (vote) {
            res.send({ status: 'ok', mensage: 'like añadido' });
        } else {
            res.send({ status: 'ok', mensage: 'like Eliminado' });
        }
    } catch (err) {
        next(err);
    }
};

// Exportamos la funcion de likes.
module.exports = likes;
