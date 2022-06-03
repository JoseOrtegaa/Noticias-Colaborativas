const fs = require('fs/promises');

const generateError = (message, status) => {
    const error = new Error(message);
    error.statusCode = status;
    return error;
};

const createPath = async (path) => {
    try {
        // Accedemos al directorio.
        await fs.access(path);
    } catch {
        // Si no logramos acceder, se crea la carpeta directamente
        await fs.mkdir(path);
    }
};

module.exports = {
    generateError,
    createPath,
};
