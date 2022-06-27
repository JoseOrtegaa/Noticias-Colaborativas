import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useToken } from '../../TokenContext';
import { NavLink } from 'react-router-dom';
import EditNotice from '../EditNotice/EditNotice';

import './NoticeSearch.css';

const SearchNotice = () => {
  const [token] = useToken();

  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [notices, setNotices] = useState(null);
  const [updateLikes, setUpdateLikes] = useState(true);
  const [updateDislikes, setUpdateDislikes] = useState(false);
  const [error, setError] = useState(null);

  // Mediante esta función obtenemos todas las noticias.
  const getNotices = async () => {
    setLoading(true);

    // Vaciamos el error.
    setError(null);

    try {
      // Hacemos la petición a la API.
      const res = await fetch(
        `http://localhost:4000/notice/get?keyword=${keyword}`
      );

      // Obtenemos el objeto.
      const data = await res.json();

      // En caso de error lo notificamos.
      if (data.data.status === 'error') {
        setError(data.message);
        setNotices(null);
      } else {
        // Si no, actualizamos la variable Notice con las noticias actuales.
        setNotices(data.data.notices);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Creamos la funcion que se ejecutara al hacer click.
  const handleSubmit = (e) => {
    e.preventDefault();

    // Obtenenmos las noticias.
    getNotices();
  };

  // Función encargada de gestionar los likes y dislikes.
  const handleVote = async (e) => {
    setLoading(true);
    setError(null);

    const li = e.target.closest('li');

    const idNotice = li.getAttribute('data-id');

    // Creamos la variable res que depende del click del usuario se ejecutara una u otra petición a la API.
    let res;
    try {
      // Si el usuario pulso el boton Like, se envian los datos necesario para sumar un Like o en su defecto, quitarlo.
      if (e.target.value === 'true') {
        setUpdateLikes(true);

        // Hacemos la petición a la API y le enviamos los datos necesarios.
        res = await fetch(`http://localhost:4000/notice/${idNotice}/like`, {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vote: updateLikes,
          }),
        });
      }
      // Si el usuario pulso el boton Dislike, se envian los datos necesario para sumar un Dislike o en su defecto, quitarlo.
      else if (e.target.value === 'false') {
        setUpdateDislikes(false);

        // Hacemos la petición a la API y le enviamos los datos necesarios.
        res = await fetch(`http://localhost:4000/notice/${idNotice}/like`, {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vote: updateDislikes,
          }),
        });
      }

      // Obtenemos el objeto.
      const data = await res.json();

      // Si el estatus de Data es error, lo notificamos y enviamos un mensaje, en caso contrario, actualizamos.
      if (data.status === 'error') {
        setError(data.message);
      } else {
        setRefresh(!refresh);
        getNotices();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar Noticia SOLO si es la misma persona que la creo.
  const handleDelete = async (e) => {
    setLoading(true);
    setError(null);

    // Si el usuario pulso el boton, le preguntamos si desea eliminar la noticia.
    if (window.confirm('¿Eliminar Noticia?')) {
      const li = e.target.closest('li');

      const idNotice = li.getAttribute('data-id');

      //Colocamos el try para hacer el fetch y la peticio Delete.
      try {
        const res = await fetch(`http://localhost:4000/notice/${idNotice}`, {
          method: 'DELETE',
          headers: {
            Authorization: token,
          },
        });

        // Obtenemos el objeto.
        const data = await res.json();

        // Si el estatus de Data es error, lo notificamos y enviamos un mensaje, en caso contrario, actualizamos las variables Like y Dislike.
        if (data.status === 'error') {
          setError(data.message);
        } else {
          setRefresh(!refresh);
          getNotices();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Con este "useEffect" hacemos que se muestren las noticias apenas se cargue la pagina.
  useEffect(() => {
    getNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <main className='NoticeSearch'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='keyword'
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button disabled={loading}>Buscar</button>
      </form>

      {error && <p className='Error'>{error}</p>}

      {notices && (
        <ul className='NoticeList'>
          {notices.map((notice) => {
            const dateTime = format(new Date(notice.createdAt), 'yyyy-MM-dd');

            return (
              <li key={notice.id} data-id={notice.id}>
                <header className='HeaderNotice'>
                  <p>u/{notice.name}</p>
                  <time dateTime={dateTime}>
                    {format(new Date(notice.createdAt), 'hh:mm - dd/MM/yy')}
                  </time>
                </header>
                <div className='BodyNotice'>
                  <div className='UpNotice'>
                    <p>{notice.title}</p>
                    <p>{notice.theme}</p>
                  </div>
                  <div className='DownNotice'>
                    <p>{notice.intro}</p>
                    <p>{notice.text}</p>
                    {notice.image && (
                      <img
                        className='ImagenNotice'
                        src={`http://localhost:4000/${notice.image}`}
                        alt='Imagen del tweet'
                      />
                    )}
                  </div>
                </div>

                <footer>
                  <div>
                    <p>
                      {notice.likes}
                      <button value={true} onClick={token && handleVote}>
                        👍
                      </button>
                    </p>
                    <p>
                      {notice.dislikes}
                      <button value={false} onClick={token && handleVote}>
                        👎
                      </button>
                    </p>
                  </div>
                  <div>
                    {token && <NavLink to={`/notice/edit`}>Editar</NavLink>}

                    {token && <button onClick={handleDelete}>Eliminar</button>}
                  </div>
                </footer>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default SearchNotice;
