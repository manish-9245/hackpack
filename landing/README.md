# hackpack Landing Page

Beautiful showcase website for hackpack, built with **Next.js** and **Tailwind CSS**.

Ready to deploy to **Vercel** with one click.

## 📦 Features

- **Hero Section** — Eye-catching intro with CTA
- **Features Showcase** — Why hackpack is awesome
- **Quick Start Guide** — 4-step getting started
- **Complete Stack** — All 7 bases + 16 features
- **Example Projects** — Copy-paste ready commands
- **Responsive Design** — Mobile-friendly, dark theme
- **Zero Dependencies** — Just Next.js + Tailwind

## 🚀 Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 📤 Deploy to Vercel

### Option 1: Connect GitHub to Vercel (Recommended)

1. Go to https://vercel.com/new
2. Select "hackpack" repo
3. Vercel auto-detects Next.js
4. Click "Deploy"

### Option 2: Manual Deploy

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your site will be live at `hackpack.vercel.app` (or custom domain).

### Option 3: Direct Git Connection

1. Push to GitHub (already done ✓)
2. Go to https://vercel.com/new
3. Import from GitHub: `manish-9245/hackpack`
4. Set "Root Directory" to `./landing`
5. Click "Deploy"

## 🎨 Customization

Edit `pages/index.tsx` to customize:
- Hero copy
- Feature descriptions
- Example projects
- Colors (see `tailwind.config.ts`)
- Links (update GitHub URLs)

## 📝 Environment Variables

None required! This is a static site.

## 📊 Performance

- **Fast** — Next.js optimizations, static generation
- **Small** — Minimal JS bundle
- **SEO-Friendly** — Proper meta tags, open graph
- **Accessible** — Semantic HTML, ARIA labels

## 📂 Structure

```
landing/
├── pages/
│   ├── index.tsx          # Main page
│   ├── _app.tsx           # App wrapper
│   └── _document.tsx      # HTML document
├── globals.css            # Global styles (Tailwind)
├── tailwind.config.ts     # Tailwind config
├── next.config.ts         # Next.js config
├── package.json
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🔗 Links

All links in the landing page point to:
- GitHub: `https://github.com/manish-9245/hackpack`
- Docs: `https://github.com/manish-9245/hackpack/blob/main/docs/QUICKSTART.md`
- README: `https://github.com/manish-9245/hackpack/blob/main/README.md`

Update these in `pages/index.tsx` if your repo URL changes.

## 📸 Preview

The landing page showcases:
- hackpack logo & tagline
- Key stats (7 bases, 16 features, etc.)
- 6 feature cards (benefits)
- 4-step quick start with code blocks
- Frameworks & features lists
- 3 example project commands
- Call-to-action sections
- Footer with links

## ✨ Next Steps

1. Deploy to Vercel (see above)
2. Configure custom domain (optional)
3. Add Google Analytics (optional)
4. Customize with your branding

---

Built with Next.js. Hosted on Vercel. Owned by you. 🚀
