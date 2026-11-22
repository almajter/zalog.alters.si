// Topo images people can save to their phone gallery, one per wall.
// Lines are composited onto the photo with sharp; text and badges are laid out with Satori.
import type { APIRoute } from 'astro'
import { readFile } from 'node:fs/promises'
import satori from 'satori'
import sharp from 'sharp'
import { band, slug, walls } from '../../walls'
import { badges, colors, textOn, topoSvg, viewBox } from '../../topo'

const ink = '#1d211e', paper = '#efece4', muted = '#5f655d', line = '#d6d0c2', red = '#e5322d'

// Satori can't read woff2, fontsource ships plain woff too. latin-ext is for č, š, ž.
const fonts = await Promise.all(([['big-shoulders-display', 'Display', 800], ['public-sans', 'Sans', 400], ['public-sans', 'Sans', 600]] as const)
  .flatMap(([pkg, name, weight]) => ['latin', 'latin-ext'].map(async sub =>
    ({ name: sub === 'latin' ? name : `${name} ext`, weight, data: await readFile(`node_modules/@fontsource/${pkg}/files/${pkg}-${sub}-${weight}-normal.woff`) }))))

const display = 'Display, Display ext'
const logo = `data:image/svg+xml;base64,${(await readFile('public/logo.svg')).toString('base64')}`

// Neither font has ★, so draw it
const star = (fill: string, size: number) => ({ type: 'img', props: { width: size, height: size, src: `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${fill}" d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21.2l1.6-7L2 9.5l7.1-.6z"/></svg>`)}` } })

const h = (style: object, ...children: unknown[]) =>
  ({ type: 'div', props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) } })

const grade = (g: string) => {
  const b = band(g)
  return h({ minWidth: 70, padding: '4px 10px', borderRadius: 6, justifyContent: 'center', fontWeight: 600,
    ...(b === 'none' ? { border: `1.5px dashed ${muted}`, color: muted } : { background: colors[b], color: textOn(colors[b]) }) }, g)
}

const num = (n: string | undefined, color: string, size: number) =>
  h({ width: size, height: size, flexShrink: 0, borderRadius: size, background: n ? color : 'transparent', border: n ? '3px solid #fff' : 'none',
    justifyContent: 'center', alignItems: 'center', color: textOn(color), fontFamily: display, fontSize: size * .55 }, n === '★' ? star(textOn(color), size * .5) : n)

const wall = async (w: typeof walls[number]) => {
  const width = 640, [W, H] = viewBox(w), k = width / W, height = Math.round(H * k)
  const overlay = topoSvg(w, { text: false }).replace('<svg ', `<svg width="${width}" height="${height}" `)
  const photo = await sharp(`src/photos/${slug(w.name)}.jpg`).rotate().resize(width, height, { fit: 'cover' })
    .composite([{ input: Buffer.from(overlay) }]).jpeg({ quality: 82 }).toBuffer()
  const size = 48 * k
  return h({ gap: 40, padding: '32px 0', borderTop: `3px solid ${ink}` },
    h({ position: 'relative', width, height, flexShrink: 0 },
      { type: 'img', props: { src: `data:image/jpeg;base64,${photo.toString('base64')}`, width, height, style: { borderRadius: 8 } } },
      ...badges(w).map(b => h({ position: 'absolute', left: b.x * k - size / 2, top: b.y * k - size / 2 }, num(b.num, b.color, size)))),
    h({ flexDirection: 'column', flex: 1 },
      h({ fontFamily: display, fontSize: 64, lineHeight: 1, marginBottom: 16 }, w.name.toUpperCase()),
      ...w.problems.map(p => h({ gap: 16, padding: '12px 0', borderTop: `1px solid ${line}`, alignItems: 'flex-start' },
        num(p.num, colors[band(p.grade)], 40),
        h({ flexDirection: 'column', flex: 1 },
          h(p.name ? { fontWeight: 600 } : { color: muted, fontStyle: 'italic' }, p.name ?? 'brez imena'),
          p.note && h({ color: muted, fontSize: 18 }, p.note)),
        p.grade && grade(p.grade)))))
}

export const getStaticPaths = () => walls.map(w => ({ params: { slug: slug(w.name) } }))

export const GET: APIRoute = async ({ params }) => {
  const page = h({ flexDirection: 'column', padding: 48, background: paper, color: ink, fontFamily: 'Sans, Sans ext', fontSize: 20 },
    h({ justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24 },
      { type: 'img', props: { src: logo, height: 90, width: Math.round(90 * 678 / 230) } },
      h({ flexDirection: 'column', alignItems: 'flex-end', color: muted },
        h({ color: red, fontWeight: 600 }, 'Nenatančen vodniček'), 'zalog.alters.si')),
    await wall(walls.find(w => slug(w.name) === params.slug)!))

  const svg = await satori(page as any, { width: 1400, fonts })
  const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } })
}
