# Quantalink

The source for [Akshay Abraham's website](https://akshayabraham.vercel.app), built with Next.js, React, and TypeScript. It brings together projects, skills, and the stories behind them.

This is one repository and one Next.js app. The canonical homepage at `/` keeps the original Quantalink HTML and metadata for mobile visitors and search engines. At desktop widths, it opens the Tahoe desktop in an isolated frame. Tahoe's Safari displays the site's canonical address while loading the classic homepage from `/site` internally. The `/site` and `/os` routes are excluded from the sitemap and marked `noindex`.

The Tahoe desktop is based on the MIT-licensed `portfolio-os`; its notice is in [`LICENSES/portfolio-os-MIT.txt`](LICENSES/portfolio-os-MIT.txt). The original Quantalink site remains under this repository's GPL v3 license.

The Tahoe wallpaper changes at 05:00, 09:00, 17:00, and 20:00 in the visitor's local time. Its automatic appearance follows the selected wallpaper. The classic site is unaffected.

## Run locally

```bash
npm install
npm run dev
```

Open [localhost:9002](http://localhost:9002). Use `npm run check` and `npm run build` to check changes.

Licensed under [GPL v3](LICENSE).
