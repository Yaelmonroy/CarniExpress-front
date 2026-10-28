import {useCallback,useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ShoppingCart,ArrowLeft,Plus,Minus,Trash2,X,AlertTriangle} from 'lucide-react';
import {api,endpoints,apiError} from '../services/api';
import '../styles/cart-hu10-12.css';
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(n)||0);
export default function Carrito(){
 const [datos,setDatos]=useState(null),[stock,setStock]=useState({}),[error,setError]=useState(''),[mensaje,setMensaje]=useState(''),[busy,setBusy]=useState(false),[confirmar,setConfirmar]=useState(null);
 const cargar=useCallback(async()=>{
  try{const [res,cat]=await Promise.all([api.get(endpoints.desglose),api.get(endpoints.catalogo)]);
   setDatos(res.data);
   const catalogo=Array.isArray(cat.data)?cat.data:(cat.data.productos||[]);
   setStock(Object.fromEntries(catalogo.map(p=>[p.id,Number(p.existenciaKg)])));
   setError('');
  }catch(e){setError(apiError(e));}
 },[]);
 useEffect(()=>{cargar()},[cargar]);
 async function ejecutar(url,metodo){setBusy(true);setError('');setMensaje('');try{
  const r=await api({url,method:metodo});
  if(r.data?.carrito) setDatos(r.data.carrito);else await cargar();
  setMensaje(r.data?.mensaje||'Carrito actualizado');
  // Actualizar stock visible tras cada operación.
  try{const cat=await api.get(endpoints.catalogo);const lista=Array.isArray(cat.data)?cat.data:(cat.data.productos||[]);setStock(Object.fromEntries(lista.map(p=>[p.id,Number(p.existenciaKg)])));}catch{}
 }catch(e){setError(apiError(e));}finally{setBusy(false);setConfirmar(null);}}
 const productos=datos?.productos||[];
 return <div className="container cart-hu"><Link className="back" to="/catalogo"><ArrowLeft size={18}/> Volver al catálogo</Link>
 <div className="shop-head"><div><span className="eyebrow dark">HU-010 · HU-011 · HU-012</span><h1>Mi carrito</h1><p className="muted">Ajusta cantidades y revisa el desglose antes de comprar.</p></div><ShoppingCart size={35}/></div>
 {error&&<div className="alert" role="alert">{error}</div>}
 {mensaje&&<div className="cart-ok" role="status">{mensaje}</div>}
 {!datos&&!error?<p>Cargando carrito...</p>:datos&&productos.length===0?<div className="shop-empty"><ShoppingCart size={38}/><h3>Tu carrito está vacío</h3><p>Agrega productos desde el catálogo.</p><Link className="primary" to="/catalogo">Volver al catálogo</Link></div>:datos&&<div className="cart-list">
  {productos.map(p=><article className="cart-product" key={p.productoId}>
   <div className="cart-product-info"><h3>{p.nombre}</h3><p>{money(p.precioPorKg)} / kg</p><small>Subtotal: <strong>{money(p.subtotal)}</strong></small></div>
   <div className="cart-actions"><div className="cart-stepper" aria-label={`Cantidad de ${p.nombre}`}>
    <button disabled={busy} title="Disminuir 0.5 kg" aria-label={`Disminuir ${p.nombre}`} onClick={()=>ejecutar(endpoints.disminuir(p.productoId),'patch')}><Minus size={17}/></button>
    <span>{Number(p.cantidadKg).toFixed(1)} kg</span>
    <button disabled={busy||(stock[p.productoId]!==undefined&&Number(p.cantidadKg)+0.5>stock[p.productoId])} title="Aumentar 0.5 kg" aria-label={`Aumentar ${p.nombre}`} onClick={()=>ejecutar(endpoints.aumentar(p.productoId),'patch')}><Plus size={17}/></button>
   </div><button className="cart-remove" disabled={busy} onClick={()=>setConfirmar(p)}><Trash2 size={16}/> Eliminar</button>
   {stock[p.productoId]!==undefined&&Number(p.cantidadKg)+0.5>stock[p.productoId]&&<small className="cart-stock">No hay más existencia disponible</small>}</div>
  </article>)}
  <section className="cart-summary"><div><span>Productos diferentes</span><strong>{datos.totalProductos}</strong></div><div><span>Peso total</span><strong>{datos.totalKg} kg</strong></div><div className="cart-summary-total"><span>Total de la compra</span><strong>{money(datos.total)}</strong></div></section>
  <p className="muted cart-next">El siguiente paso (datos de entrega) corresponde a la HU-013. No se han añadido descuentos ni gastos de envío.</p>
 </div>}
 {confirmar&&<div className="modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget&&!busy)setConfirmar(null)}}><div className="product-modal cart-dialog" role="dialog" aria-modal="true" aria-labelledby="cart-confirm-title"><button className="modal-close" aria-label="Cerrar" disabled={busy} onClick={()=>setConfirmar(null)}><X size={18}/></button><AlertTriangle size={30} color="#812139"/><h2 id="cart-confirm-title">¿Eliminar producto?</h2><p>¿Deseas eliminar <strong>{confirmar.nombre}</strong> de tu carrito?</p><div className="cart-dialog-actions"><button disabled={busy} className="refresh" onClick={()=>setConfirmar(null)}>Cancelar</button><button disabled={busy} className="cart-confirm" onClick={()=>ejecutar(endpoints.eliminar(confirmar.productoId),'delete')}>{busy?'Eliminando...':'Sí, eliminar'}</button></div></div></div>}
 </div>
}
