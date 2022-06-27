import { useId } from '../../IdContext';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './IdentityUser.css';
const IdentityUser = () => {
  const [id] = useId();

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const Information = async () => {
    try {
      const res = await fetch(`http://localhost:4000/users/${id}`);

      // Obtenemos el objeto.
      const data = await res.json();

      setUser(data.data.user[0]);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user === null) {
    Information();
  } else {
    return (
      <div className='Identity'>
        {user.image && (
          <img
            className='ImagenIdentity'
            src={`http://localhost:4000/${user.image}`}
            alt={`Imagen perfil de ${user.name}`}
          />
        )}

        <NavLink to='/'>u/{user.name}</NavLink>
        {error && <p className='Error'>{error}</p>}
      </div>
    );
  }
};

export default IdentityUser;
