import { useState } from 'react';
import { useToken } from '../../TokenContext';
import { useId } from '../../IdContext';

import './EditNotice.css';

const EditNotice = () => {
  const [token] = useToken();
  const [id] = useId();

  const [title, setTitle] = useState('');
  const [intro, setIntro] = useState('');
  const [text, setText] = useState('');
  const [theme, setTheme] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let idNotice;
    //Colocamos el try para hacer el fetch y la peticio Put.
    try {
      // Si queremos enviar un body con formato "form/data" es necesario
      // crear un objeto de tipo FormData y "pushear" los elementos.
      const formData = new FormData();

      // Pusheamos las propiedades con append.
      formData.append('title', title);
      formData.append('intro', intro);
      formData.append('text', text);
      formData.append('theme', theme);
      formData.append('image', selectedFile);

      const li = e.target.closest('li');

      idNotice = li.getAttribute('data-id');

      const res = await fetch(`http://localhost:4000/notice/${idNotice}/edit`, {
        method: 'PUT',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      // Obtenemos el objeto.
      const data = await res.json();

      // Si el estatus de Data es error, lo notificamos y enviamos un mensaje, en caso contrario, actualizamos las variables Like y Dislike.
      if (data.status === 'error') {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='NoticeCreate'>
      <form onSubmit={handleEdit}>
        <div className='InputForm'>
          <label htmlFor='title'>
            Titulo:<span>*</span>
          </label>
          <input
            type='text'
            name='title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className='InputForm'>
          <label htmlFor='intro'>Intro:</label>
          <input
            type='text'
            name='intro'
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
        </div>

        <div className='InputForm'>
          <label htmlFor='text'>
            Texto:<span>*</span>
          </label>
          <input
            type='text'
            name='text'
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className='InputForm'>
          <label htmlFor='theme'>
            Tema:<span>*</span>
          </label>
          <input
            type='text'
            name='theme'
            required
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor='image'>Imagen:</label>
          <input
            type='file'
            name='image'
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>
        <button disabled={loading}>Enviar</button>
      </form>
      {error && <p className='Error'>{error}</p>}
    </main>
  );
};

export default EditNotice;
