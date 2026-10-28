import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7297/api', timeout: 15000 });
api.interceptors.request.use(config => {
  const token = sessionStorage.getItem('carni_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export const endpoints = {
  registro: '/registro',
  login: '/auth/login',
  logout: '/sesion/cerrar',
  perfil: '/perfil',
  catalogo: '/catalogo',
  carrito: '/carrito',
  agregar: '/carrito/productos',
  desglose: '/carrito/desglose',
  aumentar: id => `/carrito/productos/${id}/aumentar`,
  disminuir: id => `/carrito/productos/${id}/disminuir`,
  eliminar: id => `/carrito/productos/${id}?confirmar=true`,
};
export function apiError(error) {
  const data = error?.response?.data;
  if (typeof data === 'string') return data;
  return data?.mensaje || data?.message || (data?.errors ? Object.values(data.errors).flat().join(' ') : null) || 'No se pudo completar la solicitud. Verifica que la API esté ejecutándose.';
}
