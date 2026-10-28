import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function PrivateRoute(){const {token,cargando}=useAuth(); if(cargando)return <div className="loading">Cargando tu cuenta...</div>;return token?<Outlet/>:<Navigate to="/login" replace/>;}
