import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

// Datos simulados de pedidos
const MOCK_ORDERS = [
  {
    id: 'ORD-7782-XJ',
    date: '12 Mar 2024',
    status: 'Entregado',
    total: 125.00,
    items: [
      { name: 'Camiseta Básica White', quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80' },
      { name: 'Pantalón Chino Beige', quantity: 1, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=200&q=80' }
    ]
  },
  {
    id: 'ORD-9921-MC',
    date: '28 Feb 2024',
    status: 'En camino',
    total: 45.00,
    items: [
      { name: 'Gorra Minimal', quantity: 1, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=200&q=80' },
      { name: 'Calcetines Pack', quantity: 1, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=200&q=80' }
    ]
  }
];

const AccountPage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login); // Usamos login para actualizar datos
  const user = useAuthStore((state) => state.user);
  const addToast = useToastStore((state) => state.addToast);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Cargar datos del usuario en el formulario
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      // Actualizamos el usuario en el store
      login({ ...user, name: formData.name, email: formData.email });
      setIsEditing(false);
      addToast('Perfil actualizado correctamente', 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Mi Cuenta | MinimalStore</title>
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Info Usuario */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-serif text-gray-600">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            
            {/* 2. Formulario de Edición o Vista de Datos */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="mb-6 space-y-3">
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full text-center text-sm border-b border-gray-300 focus:border-black outline-none py-1 bg-transparent"
                  placeholder="Nombre"
                  required
                />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full text-center text-sm border-b border-gray-300 focus:border-black outline-none py-1 bg-transparent"
                  placeholder="Email"
                  required
                />
                <div className="flex justify-center gap-2 pt-2">
                  <button type="button" onClick={() => setIsEditing(false)} className="text-xs text-gray-500 hover:text-black px-2 py-1">Cancelar</button>
                  <button type="submit" className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800">Guardar</button>
                </div>
              </form>
            ) : (
              <div className="mb-6">
                <h2 className="font-bold text-lg">{user?.name || 'Usuario'}</h2>
                <p className="text-gray-500 text-sm mb-2">{user?.email || 'usuario@email.com'}</p>
                <button onClick={() => setIsEditing(true)} className="text-xs text-gray-400 hover:text-black underline">
                  Editar perfil
                </button>
              </div>
            )}

            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors border-t border-gray-100 w-full pt-4">
              Cerrar Sesión
            </button>
          </div>
          
          <nav className="space-y-1">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-black text-white font-medium text-sm shadow-sm">
              Mis Pedidos
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
              Direcciones
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors">
              Detalles de la Cuenta
            </button>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-serif font-bold mb-6">Historial de Pedidos</h1>
          
          <div className="space-y-6">
            {MOCK_ORDERS.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="block text-gray-500 text-xs uppercase tracking-wider">Pedido</span>
                      <span className="font-medium font-mono">{order.id}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase tracking-wider">Fecha</span>
                      <span className="font-medium">{order.date}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs uppercase tracking-wider">Total</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'Entregado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex -space-x-4 overflow-hidden py-2 pl-2">
                      {order.items.map((item, i) => (
                        <img 
                          key={i}
                          src={item.image} 
                          alt={item.name}
                          className="inline-block h-12 w-12 rounded-full ring-2 ring-white object-cover bg-gray-100"
                          title={`${item.quantity}x ${item.name}`}
                        />
                      ))}
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Link 
                        to={`/products`} 
                        className="flex-1 sm:flex-none text-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Ver Recibo
                      </Link>
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Volver a Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;