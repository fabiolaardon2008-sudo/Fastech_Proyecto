import React, { useState, useEffect } from 'react';

export default function App() {
  // =========================================================
  // 1. ESTADOS DE LA APLICACIÓN (HOOKS)
  // =========================================================
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]); 
  
  // Formulario para registrar nuevos productos
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Estados de inicio de sesión y pestañas
  const [usuario, setUsuario] = useState('');         
  const [password, setPassword] = useState('');       
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [pestanaActiva, setPestanaActiva] = useState('inventario'); 

  // Estados independientes para el botón del "ojo" (ver/ocultar)
  const [verUsuario, setVerUsuario] = useState(false);
  const [verPassword, setVerPassword] = useState(false);

  // =========================================================
  // 2. CONEXIÓN AL BACKEND (MYSQL) + RESPALDO CON TUS IMÁGENES
  // =========================================================
  useEffect(() => {
    fetch('http://localhost:5000/productos')
      .then(res => {
        if (!res.ok) throw new Error("Error en servidor");
        return res.json();
      })
      .then(data => setProductos(data))
      .catch(err => {
        console.log("⚠️ Servidor MySQL desconectado. Cargando tu lista de artículos física.");
        // Lista de respaldo idéntica a tus archivos en la carpeta 'logo'
        setProductos([
          { id: 1, nombre: 'Laptop Pro', precio: 1200.00, stock: 10 },
          { id: 2, nombre: 'Playstation', precio: 450.00, stock: 5 },
          { id: 3, nombre: 'Microondas', precio: 80.00, stock: 9 },
          { id: 4, nombre: 'Aire acondicionado', precio: 350.00, stock: 4 },
          { id: 5, nombre: 'Audifonos inalambricos', precio: 45.00, stock: 15 },
          { id: 6, nombre: 'Bocinas Genius', precio: 25.00, stock: 8 },
          { id: 7, nombre: 'Bocinas Choice', precio: 30.00, stock: 12 },
          { id: 8, nombre: 'Cafetera', precio: 55.00, stock: 6 },
          { id: 9, nombre: 'Cámara', precio: 180.00, stock: 3 },
          { id: 10, nombre: 'Iphone', precio: 999.00, stock: 7 },
          { id: 11, nombre: 'Lavadora', precio: 400.00, stock: 5 },
          { id: 12, nombre: 'Licuadora', precio: 60.00, stock: 6 }
        ]);
      });
  }, []);

  // =========================================================
  // 3. FUNCIONES DE LOGICA (LOGIN, AGREGAR Y VENDER)
  // =========================================================
  const manejarLogin = (e) => {
    e.preventDefault();
    if (usuario.trim() === 'fabiola' && password === '2008') {
      setIsLoggedIn(true);
    } else {
      alert('❌ Usuario o contraseña incorrectos.');
    }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    const nuevo = { 
      nombre: nombre.trim(), 
      precio: precio ? parseFloat(precio) : null, 
      stock: parseInt(stock) 
    };
    
    try {
      const res = await fetch('http://localhost:5000/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo)
      });
      const productoGuardado = await res.json();
      setProductos([productoGuardado, ...productos]);
    } catch (error) {
      setProductos([{ id: Date.now(), ...nuevo }, ...productos]);
    }
    setNombre(''); setPrecio(''); setStock('');
  };

  const registrarVenta = (producto) => {
    if (producto.stock <= 0) return alert('⚠️ ¡Sin stock disponible!');

    const nuevaVenta = {
      id: Date.now(),
      producto: producto.nombre,
      total: producto.precio || 0,
      fecha: new Date().toLocaleTimeString()
    };

    setVentas([nuevaVenta, ...ventas]);
    setProductos(productos.map(p => p.id === producto.id ? { ...p, stock: p.stock - 1 } : p));
  };

  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalRecaudado = ventas.reduce((sum, v) => sum + Number(v.total), 0);

  // =========================================================
  // 4. ESTILOS DE LA INTERFAZ (PALETA MORADO + LILA CORPORATIVO)
  // =========================================================
  const styles = {
    fondo: { 
      background: 'linear-gradient(135deg, #0a0714 0%, #120c24 60%, #191333 100%)', 
      minHeight: '100vh', 
      padding: '30px', 
      fontFamily: "'Inter', sans-serif", 
      color: '#fff',
      display: !isLoggedIn ? 'flex' : 'block',
      justifyContent: 'center',
      alignItems: 'center'
    },
    loginCard: { 
      background: '#ffffff', 
      color: '#1e1930', 
      padding: '40px', 
      borderRadius: '24px', 
      width: '100%',
      maxWidth: '390px', 
      margin: '0 auto', 
      boxShadow: '0 0 35px rgba(139, 92, 246, 0.5), 0 10px 20px rgba(0,0,0,0.3)', 
      border: '1px solid rgba(139, 92, 246, 0.2)',
      textAlign: 'center' 
    },
    container: { maxWidth: '1100px', margin: 'auto' },
    cardForm: { 
      background: 'rgba(255, 255, 255, 0.05)', 
      backdropFilter: 'blur(12px)', 
      padding: '25px', 
      borderRadius: '16px', 
      display: 'flex', 
      gap: '15px', 
      flexWrap: 'wrap', 
      marginBottom: '30px',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)'
    },
    wrapperInput: { position: 'relative', width: '100%', display: 'flex', alignItems: 'center' },
    inputLogin: { 
      width: '100%', padding: '14px 45px 14px 16px', borderRadius: '10px', 
      border: '2px solid #e2d9f3', fontSize: '15px', color: '#1f1a3a', 
      background: '#fcfaff', outline: 'none', boxSizing: 'border-box'
    },
    inputPanel: { flex: '1', padding: '12px 16px', borderRadius: '10px', border: '1px solid #4a3e72', fontSize: '15px', color: '#fff', background: '#16112e', outline: 'none' },
    btnOjo: { position: 'absolute', right: '14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#8b5cf6', display: 'flex', alignItems: 'center' },
    button: { 
      background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)', color: 'white', 
      padding: '14px 28px', border: 'none', borderRadius: '10px', fontWeight: 'bold', 
      cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)'
    },
    navBar: { display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '2px solid #2b224d', paddingBottom: '10px' },
    navBtn: (activo) => ({ 
      background: activo ? 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)' : 'transparent', 
      border: activo ? 'none' : '1px solid #8b5cf6', color: '#fff', padding: '10px 20px', 
      borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', boxShadow: activo ? '0 0 15px rgba(139, 92, 246, 0.5)' : 'none'
    }),
    gridProductos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
    cardProducto: { background: '#16112e', borderRadius: '16px', padding: '18px', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid #2b224d' },
    contenedorImagen: { width: '100%', height: '130px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '12px', background: '#ffffff', borderRadius: '12px', overflow: 'hidden', padding: '5px', boxSizing: 'border-box' },
    productoImg: { width: '100%', height: '100%', objectFit: 'contain' },
    tablaVentas: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', background: '#16112e', borderRadius: '12px', overflow: 'hidden', border: '1px solid #2b224d' },
    th: { background: '#211a44', padding: '14px', textAlign: 'left', fontWeight: 'bold', color: '#c084fc' },
    td: { padding: '14px', borderBottom: '1px solid #2b224d', color: '#fff' }
  };

  return (
    <div style={styles.fondo}>
      
      {/* ------------------ INTERFAZ 1: LOGIN ------------------ */}
      {!isLoggedIn ? (
        <div style={styles.loginCard}>
          <img src="/logo/mi_logo.png" alt="Logo Fast Tech" style={{ width: '160px', marginBottom: '10px' }} />
          <h2 style={{ color: '#1f1a3a', fontSize: '24px', fontWeight: '700', marginBottom: '25px' }}>Iniciar Sesión</h2>
          
          <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={styles.wrapperInput}>
              <input style={styles.inputLogin} type={verUsuario ? "text" : "password"} placeholder="Usuario (fabiola)" value={usuario} onChange={e => setUsuario(e.target.value)} required />
              <button type="button" style={styles.btnOjo} onClick={() => setVerUsuario(!verUsuario)}>{verUsuario ? "👁️" : "🙈"}</button>
            </div>

            <div style={styles.wrapperInput}>
              <input style={styles.inputLogin} type={verPassword ? "text" : "password"} placeholder="Contraseña (2008)" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" style={styles.btnOjo} onClick={() => setVerPassword(!verPassword)}>{verPassword ? "👁️" : "🙈"}</button>
            </div>
            <button type="submit" style={styles.button}>INGRESAR</button>
          </form>
        </div>
      ) : (
        
        /* ------------------ INTERFAZ 2: PANEL DE CONTROL ------------------ */
        <div style={styles.container}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ background: '#fff', padding: '5px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/logo/mi_logo.png" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: '700' }}>Panel Fast Tech</h2>
            </div>
            <button style={{ ...styles.button, background: '#251c42', boxShadow: 'none', border: '1px solid #8b5cf6' }} onClick={() => setIsLoggedIn(false)}>Salir</button>
          </div>

          <div style={styles.navBar}>
            <button style={styles.navBtn(pestanaActiva === 'inventario')} onClick={() => setPestanaActiva('inventario')}>📦 Inventario Real ({productos.length})</button>
            <button style={styles.navBtn(pestanaActiva === 'ventas')} onClick={() => setPestanaActiva('ventas')}>📈 Ventas Realizadas ({ventas.length})</button>
          </div>

          {/* VISTA: INVENTARIO */}
          {pestanaActiva === 'inventario' && (
            <div>
              <form onSubmit={agregarProducto} style={styles.cardForm}>
                <input style={styles.inputPanel} placeholder="Nombre del artículo" value={nombre} onChange={e => setNombre(e.target.value)} required />
                <input style={styles.inputPanel} placeholder="Precio $" type="number" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} required />
                <input style={styles.inputPanel} placeholder="Stock inicial" type="number" value={stock} onChange={e => setStock(e.target.value)} required />
                <button type="submit" style={styles.button}>Registrar</button>
              </form>

              <input 
                style={{ ...styles.inputPanel, width: '100%', padding: '15px', marginBottom: '25px', borderRadius: '12px', border: '1px solid #8b5cf6' }} 
                placeholder="🔍 Buscar artículo en almacén..." value={busqueda} onChange={e => setBusqueda(e.target.value)} 
              />

              <div style={styles.gridProductos}>
                {productosFiltrados.map(p => {
                  // LÓGICA INTELIGENTE: Limpia el nombre para que coincida exactamente con tu lista de imágenes de VS Code
                  const nombreFormateado = p.nombre.trim(); 
                  const rutaImagen = `/logo/${nombreFormateado}.png`;

                  return (
                    <div key={p.id} style={styles.cardProducto}>
                      <div style={styles.contenedorImagen}>
                        <img 
                          src={rutaImagen} 
                          alt={p.nombre} 
                          style={styles.productoImg}
                          onError={(e) => { 
                            // Si por algún motivo no coincide el nombre en MySQL con el archivo, muestra la caja lila por defecto
                            e.target.src = "https://placehold.co/150x100/f3e8ff/8b5cf6?text=📦"; 
                          }} 
                        />
                      </div>
                      <h3 style={{ margin: '5px 0', fontSize: '17px', fontWeight: '600' }}>{p.nombre}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#a78bfa' }}>${Number(p.precio).toFixed(2)}</span>
                        <span style={{ background: '#251b4f', color: '#c084fc', padding: '3px 9px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{p.stock} ud</span>
                      </div>
                      <button style={{ ...styles.button, marginTop: '15px', width: '100%', padding: '10px' }} onClick={() => registrarVenta(p)}>🛒 Vender Unidad</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VISTA: VENTAS */}
          {pestanaActiva === 'ventas' && (
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '25px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>📋 Historial de la Sesión</h3>
                <h4 style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold' }}>Total: ${totalRecaudado.toFixed(2)}</h4>
              </div>
              {ventas.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#a78bfa', padding: '30px' }}>⚠️ No hay operaciones registradas en esta ventana de tiempo.</p>
              ) : (
                <table style={styles.tablaVentas}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Ticket</th>
                      <th style={styles.th}>Descripción Producto</th>
                      <th style={styles.th}>Monto de Venta</th>
                      <th style={styles.th}>Hora de Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((v, index) => (
                      <tr key={v.id}>
                        <td style={styles.td}># {ventas.length - index}</td>
                        <td style={styles.td} style={{ fontWeight: 'bold', color: '#e9d5ff' }}>{v.producto}</td>
                        <td style={styles.td} style={{ color: '#c084fc', fontWeight: 'bold' }}>${Number(v.total).toFixed(2)}</td>
                        <td style={styles.td}>🕒 {v.fecha}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}