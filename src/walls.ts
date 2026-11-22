import karma from './photos/karma.jpg'
import familija from './photos/familija.jpg'
import bule from './photos/bule.jpg'
import utopija from './photos/utopija.jpg'
import krimpi from './photos/krimpi.jpg'
import neBor from './photos/ne-bor.jpg'

// num is the number drawn on the topo. Variants have no number and no line.
// line: points "x,y x,y …" from start to finish, in the photo's viewBox
// (750×1000 for portrait photos, 1000×750 for landscape). The line is smoothed through them.
export type Problem = { num?: string, name?: string, grade?: string, note?: string, line?: string }
export type Wall = { name: string, photo: ImageMetadata, problems: Problem[] }

export const parking = '46.06178, 14.63783'
export const quarry = '46.05983, 14.63421'

// 'Ne bor' -> 'ne-bor', same as the photo file name
export const slug = (name: string) => name.toLowerCase().replace(' ', '-')

// Font grades sort as plain strings ('6c' < '7a' < '8a' < '8a+'), so no lookup table needed.
export const band = (g = '') =>
  g === 'lahko' ? 'easy' : !/^\d/.test(g) ? 'none' : g < '7a' ? 'easy' : g < '7c' ? 'mid' : g <= '8a' ? 'hard' : 'max'

// Grade buckets for the filter: '≤5' holds anything easier than 6a ('lahko' too)
export const buckets = ['≤5', '6a', '6b', '6c', '7a', '7b', '7c', '8a', '8b', '8c']
export const bucket = (g = '') => {
  const m = g.match(/^([5-9])([abc])?/)
  if (!m) return g === 'lahko' ? 0 : -1
  return m[1] < '6' ? 0 : Math.min(buckets.indexOf(m[1] + (m[2] ?? 'a')), buckets.length - 1)
}

export const id = (p: Problem, wall: Wall) => p.num && p.num !== '★' ? p.num : slug(wall.name) + '-' + slug(p.name ?? '')

export const walls: Wall[] = [
  {
    name: 'Karma', photo: karma, problems: [
      { num: '1', name: 'Cookie?', grade: '7a', note: 'Ime je najbrž Cookie, ni pa zagotovo.', line: '61,639 56,467 47,272' },
      { num: '2', name: 'Karma korner stand', grade: '7a', line: '167,606 150,467 136,356 124,278' },
      { num: '3', name: 'Karma korner', grade: '7b', line: '206,828 189,711 167,606 150,467 136,356 124,278' },
      { num: '4', name: 'Sekalica v karmo', grade: '7c', line: '528,658 467,589 367,561 239,572 194,500 156,367 131,283' },
      { name: 'Karma v sekalico', grade: '7b+', note: 'Kombinacija: štart v Karmi, izstop po Sekalici. Ne boš verjel glede na ime.' },
      { name: 'Sekalica stand »bula«', grade: '6c?', note: 'Z levo držiš krimp, desno daš peto. Kul balvan.' },
      { num: '5', name: 'Sekalica', grade: '7b', line: '531,658 524,533 444,444 383,394 361,278 356,44' },
      { num: '6', name: 'Monkey', grade: '7c', note: 'Isti štart kot Sekalica, potem greš desno. Za desno je neka luknjica.', line: '550,644 633,617 683,522 698,322' },
    ],
  },
  {
    name: 'Familija', photo: familija, problems: [
      { num: '7', name: 'Familija', grade: '8a+/b', note: 'Štart desno na očitni šalci, potem prečka.', line: '911,700 778,658 600,606 444,572 278,531 144,494 78,422 11,367' },
      { num: '8', name: 'The End', grade: '8c', note: 'Isti štart kot Familija, izstop v Beginning.', line: '917,636 778,594 622,576 533,542 356,522 278,456 167,367 78,172' },
      { num: '9', name: 'Beginning of the End', grade: '8b+', note: 'Eliminacija, štart na podprijemih.', line: '539,542 444,531 356,522 278,456 167,367 78,172' },
      { num: '10', grade: '7c', note: 'Ime sem pozabil.', line: '787,561 767,444 722,278 689,139' },
    ],
  },
  {
    name: 'Bule', photo: bule, problems: [
      { num: '11', name: 'Bule cvilijo', grade: '7c', line: '233,706 222,622 261,511 356,433 444,387 464,333 450,261 378,183 302,156' },
      { num: '12', name: 'Cvile bulijo', grade: '8a', line: '564,942 569,800 587,689 609,556 614,444 598,372 567,300 511,217 433,150 356,117 261,98' },
    ],
  },
  {
    name: 'Utopija', photo: utopija, problems: [
      { num: '13', name: 'Utopija', grade: '8a+', line: '24,978 56,867 106,778 211,667 300,600 367,478 439,311 464,172' },
      { num: '14', name: 'Navijat čopka', grade: '8b', line: '24,978 56,867 106,778 211,664 217,578 189,522 133,472 44,444 9,411 9,333 17,250' },
    ],
  },
  {
    name: 'Krimpi', photo: krimpi, problems: [
      { num: '15', grade: '6a/b', note: 'Ful dober balvan po krimpih. Mogoče sem linijo narisal narobe.', line: '122,839 113,667 78,522 73,333 76,211' },
      { num: '16', grade: 'lahko', note: 'Nekaj zelo lahkega.', line: '314,839 306,711 294,556 289,428' },
    ],
  },
  {
    name: 'Ne bor', photo: neBor, problems: [
      { num: '17', name: 'Ne bor', grade: '7a', note: 'Trd. En ful slab levi stop moraš zahodit.', line: '191,924 206,856 233,767 236,717 178,687 133,656 122,600 139,522 156,489' },
      { num: '18', name: 'Silvo plut', grade: '7b', note: 'Trd. Eliminacija, skočiš na dva »dobra grifa« na koncu Ne bora.', line: '191,650 183,578 176,520' },
      { num: '★', name: 'Drunken master', note: 'Prečka brez rok. Mogoče ni pravi balvan, je pa ful zabavno. Z rokami za hrbtom je ful težko.', line: '313,889 367,800 467,733 576,711' },
      { num: '19', grade: '6a/b', line: '487,791 467,633 444,522 436,476' },
      { num: '20', grade: '6a/b', line: '491,664 528,644 550,578 542,511 506,469 464,458' },
      { num: '21', grade: '6a/b', note: '19, 20 in 21 so lepi ogrevalni balvani. Dva sta Pinch in Science friction.', line: '638,778 622,656 606,533 589,458' },
      { num: '22', name: 'Circle intense', grade: '7c', note: 'Štart na polici, potem mali krimpi nad njo.', line: '667,728 717,672 728,606 694,556 658,502' },
    ],
  },
]
