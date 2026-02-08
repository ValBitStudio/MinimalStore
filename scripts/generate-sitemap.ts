import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Importamos tus datos reales. Al usar 'tsx' o 'ts-node', podemos importar .ts directamente
import { PRODUCTS } from '../src/data/products';
import { BLOG_POSTS } from '../src/data/blogPosts';

// Configuración
// Usa una variable de entorno o un dominio por defecto para el sitemap
const DOMAIN = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://minimal-store-demo.vercel.app';

// Obtener rutas de directorios (__dirname no existe nativamente en módulos ES)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');

const generateSitemap = () => {
  console.log('🔄 Generando sitemap.xml...');

  // 1. Definir rutas estáticas (las que siempre existen)
  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/products', changefreq: 'daily', priority: 0.8 },
    { url: '/blog', changefreq: 'weekly', priority: 0.7 },
    { url: '/about', changefreq: 'monthly', priority: 0.5 },
    { url: '/contact', changefreq: 'yearly', priority: 0.5 },
    { url: '/faq', changefreq: 'monthly', priority: 0.5 },
  ];

  // 2. Generar rutas dinámicas de PRODUCTOS
  const productRoutes = PRODUCTS.map((product) => ({
    url: `/product/${product.id}`,
    changefreq: 'weekly',
    priority: 0.6,
  }));

  // 3. Generar rutas dinámicas de BLOG
  const blogRoutes = BLOG_POSTS.map((post) => ({
    url: `/blog/${post.id}`,
    changefreq: 'monthly',
    priority: 0.6,
  }));

  // 4. Combinar todo y crear el XML
  const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map((route) => `  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>`;

  // 5. Escribir el archivo en la carpeta public
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log(`✅ Sitemap generado con éxito: ${allRoutes.length} URLs añadidas.`);
};

generateSitemap();