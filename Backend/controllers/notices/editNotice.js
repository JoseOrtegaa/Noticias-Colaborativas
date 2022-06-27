const path = require('path');
const sharp = require('sharp');
const { nanoid } = require('nanoid');
const editNoticeQuery = require('../../db/noticesQueries/editNoticeQuery');
const selectNoticeByIdQuery = require('../../db/noticesQueries/selectNoticeByIdQuery');

const { generateError, createPath } = require('../../helpers');

const editNotice = async (req, res, next) => {
    try {
        // Obtenemos los todos los datos.
        const { idNotice } = req.params;
        let { title, intro, text, theme } = req.body;

        // Verificamos que exista alguna, en caso contrario enviamos mensaje
        // Que no edito nada.
        if (!title && !intro && !text && !theme) {
            throw generateError(
                `No has editado ningun campo de la noticia`,
                400
            );
        }

        // Llamamos a la funcion para obtener la noticia mediante el parametro idNotice.
        const notice = await selectNoticeByIdQuery(idNotice);

        // Verificamos que la persona que quiere editar la noticia sea la misma que lo creo.
        if (req.idUser !== notice.idUser) {
            throw generateError(
                'No puedes editar una noticia de otra persona',
                401
            );
        }

        // Los datos que no nos envien, siguen igual.
        if (!title) {
            title = notice.title;
        }
        if (!intro) {
            intro = notice.intro;
        }
        if (!text) {
            text = notice.text;
        }
        if (!theme) {
            theme = notice.theme;
        }

        // Si viene una imagen la procesamos.
        let imgName;
        if (req.files && req.files.image) {
            // Creamos una ruta absoluta al directorio de descargas.
            const uploadsDir = path.join(__dirname, '../../uploads');

            // Creamos el directorio si aun no existe.
            await createPath(uploadsDir);

            // Procesamos la imagen y la convertimos en un objeti de tipo "Sharp".
            const sharpImg = sharp(req.files.image.data);

            // Le asignamos un valor especifico a la imagen.
            sharpImg.resize(500);

            // Nombre de la imagen.
            imgName = `${nanoid(10)}.jpg`;
            // Ruta absoluta de imagen
            const imgPath = path.join(uploadsDir, imgName);

            // Guardamos la imagen en el directorio de descargas.
            await sharpImg.toFile(imgPath);
        } else {
            imgName = notice.image;
        }

        // Editamos la noticia.
        await editNoticeQuery(idNotice, title, intro, text, imgName, theme);

        res.send({
            status: 'ok',
            mesagge: 'Noticia editada',
        });
    } catch (err) {
        next(err);
    }
};

module.exports = editNotice;
