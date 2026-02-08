import React from 'react';
import { Helmet } from 'react-helmet-async';

const ContactPage = () => (
  <div className="max-w-6xl mx-auto py-20 px-4">
    <Helmet key="contact" defer={false}>
      <title key="title-contact">Contacto | MinimalStore</title>
      <meta name="description" content="Contáctanos para cualquier duda sobre tu pedido, nuestros productos o envíos." />
    </Helmet>
    <h1 className="text-4xl font-light mb-4 text-center">Contacto</h1>
    <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
      Estamos aquí para ayudarte. Si tienes preguntas sobre tu pedido, nuestros productos o simplemente quieres saludar, no dudes en contactarnos.
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
      {/* Columna Izquierda: Formulario */}
      <div>
        <h2 className="text-2xl font-medium mb-6">Envíanos un mensaje</h2>
        <form className="space-y-6" onSubmit={(e: React.FormEvent) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" id="name" className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-black transition-colors" placeholder="Tu nombre" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-black transition-colors" placeholder="tu@email.com" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea id="message" rows={4} className="w-full border border-gray-200 rounded-md p-3 focus:outline-none focus:border-black transition-colors" placeholder="¿En qué podemos ayudarte?"></textarea>
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-colors font-medium">
            Enviar Mensaje
          </button>
        </form>
      </div>

      {/* Columna Derecha: Info + Mapa + Redes */}
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-medium mb-6">Información</h2>
          <div className="space-y-4 text-gray-600">
            <p className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span>Av. Reforma 123, Col. Centro<br />Ciudad de México, CDMX 06600</span>
            </p>
            <p className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <a href="mailto:hola@minimalstore.com" className="hover:text-black transition-colors">hola@minimalstore.com</a>
            </p>
          </div>
        </div>

        {/* Redes Sociales */}
        <div>
          <h3 className="text-lg font-medium mb-4">Síguenos</h3>
          <div className="flex gap-4">
            {['Instagram', 'Twitter', 'Facebook'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-black hover:text-white transition-all">
                <span className="sr-only">{social}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="h-64 bg-gray-200 rounded-lg overflow-hidden relative">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.539569466576!2d-99.16533268509334!3d19.43260768688428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8b32758939b%3A0x7306246645d62366!2sAv.%20Paseo%20de%20la%20Reforma%2C%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses!2smx!4v1678900000000!5m2!1ses!2smx" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             title="Mapa de ubicación"
           ></iframe>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;