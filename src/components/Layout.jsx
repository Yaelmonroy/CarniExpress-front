import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Beef, UserRound, LogOut, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
 const {usuario, logout} = useAuth(); const nav = useNavigate();
 async function salir(){ try { await logout(); } catch { /* token local eliminado de todas formas */ } nav('/login', {replace:true}); }
 return <div className="app"><header className="topbar"><Link className="brand" to="/"><span className="brand-icon"><Beef size={22}/></span><span>Carni<span>Express</span></span></Link><nav className="topnav"><NavLink to="/" end><LayoutDashboard size={17}/> Inicio</NavLink><NavLink to="/catalogo"><ShoppingCart size={17}/> Catálogo</NavLink><NavLink to="/carrito"><ShoppingCart size={17}/> Carrito</NavLink><NavLink to="/perfil"><UserRound size={17}/> Mi perfil</NavLink></nav><div className="topright"><span className="user-pill">{usuario?.nombre || 'Cliente'}</span><button className="ghost" onClick={salir}><LogOut size={17}/> Salir</button></div></header><main className="main"><Outlet/></main><footer>CarniExpress · Plataforma de clientes</footer></div>;
}
