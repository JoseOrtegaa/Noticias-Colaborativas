import { createContext, useContext, useState } from 'react';

// Creamos el contexto.
const IdContext = createContext(null);

// Componente que rodeara el resto de componentes de nuestra App.
export const IdProvider = ({ children }) => {
  const [Id, setId] = useState(localStorage.getItem('id'));

  // Función para guardar el token en el localstorage, lo guarda en una variable "token"
  const setIdInLocalStorage = (newId) => {
    if (!newId) {
      localStorage.removeItem('id');
    } else {
      localStorage.setItem('id', newId);
    }
    setId(newId);
  };

  return (
    <IdContext.Provider value={[Id, setIdInLocalStorage]}>
      {children}
    </IdContext.Provider>
  );
};

// Hook para poder reutilizar el token.
export const useId = () => {
  return useContext(IdContext);
};
