const getConnection = require('./getConnections');

async function main() {
    //Variable que almacenará una conexión libre de la base de datos
    let connection;

    try {
        //Obtenemos una conexion libre.
        connection = await getConnection();

        console.log('Borrando tablas existentes...');

        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('DROP TABLE IF EXISTS notices');
        await connection.query('DROP TABLE IF EXISTS likes');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creandoo tablas...');

        await connection.query(`
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                biography VARCHAR(200),
                image VARCHAR(100),
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('users creada');

        await connection.query(`
            CREATE TABLE notices(
                id INTEGER PRIMARY KEY AUTO_INCREMENT,
                idUser INTEGER NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                title VARCHAR(20) NOT NULL,
                intro VARCHAR(50) ,
                text VARCHAR(150) NOT NULL,
                image VARCHAR(100),
                theme VARCHAR(100) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            ) 
        `);

        console.log('notices creada');
    } catch (err) {
        console.log(err);
    } finally {
        //Si existe una conexion libre la liberamos.
        if (connection) connection.release();

        //Cerramos el proceso actual
        process.exit();
    }
}

// LLamamos a la funcion principal.
main();
