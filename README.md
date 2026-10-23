# Valentina Songia: website

Next.js 16, static export, Tailwind 4. Content lives in `content/` (JSON) and is edited by the
client through Pages CMS (`.pages.yml`). Netlify builds from GitHub on every push.

- `npm run dev` local preview
- `npm run build` → `out/` + `sitemap.xml` + the example-content gate
- Example content: strings starting with `[EXAMPLE]` are placeholders. They render with a yellow
  tag on previews; a live build fails while any remain (`scripts/example-gate.mjs`).
- Live switch: `content/site.json` → `liveOrigin` must equal the Netlify production URL,
  otherwise every page is noindex and robots.txt disallows all (`src/lib/site.ts`).
- Forms: Netlify Forms, declared in `public/__forms.html`; field names match `InquiryForm.tsx`.
