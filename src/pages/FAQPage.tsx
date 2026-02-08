import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const faqs = [
  {
    question: "¿Cuáles son los tiempos de envío?",
    answer: "Nuestros envíos estándar tardan entre 3 y 5 días hábiles. Para envíos express, el tiempo es de 1 a 2 días hábiles. Recibirás un número de seguimiento en cuanto tu pedido sea despachado."
  },
  {
    question: "¿Cuál es la política de devoluciones?",
    answer: "Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté sin usar, con las etiquetas originales y en su empaque original. Los gastos de envío de la devolución corren por cuenta del cliente, salvo defecto de fábrica."
  },
  {
    question: "¿Hacen envíos internacionales?",
    answer: "Sí, realizamos envíos a la mayoría de los países. Los costos y tiempos varían según la ubicación y se calculan al momento de finalizar la compra."
  },
  {
    question: "¿Cómo puedo rastrear mi pedido?",
    answer: "Una vez enviado tu pedido, recibirás un correo electrónico con un número de seguimiento y un enlace directo para ver el estado de tu paquete en tiempo real."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos todas las tarjetas de crédito y débito principales (Visa, Mastercard, Amex), PayPal y transferencias bancarias directas."
  },
  {
    question: "¿Cómo cuido mis prendas?",
    answer: "Recomendamos lavar las prendas con agua fría y colores similares. Evita el uso de secadora para prolongar la vida útil de los tejidos y mantener el ajuste original."
  }
];

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-black' : 'text-gray-600 group-hover:text-black'}`}>
          {question}
        </span>
        <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-500 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQPage = () => {
  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <Helmet key="faq" defer={false}>
        <title>Preguntas Frecuentes | MinimalStore</title>
        <meta name="description" content="Respuestas a las dudas más comunes sobre envíos, devoluciones y productos." />
      </Helmet>
      <h1 className="text-4xl font-serif font-bold mb-4 text-center">Preguntas Frecuentes</h1>
      <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
        Aquí encontrarás respuestas a las dudas más comunes sobre nuestros productos y servicios.
      </p>
      
      <div className="space-y-1">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQPage;