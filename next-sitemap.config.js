/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://akshayabraham.vercel.app',
  exclude: ['/icon.svg'],
  generateRobotsTxt: true,
  transform: async (config, path) => {
    const imagesByPage = {
      '/': [
        '/akshay-abraham-aiboomi-portrait.webp',
        '/events/akshay-abraham-aiboomi-kochi.webp',
        '/events/akshay-abraham-hack4future-2025.webp',
        '/events/akshay-abraham-yc-startup-school-india.webp',
      ],
      '/about': [
        '/events/akshay-abraham-first-presentation.webp',
        '/events/akshay-abraham-hack4future-2025.webp',
        '/events/akshay-abraham-hackfinity-2025.webp',
        '/events/akshay-abraham-sameeksha-2026.webp',
        '/events/akshay-abraham-yc-startup-school-india.webp',
        '/events/akshay-abraham-hacktvm-access-point-2026.webp',
        '/events/akshay-abraham-aiboomi-kochi.webp',
      ],
    };

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      images: (imagesByPage[path] || []).map((imagePath) => ({
        loc: new URL(imagePath, config.siteUrl),
      })),
    };
  },
};
