import { createContext, useContext, useEffect, useState } from 'react';
import { api, endpoints } from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('carni_token'));
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(!!sessionStorage.getItem('carni_token'));
  async function cargarPerfil() {
    const { data } = await api.get(endpoints.perfil);
    setUsuario(data.usuario || data);
    return data;
  }
  useEffect(() => {
    if (!token) { setCargando(false); setUsuario(null); return; }
    let activo = true;
    api.get(endpoints.perfil).then(({data}) => { if(activo) setUsuario(data.usuario || data); })
      .catch(() => { if(activo) { sessionStorage.removeItem('carni_token'); setToken(null); setUsuario(null); } })
      .finally(() => { if(activo) setCargando(false); });
    return () => { activo = false; };
  }, [token]);
  async function login(correo, contrasena) {
    const { data } = await api.post(endpoints.login, { correo, contrasena });
    const nuevoToken = data.token || data.accessToken;
    if (!nuevoToken) throw new Error('La API no devolvió un token.');
    sessionStorage.setItem('carni_token', nuevoToken);
    setCargando(true); setToken(nuevoToken);
    return data;
  }
  async function logout() {
    try { await api.post(endpoints.logout); }
    finally { sessionStorage.removeItem('carni_token'); setToken(null); setUsuario(null); setCargando(false); }
  }
  return <AuthContext.Provider value={{token, usuario, cargando, login, logout, cargarPerfil}}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
