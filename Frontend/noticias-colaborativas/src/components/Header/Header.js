import { NavLink } from 'react-router-dom';
import { useToken } from '../../TokenContext';
import { useId } from '../../IdContext';

import './Header.css';
import IdentityUser from '../IdentityUser/IdentityUser';

const Header = () => {
  const [token, setToken] = useToken();
  const [id, setId] = useId();

  const Logout = () => {
    setToken(null);
    setId(null);
  };

  return (
    <header>
      <div>
        <h1>Rdit</h1>
      </div>

      <div>{token && id && <IdentityUser />}</div>

      <div className='Buttons'>
        {!token && (
          <div className='BtnSignup'>
            <NavLink to='/users'>Registrarse</NavLink>
          </div>
        )}
        {!token && (
          <div className='BtnLogin'>
            <NavLink to='/login'>Iniciar Sesión</NavLink>
          </div>
        )}
        {token && (
          <div className='BtnNotice'>
            <NavLink to='/notice'>+</NavLink>
          </div>
        )}
        {token && (
          <div className='BtnLogout' onClick={() => Logout()}>
            <p>Salir</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
