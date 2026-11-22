// Draws a wall's lines as SVG, sized to sit exactly on top of its photo.
// Used inline on the page and, without the number text, for the saved JPG.
import { band, id, type Wall } from './walls'

export const colors = { easy: '#2f9a54', mid: '#2f74c4', hard: '#e5850f', max: '#c0244c', none: '#e5322d' }
// White on green and orange is too faint
export const textOn = (c: string) => c === colors.easy || c === colors.hard ? '#1d211e' : '#fff'

type Pt = [number, number]
const pts = (line: string): Pt[] => line.trim().split(/\s+/).map(p => p.split(',').map(Number) as Pt)

// Catmull-Rom through the points, as cubic Béziers
const smooth = (p: Pt[]) => {
  let d = `M${p[0][0]} ${p[0][1]}`
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] ?? p[i], b = p[i], c = p[i + 1], e = p[i + 2] ?? c
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6]
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6]
    d += `C${c1.map(Math.round)} ${c2.map(Math.round)} ${c}`
  }
  return d
}

const r = (n: number) => Math.round(n)
const unit = (a: Pt, b: Pt): Pt => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l] }

export const viewBox = (w: Wall) => w.photo.width > w.photo.height ? [1000, 750] : [750, 1000]

export type Badge = { id: string, num: string, x: number, y: number, color: string }

// Number badges sit just below each start; ones that would overlap are pushed sideways
export const badges = (w: Wall): Badge[] => {
  const [W, H] = viewBox(w), R = 24, placed: Badge[] = []
  for (const p of w.problems) {
    if (!p.line || !p.num) continue
    const [s] = pts(p.line)
    let x = s[0], y = Math.min(s[1] + 34, H - R - 4)
    while (placed.some(b => Math.hypot(b.x - x, b.y - y) < R * 2 + 4)) x += R * 2 + 6
    x = Math.max(R + 4, Math.min(W - R - 4, x))
    placed.push({ id: id(p, w), num: p.num, x, y, color: colors[band(p.grade)] })
  }
  return placed
}

export const topoSvg = (w: Wall, { text = true } = {}) => {
  const [W, H] = viewBox(w)
  const lines = w.problems.filter(p => p.line).map(p => {
    const c = pts(p.line!), col = colors[band(p.grade)], d = smooth(c)
    const end = c[c.length - 1], [ux, uy] = unit(c[c.length - 2], end), a = 22
    const head = `M${r(end[0] - ux * a - uy * a * .75)} ${r(end[1] - uy * a + ux * a * .75)}L${end[0]} ${end[1]}L${r(end[0] - ux * a + uy * a * .75)} ${r(end[1] - uy * a - ux * a * .75)}`
    const [vx, vy] = unit(c[0], c[1]), s = c[0]
    const bar = `M${r(s[0] - vy * 16)} ${r(s[1] + vx * 16)}L${r(s[0] + vy * 16)} ${r(s[1] - vx * 16)}`
    const shape = `<path d="${d}"/><path d="${head}"/><path d="${bar}"/>`
    return `<g class="ln" data-id="${id(p, w)}" style="--c:${col}">` +
      `<g class="hit" stroke="transparent" stroke-width="44">${shape}</g>` +
      `<g class="case" stroke="#fff" stroke-width="13" stroke-opacity=".9">${shape}</g>` +
      `<g class="stroke" stroke="${col}" stroke-width="7">${shape}</g></g>`
  }).join('')
  const nums = badges(w).map(b =>
    `<g class="bd" data-id="${b.id}"><circle cx="${b.x}" cy="${b.y}" r="24" fill="${b.color}" stroke="#fff" stroke-width="4"/>` +
    (text ? `<text x="${b.x}" y="${b.y}" dy=".36em" style="fill:${textOn(b.color)}">${b.num}</text>` : '') + '</g>').join('')
  return `<svg class="topo" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke-linecap="round" stroke-linejoin="round">${lines}${nums}</svg>`
}
