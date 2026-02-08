import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCartStore, selectTotalPrice } from '../store/cartStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  phone: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const clearCart = useCartStore((state) => state.clearCart);
  const cart = useCartStore((state) => state.cart);
  const totalPrice = useCartStore(selectTotalPrice);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  
  // Estado del formulario y validación
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'El correo es obligatorio';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Correo inválido';
        return '';
      case 'firstName': return !value ? 'El nombre es obligatorio' : '';
      case 'lastName': return !value ? 'Los apellidos son obligatorios' : '';
      case 'address': return !value ? 'La dirección es obligatoria' : '';
      case 'city': return !value ? 'La ciudad es obligatoria' : '';
      case 'postalCode': return !value ? 'El código postal es obligatorio' : '';
      case 'phone':
        if (!value) return 'El teléfono es obligatorio';
        if (!/^\d{7,15}$/.test(value.replace(/[\s()-]/g, ''))) return 'Teléfono inválido';
        return '';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name as keyof CheckoutForm]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }

    // Autocompletado de dirección por Código Postal (API: Zippopotam.us)
    if (name === 'postalCode' && value.length === 5) {
      setIsFetchingAddress(true);
      // Usamos 'mx' por defecto dado el contexto del sitio (Ciudad de México en ContactPage)
      fetch(`${import.meta.env.VITE_ZIP_API_URL}/mx/${encodeURIComponent(value)}`)
        .then(res => {
          if (!res.ok) throw new Error('CP no encontrado');
          return res.json();
        })
        .then(data => {
          if (data.places && data.places.length > 0) {
            const place = data.places[0];
            // Actualizamos la ciudad y limpiamos errores relacionados
            setFormData(prev => ({
              ...prev,
              city: place['place name'] // En MX suele ser la Colonia/Municipio
            }));
            setErrors(prev => ({ ...prev, city: '' }));
          }
        })
        .catch(err => console.error("Error al buscar CP:", err))
        .finally(() => setIsFetchingAddress(false));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors: Partial<CheckoutForm> = {};
    let isValid = true;
    (Object.keys(formData) as Array<keyof CheckoutForm>).forEach(key => {
      if (key === 'apartment') return;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      email: true, firstName: true, lastName: true, address: true, 
      apartment: true, city: true, postalCode: true, phone: true
    });

    if (!isValid) return;

    setIsProcessing(true);

    // Simular proceso de pago (2 segundos)
    setTimeout(() => {
      clearCart(); // Limpiar el carrito
      setIsProcessing(false);
      navigate('/thank-you'); // Redirigir a la página de gracias
    }, 2000);
  };

  const getInputClass = (name: keyof CheckoutForm) => {
    const hasError = touched[name] && errors[name];
    return `w-full bg-gray-50 border rounded-lg px-4 py-3 focus:outline-none focus:ring-1 transition-all ${
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50' 
        : 'border-gray-200 focus:border-black focus:ring-black'
    }`;
  };

  if (totalPrice === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-serif font-medium mb-4">Tu bolsa está vacía</h1>
        <p className="text-gray-500 mb-8">Parece que aún no has añadido nada al carrito.</p>
        <button onClick={() => navigate('/products')} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Helmet key="checkout" defer={false}>
        <title key="title-checkout">Finalizar Compra | MinimalStore</title>
        <meta name="description" content="Completa tu compra de forma segura en MinimalStore." />
      </Helmet>
      
      {/* Estilos de impresión directos para asegurar prioridad */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Clase para elementos solo visibles en impresión */
        .print-only { display: none; }

        @media print {
          @page { size: auto; margin: 10mm; }
          
          /* 1. BLOQUEO TOTAL: Cortar el documento al tamaño de una pantalla */
          html, body {
            height: 100vh !important;
            overflow: hidden !important;
          }

          /* 2. Ocultar visualmente todo */
          body * {
            visibility: hidden;
          }
          
          /* 3. Eliminar del flujo elementos de layout */
          .no-print, nav, header, footer, .min-h-screen > div > div > div:first-child {
            display: none !important;
          }

          /* 4. Hacer visible SOLO el área de impresión */
          #printable-area, #printable-area * {
            visibility: visible;
          }

          /* 5. Posicionar FIJO para ignorar el resto del documento */
          #printable-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 20px !important;
            background: white !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 99999;
          }

          /* 6. Ajustes de contenido interno */
          .max-h-80 {
            max-height: none !important;
            overflow: visible !important;
          }
          .print-only {
            display: block !important;
          }
          .product-image {
            display: none !important;
          }
        }
      `}} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar Steps */}
        <div className="max-w-2xl mx-auto mb-16 no-print">
          <div className="relative flex justify-between items-center w-full">
            {/* Background Line */}
            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-200 -z-10" />
            
            {/* Active Line (50% progress) */}
            <div className="absolute top-5 left-0 w-1/2 h-[2px] bg-black -z-10 transition-all duration-500" />

            {/* Step 1: Carrito */}
            <div className="flex flex-col items-center gap-2">
              <Link to="/products" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center ring-4 ring-gray-50 transition-transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
              </Link>
              <span className="text-xs font-medium text-gray-900 uppercase tracking-wider">Carrito</span>
            </div>

            {/* Step 2: Pago */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center ring-4 ring-gray-50 shadow-lg scale-110">
                <span className="text-sm font-bold">2</span>
              </div>
              <span className="text-xs font-bold text-black uppercase tracking-wider">Pago</span>
            </div>

            {/* Step 3: Confirmación */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center ring-4 ring-gray-50">
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Confirmación</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-8 no-print">
            {/* Contact Info */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif font-bold mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} placeholder="Correo electrónico" className={getInputClass('email')} />
                  {touched.email && errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="newsletter" className="rounded border-gray-300 text-black focus:ring-black" />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">Enviarme novedades y ofertas por correo electrónico</label>
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif font-bold mb-6">Dirección de Envío</h2>
              <form id="checkout-form" onSubmit={handlePayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} placeholder="Nombre" className={getInputClass('firstName')} />
                    {touched.firstName && errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} placeholder="Apellidos" className={getInputClass('lastName')} />
                    {touched.lastName && errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} onBlur={handleBlur} placeholder="Dirección" className={getInputClass('address')} />
                  {touched.address && errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>}
                </div>
                <div>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} onBlur={handleBlur} placeholder="Apartamento, local, etc. (opcional)" className={getInputClass('apartment')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} placeholder="Ciudad" className={getInputClass('city')} />
                    {touched.city && errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                  </div>
                  <div>
                    <div className="relative">
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} onBlur={handleBlur} placeholder="Código Postal" className={getInputClass('postalCode')} />
                      {isFetchingAddress && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                    </div>
                    {touched.postalCode && errors.postalCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.postalCode}</p>}
                  </div>
                </div>
                <div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} placeholder="Teléfono" className={getInputClass('phone')} />
                  {touched.phone && errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>
              </form>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-serif font-bold mb-6">Método de Pago</h2>
              
              <div className="flex gap-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                  Tarjeta
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 py-3 px-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'border-[#0070ba] bg-[#0070ba] text-white' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <span className="font-bold italic">PayPal</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <input type="text" placeholder="Número de tarjeta" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 pl-12 focus:outline-none focus:border-black transition-all" />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="MM / AA" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-all" />
                    <input type="text" placeholder="CVC" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-all" />
                  </div>
                  <input type="text" placeholder="Nombre en la tarjeta" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-black transition-all" />
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="text-center p-8 bg-gray-50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-sm text-gray-600 mb-4">Serás redirigido a PayPal para completar tu compra de forma segura.</p>
                  <button type="button" className="bg-[#FFC439] text-black font-bold px-8 py-2 rounded-full hover:brightness-95 transition-all">Pagar con PayPal</button>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div id="printable-area" className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {/* Logo para impresión */}
                <div className="print-only mb-8 text-center border-b border-gray-200 pb-4">
                  <h1 className="text-3xl font-serif font-bold">MinimalStore</h1>
                  <p className="text-sm text-gray-500 mt-1">Resumen de Pedido</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif font-bold">Resumen del Pedido</h2>
                  <button onClick={() => window.print()} className="text-gray-400 hover:text-black transition-colors p-2 rounded-full hover:bg-gray-50 no-print" title="Imprimir resumen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                  </button>
                </div>
                
                {/* Cart Items List */}
                <div className="max-h-80 overflow-y-auto mb-6 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex gap-4">
                      <div className="relative w-16 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200 product-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                        )}
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="text-xs text-gray-500">
                          {item.size && `Talla: ${item.size}`}
                          {item.size && item.color && ' | '}
                          {item.color && `Color: ${item.color}`}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-100 mt-4 pt-4 mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-serif font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
                </div>

                <button 
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center shadow-lg hover:shadow-xl transform active:scale-[0.99] no-print"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" color="white" />
                      <span>Procesando...</span>
                    </div>
                  ) : (
                    'Pagar Ahora'
                  )}
                </button>
                
                <div className="mt-4 flex justify-center gap-4 text-gray-300">
                   {/* Mock Payment Icons */}
                   <div className="w-8 h-5 bg-gray-200 rounded"></div>
                   <div className="w-8 h-5 bg-gray-200 rounded"></div>
                   <div className="w-8 h-5 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;