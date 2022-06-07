require('dotenv').config();

const { PORT } = process.env;

const express = require('express');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const app = express();

//Logger morgan
app.use(morgan('dev'));

// Deserializamos un body con formato "raw".
app.use(express.json());

// Deserializamos un body con formato "form-data".
app.use(fileUpload());

/**
 * #################
 * ## Middlewares ##
 * #################
 */

const userAuth = require('./middlewares/userAuth');

/**
 * ########################
 * ## Endpoints Usuarios ##
 * ########################
 */

const { newUser, loginUser } = require('./controllers/users');

//Registro de un nuevo usuario
app.post('/user', newUser);

//Login de usuario
app.post('/login', loginUser);

/**
 * ######################
 * ## Endpoints Notices ##
 * ######################
 */

const {
    newNotice,
    editNotice,
    deleteNotice,
} = require('./controllers/notices');

//Agregar una nueva noticia
app.post('/', userAuth, newNotice);

//Agregar una nueva noticia
app.post('/edit/:idNotice', userAuth, editNotice);

//Eliminar noticia
app.delete('/notice/:idNotice', userAuth, deleteNotice);

/**
 * ######################
 * ## Middleware Error ##
 * ######################
 */

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.statusCode || 500).send({
        status: 'error',
        message: err.message,
    });
});

/**
 * ##########################
 * ## Middleware Not Found ##
 * ##########################
 */

app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

app.listen(PORT, () => {
    console.log(`Server listening http://localhost:${PORT}`);
});
