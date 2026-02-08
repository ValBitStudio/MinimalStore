import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => (
  <div className="max-w-2xl mx-auto py-20 px-4">
    <Helmet key="about" defer={false}>
      <title key="title-about">Sobre Nosotros | MinimalStore</title>
      <meta name="description" content="Conoce la historia detrás de MinimalStore y nuestra misión de ofrecer esenciales modernos." />
    </Helmet>
    <h1 className="text-4xl font-light mb-8 text-center">Sobre Nosotros</h1>
    <div className="prose prose-lg mx-auto text-gray-600 space-y-6 text-center">
      <p>
        MinimalStore nació de la idea de que el estilo no necesita ser complicado. 
        Creemos en la calidad sobre la cantidad y en diseños atemporales que perduran más allá de las temporadas.
      </p>
      <p>
        Nuestra misión es ofrecer esenciales modernos para el día a día, fabricados 
        con atención al detalle y un compromiso inquebrantable con la simplicidad.
      </p>
    </div>
  </div>
);

export default AboutPage;