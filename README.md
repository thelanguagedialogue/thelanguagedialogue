# The Language Dialogue: website

Valentina Songia's site. Next.js 16, static export, plain CSS. The look is the approved concept
"D v3" (`~/tasks/valentina/concepts/site/d3/index.html`): `src/app/globals.css` is that concept's
stylesheet ported as is, with the inner-page blocks added below it in the same tokens.

- `npm run dev`: local preview
- `npm run build`: photo sizes (`scripts/images.mjs`) → `next build` → `out/` + `sitemap.xml`
  (`scripts/sitemap.mjs`) → the content gate (`scripts/example-gate.mjs`)
- `npm run gate`: just the count of what is still not final

## Content (edited by the client in Pages CMS, `.pages.yml`)

| File | What |
|---|---|
| `content/site.json` | name, contact details, calendar/WhatsApp/video links, menu, button texts, and the blocks that repeat (formats, levels, ages, numbers, reviews, contact band, prices switch) |
| `content/home.json` | the homepage, section by section |
| `content/contact.json` | the contact page text |
| `content/pages/<url>.json` | every other page, served at `/<url>/` by one template (`src/app/[slug]/page.tsx`) |

Text marks: `*words*` = olive italic accent, `[words](/page/)` = link, blank line = paragraph,
a line break in a headline = a break on wide screens only.

**New page** (a service, a workshop, a trip): add a file to `content/pages/` (in the editor: Pages >
Add entry). The file name is the address. Every block is optional and appears in a fixed order:
cover (with photo) or dark band (without), statement, "who it is for" cards, text sections (photo
left/right alternating; two photos = the About collage), formats, dark method band, levels, numbers,
reviews, FAQ, links to the other lesson pages, contact band. Add it to the menu in Site settings.

## Not final yet: the gate

| Marker | Meaning |
|---|---|
| `[EXAMPLE] ...` | text we wrote as a stand-in (reviews, group size, kids' age, calendar link, video) |
| `[CONFIRM] ...` | her real detail, not yet approved for the public site (phone, email, WhatsApp) |
| `/media/placeholder/...` | a stand-in photo |

On a preview these render with a small "example" / "to confirm" / "placeholder photo" tag.
A live build stops while any is left.

## Live switch

`content/site.json` → `liveOrigin` must equal the production URL (e.g.
`https://thelanguagedialogue.com`) and the build must be Netlify's production context. Until both
are true, every page is noindex, robots.txt disallows everything and the sitemap is empty
(`src/lib/site.ts`). There is no "remove noindex at launch" step to forget.

## Links

`src/lib/links.ts`: "Book a free call" opens `links.booking` (Calendly / Google Calendar); while it
is empty the button opens `/contact/`. WhatsApp and "Hear me speak" appear only once their link
is set. Placeholder links show a short preview note instead of navigating.

## Forms

Netlify Forms. The form is declared in `public/__forms.html` (field names must match
`src/components/InquiryForm.tsx`) and submissions are posted to that file's path. Netlify registers
the form on a production deploy; set the notification email under Forms > Notifications.

## Photos

Upload anything under `public/media/` (the editor does this). Before each build
`scripts/images.mjs` writes WebP copies at 480 to 2400px into `public/_img/` and a manifest that
`src/components/Img.tsx` turns into `srcset`, `width` and `height`. Cover photos: landscape, subject
in the middle or right, they sit on the right of the headline on wide screens.

## Deploy

Netlify builds from GitHub on every push (and every save in Pages CMS): `npm run build`, publish
`out`. Manual preview deploy from a laptop: build, then
`netlify deploy --no-build --dir out --site <site id> --alias <name>`. Never `--dir .`.
