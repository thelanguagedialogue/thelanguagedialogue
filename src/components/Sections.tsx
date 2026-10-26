import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { site, parse, type Hero as HeroT, type Item, type Faq as FaqT, type Chapter as ChapterT, type Band as BandT, type Link as LinkT } from "@/lib/content";
import { IS_LIVE } from "@/lib/site";
import { bookAct, whatsappAct, messageAct, videoAct, linkAct } from "@/lib/links";
import { T, Paras, Split, Words, Tag } from "./Text";
import { Img, ph, frameRatio } from "./Img";
import { KeyMark } from "./Logo";
import { Btn, Arr, WhatsAppIcon, PlayIcon, d } from "./Ui";

/* Every block of the D v3 concept, as a component. Class names and markup follow the concept
   file one to one, so globals.css (the concept's stylesheet) styles them unchanged. */

const n2 = (i: number) => String(i + 1).padStart(2, "0");

/** A hero bar value: line breaks kept, and the part after " · " never splits. */
function BarValue({ v }: { v: string }) {
  const lines = parse(v).text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const [a, b] = line.split(" · ");
        return (
          <span key={i}>
            {i > 0 && <br />}
            {b !== undefined ? <>{a} · <span className="nb">{b}</span></> : a}
          </span>
        );
      })}
    </>
  );
}

export function Crumbs({ title }: { title: string }) {
  return (
    <nav className="crumbs type" aria-label="Breadcrumb" data-reveal="">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
}

/** The cover: full-bleed photo, headline, two buttons and the four-cell bar. */
export function Hero({ hero, page = false, crumb }: { hero: HeroT; page?: boolean; crumb?: string }) {
  return (
    <section className={`hero${page ? " page" : ""}`} data-head-end="">
      <div className={`bg${ph(hero.image)}`}>
        <Img src={hero.image} alt={hero.imageAlt} sizes="(max-width: 600px) 180vw, 100vw" priority speed={0.18} />
        <i className="tint" aria-hidden="true" />
      </div>
      <div className="wrap hero-in">
        {crumb && <Crumbs title={crumb} />}
        <div className="issue type" data-reveal="">{hero.issue.map((s) => <span key={s}>{s}</span>)}</div>
        <Split v={hero.title} />
        <p className="lede" data-reveal="" style={d(700)}><T v={hero.lede} /></p>
        <div className="actions" data-reveal="" style={d(850)}>
          <Btn act={bookAct()} className="btn olive">{hero.primary} <Arr /></Btn>
          {hero.secondary?.label && <Btn act={linkAct(hero.secondary.href)} className="btn light">{hero.secondary.label}</Btn>}
        </div>
      </div>
      {hero.bar && hero.bar.length > 0 && (
        <div className="hero-bar">
          <div className="wrap">
            {hero.bar.map((c) => (
              <div className="cell" key={c.label}><span className="k">{c.label}</span><span className="v"><BarValue v={c.value} /></span></div>
            ))}
            <div className="cue type" aria-hidden="true"><i />Scroll</div>
          </div>
        </div>
      )}
    </section>
  );
}

/** A short night band for pages without a cover photo. */
export function PageHead({ hero, crumb, actions }: { hero: Pick<HeroT, "issue" | "title" | "lede"> & { primary?: string }; crumb?: string; actions?: ReactNode }) {
  return (
    <section className="pagehead" data-head-end="">
      <div className="wrap">
        <div className="text">
          {crumb && <Crumbs title={crumb} />}
          <div className="issue type" data-reveal="">{hero.issue.map((s) => <span key={s}>{s}</span>)}</div>
          <Split v={hero.title} />
          {hero.lede && <p className="lede" data-reveal="" style={d(500)}><T v={hero.lede} /></p>}
          {(actions || hero.primary) && (
            <div className="actions" data-reveal="" style={d(650)}>
              {actions ?? <Btn act={bookAct()} className="btn olive">{hero.primary} <Arr /></Btn>}
            </div>
          )}
        </div>
        <span className="key" data-reveal="" style={d(300)}><KeyMark /></span>
      </div>
    </section>
  );
}

export function Statement({ kicker, text }: { kicker: string; text: string }) {
  return (
    <section className="statement">
      <div className="wrap">
        <span className="caps kicker" data-reveal="">{kicker}</span>
        <Words v={text} />
      </div>
    </section>
  );
}

type Lang = { native: string; name: string; accent: string; phrase: string; meaning: string; text: string; tag: string; link?: LinkT };

/** Homepage: the sticky word on the left, one card per language on the right. */
export function Languages({ kicker, items }: { kicker: string; items: Lang[] }) {
  const total = String(items.length).padStart(2, "0");
  return (
    <section className="langs" id="langs">
      <div className="wrap grid">
        <div className="stick">
          <span className="caps kicker">{kicker}</span>
          <div className="bigword" aria-hidden="true">{items.map((l, i) => <span key={l.name} className={i === 0 ? "on" : undefined}>{l.native}</span>)}</div>
          <div className="phrase" aria-hidden="true">{items.map((l, i) => <span key={l.name} className={i === 0 ? "on" : undefined}>“{l.phrase}”<small>{l.meaning}</small></span>)}</div>
          <div className="counter type" aria-hidden="true"><b className="cur">01</b><span className="bar"><i /></span><span>{total}</span></div>
        </div>
        <div className="list">
          <h2 className="sr-only">{kicker}</h2>
          {items.map((l, i) => (
            <article className="lang" data-i={i} data-reveal="" key={l.name}>
              <span className="num">{n2(i)}</span>
              <span className="native" aria-hidden="true">{l.native}</span>
              <h3>{l.name}{l.accent && <> <em>{l.accent}</em></>}</h3>
              <p><T v={l.text} /></p>
              <span className="caps tag">{l.tag}</span>
              {l.link?.href && l.link.label && <Link className="more" href={l.link.href}>{l.link.label} <Arr /></Link>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** "How lessons work": two steps from site settings (who is in the lesson, then where), each a
    choice of two, with the rhythm note. Four rows in a list read as four separate options. */
export function Lessons({ id, kicker, heading, note, image, imageAlt }: { id?: string; kicker: string; heading: string; note?: string; image?: string; imageAlt?: string }) {
  const img = parse(image).text;
  return (
    <section className={`how${img ? "" : " nofig"}`} id={id}>
      <div className="wrap">
        <div className="head">
          <span className="caps kicker" data-reveal="">{kicker}</span>
          <h2 data-reveal=""><T v={heading} /></h2>
          <p className="note" data-reveal=""><T v={note || site.rhythm} /></p>
          {img && (
            <figure className={`frame${ph(image)}`} data-reveal="clip">
              <Img src={image} alt={imageAlt} sizes="(max-width: 1000px) 100vw, 40vw" />
            </figure>
          )}
        </div>
        <div className="steps">
          {site.formats.map((s, i) => (
            <div className="step" data-reveal="" key={s.title}>
              <span className="n" aria-hidden="true">{n2(i)}</span>
              <div className="step-head"><span className="caps lab">Step {i + 1}</span><h3><T v={s.title} /></h3></div>
              <div className="pick">
                {s.options.map((o, j) => (
                  <Fragment key={o.title}>
                    {j > 0 && <span className="or">or</span>}
                    <div className="opt"><b><T v={o.title} /></b><span><T v={o.text} /></span></div>
                  </Fragment>
                ))}
              </div>
            </div>
          ))}
          {site.formatsNote && <p className="mix" data-reveal=""><T v={site.formatsNote} /></p>}
        </div>
      </div>
    </section>
  );
}

/** The dark band: the method in one line, and the reasons people come. */
export function Band({ band }: { band: Omit<BandT, "show"> }) {
  return (
    <section className="method">
      <div className="wrap">
        <div className="copy">
          <span className="type" data-reveal="">{band.label}</span>
          <blockquote data-reveal="">{band.quote} <b>{band.accent}</b></blockquote>
          <p data-reveal=""><T v={band.lead} /></p>
          <ul className="reasons" data-reveal="">{band.reasons.map((r) => <li key={r}><T v={r} /></li>)}</ul>
        </div>
        {parse(band.image).text && (
          <div className={`frame${ph(band.image)}`} data-reveal="clip">
            <Img src={band.image} alt={band.imageAlt} sizes="(max-width: 1000px) 100vw, 40vw" speed={0.08} />
          </div>
        )}
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <div className="stats" data-reveal="">
      {site.stats.map((s, i) => (
        <div className="stat" key={i}><b>{s.value}</b><span><T v={s.text} /></span></div>
      ))}
    </div>
  );
}

/** About: the collage (portrait, inset photo, key), her story, signature, buttons and numbers. */
export function AboutBlock({ id = "about", kicker, heading, body, image, imageAlt, image2, image2Alt, signature = true, video = true, videoLabel = "Hear me speak · 1:07", stats = true }: {
  id?: string; kicker: string; heading: string; body: string; image?: string; imageAlt?: string; image2?: string; image2Alt?: string;
  signature?: boolean; video?: boolean; videoLabel?: string; stats?: boolean;
}) {
  const vid = video ? videoAct() : null;
  return (
    <section className="about" id={id}>
      <div className="wrap">
        <div className="collage">
          <figure className={`main frame${ph(image)}`} data-reveal="clip" style={{ margin: 0 }}>
            <Img src={image} alt={imageAlt} sizes="(max-width: 1000px) 90vw, 45vw" />
          </figure>
          {parse(image2).text && (
            <figure className={`inset frame${ph(image2)}`} data-reveal="clip" style={{ ...d(300), margin: 0 }}>
              <Img src={image2} alt={image2Alt} sizes="(max-width: 1000px) 45vw, 22vw" style={{ height: "100%", objectFit: "cover" }} speed={-0.06} />
            </figure>
          )}
          <span className="key"><KeyMark /></span>
        </div>
        <div className="copy">
          <span className="caps kicker" data-reveal="">{kicker}</span>
          <h2 data-reveal=""><T v={heading} /></h2>
          {body.split(/\n\s*\n/).map((p, i) => (
            <p key={i} className={i === 0 ? "first" : undefined} data-reveal=""><T v={p} /></p>
          ))}
          {signature && <div className="sign" data-reveal="">{site.teacher.firstName}<small>{site.teacher.role}</small></div>}
          <div className="acts" data-reveal="">
            <Btn act={bookAct()} className="btn solid">{site.buttons.book} <Arr /></Btn>
            {vid && (vid.soon
              ? <Btn act={vid} className="btn"><PlayIcon />{videoLabel}</Btn>
              : <a className="btn" href={vid.href} data-video=""><PlayIcon />{videoLabel}</a>)}
          </div>
        </div>
        {stats && <Stats />}
      </div>
    </section>
  );
}

/** Levels and ages. No prices on the site: the free call settles level and format. */
export function Levels({ kicker = "Levels and ages", heading, text, agesLabel = "Who it is for" }: { kicker?: string; heading: string; text?: string; agesLabel?: string }) {
  return (
    <section className="levels" id="levels">
      <div className="wrap">
        <div className="top">
          <div><span className="caps kicker" data-reveal="">{kicker}</span><h2 data-reveal=""><T v={heading} /></h2></div>
          <p data-reveal=""><T v={text || site.levelsText} /></p>
        </div>
        <div className="stubs">
          {site.levels.map((l, i) => (
            <div className="stub" data-reveal="" style={d(i * 100)} key={l.title}><span className="n">{n2(i)}</span><span className="big"><T v={l.title} /></span><p><T v={l.text} /></p></div>
          ))}
        </div>
        <div className="ages" data-reveal="">
          <span className="caps lab">{agesLabel}</span>
          {site.ages.map((a) => <div key={a.title}><b><T v={a.title} /></b><span><T v={a.text} /></span></div>)}
        </div>
      </div>
    </section>
  );
}

/** Prices: only when switched on in site settings (she decided against prices for now). */
export function Prices() {
  if (!site.showPrices || site.prices.length === 0) return null;
  return (
    <section className="prices" id="prices">
      <div className="wrap">
        <div><span className="caps kicker" data-reveal="">Prices</span></div>
        <div className="stubs">
          {site.prices.map((p, i) => (
            <div className="stub" data-reveal="" key={i}><span className="n"><T v={p.label} /></span><span className="big"><T v={p.price} /></span><p><T v={p.note} /></p></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Travel({ t }: { t: { label: string; heading: string; text: string; button: LinkT; link?: LinkT; image: string; imageAlt: string } }) {
  return (
    <section className="travel" id="travel">
      <div className="wrap">
        <div className={`frame${ph(t.image)}`} data-reveal="clip">
          <Img src={t.image} alt={t.imageAlt} sizes="(max-width: 1000px) 100vw, 40vw" style={{ height: "100%", objectFit: "cover", objectPosition: "50% 70%" }} />
        </div>
        <div className="copy">
          <span className="type" data-reveal="">{t.label}</span>
          <h2 className="h3" data-reveal=""><T v={t.heading} /></h2>
          <p data-reveal=""><T v={t.text} /></p>
          <div className="acts-row" data-reveal="">
            <Btn act={linkAct(t.button.href)} className="btn">{t.button.label} <Arr /></Btn>
            {t.link?.href && <Link className="more" href={t.link.href}>{t.link.label} <Arr /></Link>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Trip({ t }: { t: { kicker: string; heading: string; text: string; button: LinkT } }) {
  return (
    <section className="trip" id="trip">
      <div className="wrap">
        <div><span className="caps kicker" data-reveal="">{t.kicker}</span><h2 className="h3" data-reveal=""><T v={t.heading} /></h2></div>
        <div className="copy">
          <p data-reveal=""><T v={t.text} /></p>
          <div data-reveal=""><Btn act={linkAct(t.button.href)} className="btn">{t.button.label} <Arr /></Btn></div>
        </div>
      </div>
    </section>
  );
}

/** Quotes from a student and from two schools she teaches for (Ron Clark Academy, Listen & Learn). */
export function Reviews({ kicker = "In their words" }: { kicker?: string }) {
  if (site.reviews.length === 0) return null;
  return (
    <section className="quotes">
      <div className="wrap">
        <div className="head"><h2 className="caps kicker" data-reveal="">{kicker}</h2></div>
        {site.reviews.map((r, i) => {
          const marks = [parse(r.quote).mark, parse(r.name).mark, parse(r.detail).mark];
          const mark = marks.includes("example") ? "example" : marks.includes("confirm") ? "confirm" : null;
          return (
            <blockquote data-reveal="" style={d(i * 120)} key={i}>
              <p>{parse(r.quote).text}</p>
              <cite className="caps"><b>{parse(r.name).text}</b><span>{parse(r.detail).text}{mark && !IS_LIVE && <Tag mark={mark} />}</span></cite>
            </blockquote>
          );
        })}
      </div>
    </section>
  );
}

export function Faq({ kicker, heading, items }: { kicker: string; heading: string; items: FaqT[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="head"><span className="caps kicker" data-reveal="">{kicker}</span><h2 data-reveal=""><T v={heading} /></h2></div>
        <div data-reveal="">
          {items.map((f, i) => (
            <details key={i} open={i === 0}>
              <summary><span><T v={f.q} /></span><span className="pm" aria-hidden="true" /></summary>
              <Paras v={f.a} reveal={false} />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The closing night band: book, WhatsApp, or write. */
export function Cta() {
  const c = site.cta;
  const wa = whatsappAct();
  return (
    <section className="cta" id="contact">
      <div className="wrap">
        <div>
          <span className="type" data-reveal="">{c.label}</span>
          <Split v={c.title} as="h2" />
          <p data-reveal=""><T v={c.text} /></p>
          <div className="actions" data-reveal="">
            <Btn act={bookAct()} className="btn olive">{site.buttons.book} <Arr /></Btn>
            {wa && <Btn act={wa} className="btn light"><WhatsAppIcon />{site.buttons.whatsapp}</Btn>}
            <Btn act={messageAct()} className="btn light">{site.buttons.message}</Btn>
          </div>
          <p className="fine" data-reveal=""><T v={c.fine} /></p>
        </div>
        <span className="key"><KeyMark /></span>
      </div>
    </section>
  );
}

/** "Who it is for": numbered cards. */
export function Audience({ kicker, heading, text, items }: { kicker: string; heading: string; text: string; items: (Item & { link?: LinkT })[] }) {
  return (
    <section className="audience">
      <div className="wrap">
        <div className="top">
          <div><span className="caps kicker" data-reveal="">{kicker}</span><h2 data-reveal=""><T v={heading} /></h2></div>
          <p data-reveal=""><T v={text} /></p>
        </div>
        <div className="cards">
          {items.map((c, i) => (
            <div className="card" data-reveal="" style={d((i % 3) * 100)} key={c.title}>
              <span className="n">{n2(i)}</span>
              <h3><T v={c.title} /></h3>
              <p><T v={c.text} /></p>
              {c.link?.href && <Link className="more" href={c.link.href}>{c.link.label} <Arr /></Link>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** A chapter of an inner page: kicker, heading, text, an optional list and photo. */
export function Chapter({ c, index }: { c: ChapterT & { id?: string }; index: number }) {
  const img = parse(c.image).text;
  const cls = ["chapter", img ? (index % 2 === 1 ? "flip" : "") : "noimg", index % 2 === 1 ? "alt" : ""].filter(Boolean).join(" ");
  return (
    <section className={cls} id={c.id || undefined}>
      <div className="wrap">
        {img && (
          <div className={`frame${ph(c.image)}`} data-reveal="clip" style={{ "--ar": frameRatio(c.image) } as CSSProperties}>
            <Img src={c.image} alt={c.imageAlt} sizes="(max-width: 1000px) 100vw, 48vw" />
          </div>
        )}
        <div className="copy">
          <span className="caps kicker" data-reveal="">{c.kicker}</span>
          <h2 data-reveal=""><T v={c.heading} /></h2>
          <div className="body">
            {c.list && c.list.length > 0 && <ul className="ticks" data-reveal="">{c.list.map((li) => <li key={li}><T v={li} /></li>)}</ul>}
            <Paras v={c.body} />
          </div>
          {c.button?.label && (
            <div className="acts" data-reveal=""><Btn act={linkAct(c.button.href)} className="btn">{c.button.label} <Arr /></Btn></div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Links to the other lesson pages, above the closing band. */
export function Related({ items }: { items: { href: string; title: string; summary: string }[] }) {
  if (items.length === 0) return null;
  return (
    <section className="related">
      <div className="wrap">
        <h2 className="caps kicker" data-reveal="">More lessons</h2>
        <div className="list" data-reveal="">
          {items.map((r) => (
            <Link href={r.href} key={r.href}><b>{r.title}</b><span>{r.summary}</span></Link>
          ))}
        </div>
      </div>
    </section>
  );
}
