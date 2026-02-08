export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  author: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "El Arte del Armario Cápsula",
    excerpt: "Descubre cómo simplificar tu vida y mejorar tu estilo con menos prendas pero de mejor calidad. Una guía para principiantes.",
    content: "El armario cápsula no es solo una tendencia, es un estilo de vida. Consiste en tener un número limitado de prendas que combinan entre sí... (Aquí iría el contenido completo del artículo).",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=1000&auto=format&fit=crop",
    date: "15 Mar 2024",
    category: "Estilo de Vida",
    author: "Sofía M."
  },
  {
    id: 2,
    title: "Cuidado de Prendas: Algodón Orgánico",
    excerpt: "Aprende los mejores trucos para lavar y mantener tus prendas de algodón orgánico como nuevas por más tiempo.",
    content: "El algodón orgánico requiere un cuidado especial para mantener su suavidad y durabilidad. Recomendamos lavar siempre con agua fría... (Contenido del artículo).",
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000&auto=format&fit=crop",
    date: "10 Mar 2024",
    category: "Guías",
    author: "Carlos R."
  },
  {
    id: 3,
    title: "Tendencias Minimalistas para 2024",
    excerpt: "Analizamos las tendencias que dominarán este año: colores neutros, cortes limpios y sostenibilidad.",
    content: "Este año volvemos a lo básico. Las pasarelas han hablado y el minimalismo sigue siendo el rey... (Contenido del artículo).",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
    date: "05 Mar 2024",
    category: "Tendencias",
    author: "Ana L."
  }
];