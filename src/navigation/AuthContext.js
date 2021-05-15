import { createContext } from 'react';

const AuthContext = createContext({
  authenticated: false,
  setAuthenticated: () => {},
});

export default AuthContext;
