## Web de Noticias colaborativas

Este proyecto consiste en crear una app similar a reddit o menéame.

## Instalar

-   Crear una base de datos vacía en una instancia de MySQL local.

-   Guardar el archivo `.env.example` como `.env` y cubrir los datos necesarios.

-   Ejecutar `npm run initDB` para crear las tablas necesarias en la base de datos anteriormente creada.

-   Ejecutar `npm run dev` o `npm start` para lanzar el servidor.

## Entidades

-   Users

    -   id
    -   name
    -   email
    -   biography
    -   foto

-   Notices

    -   id
    -   title
    -   foto
    -   intro
    -   notice
    -   theme

-   Likes
    -   idUsers
    -   idNotice

## ENDPOINTS

Usuarios Anonimos:

-   GET [/] - Visualizar la lista de las ultimas noticias del dia ordenada por valoracion
-   GET [/tema:Nombre_tema] - Visualizar noticias de dias anteriores:
    · filtradas por:
    · Tema ** req.query **

-   POST [/login] - Login **_ LISTO _**
-   POST [/user] - Registro: Nombre, Email, Biografia, Foto **_ LISTO _**

Usuarios Registrados:

## Lo mismo que los anonimos

-   POST [/] - Publicar una nueva noticia: Titulo, Foto (opcional), Entradilla, Texto de la noticia, Tema ## (necesita cabecera con token) **_ LISTO _**
-   POST [/notice/edit/:idNoticia]Editar una noticia publicada por el mismo usuario ## (necesita cabecera con token) ##
-   DELETE [/notice/:idNotice] Borrar una noticia publicada por el usuario ## (necesita cabecera con token) ##
-   POST [/notice/vote] Votar positivamente o negativamente otras noticias

## BONUS POINT

-   POST [/edit/user/:idUser]Gestión del perfil de usuario (Nombre, Email, Biografía, Foto, …
