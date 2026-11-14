// Draws the Europe travel map (D3 + world-atlas, loaded from CDNs by travel.astro) and the photo panel.
interface Photo { src: string; alt?: string; caption?: string }
interface Country { name: string; code: string; place?: string; photos?: Photo[] }

const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const d3: any;
declare const topojson: any;

export async function initTravelMap() {
  const host = document.getElementById('travel-map');
  const panel = document.getElementById('travel-panel');
  const dataEl = document.getElementById('travel-data');
  if (!host || !panel || !dataEl || host.dataset.ready) return;
  host.dataset.ready = '';
  const countries: Country[] = JSON.parse(dataEl.textContent ?? '[]');
  const byCode = new Map(countries.map((c) => [c.code.padStart(3, '0'), c]));
  const chips = [...document.querySelectorAll<HTMLButtonElement>('.travel-chips button')];
  const lightbox = document.getElementById('travel-lightbox') as HTMLDialogElement;
  let current: Country | undefined;
  let photoIndex = 0;
  let lastTrigger: HTMLElement | null = null;

  function select(code: string, focusPanel = false) {
    const country = byCode.get(code.padStart(3, '0'));
    if (!country) return;
    current = country;
    host!.querySelectorAll('.visited').forEach((el) => el.classList.toggle('selected', (el as SVGElement).dataset.code === code));
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.code === code)));
    renderPanel(country);
    if (focusPanel) panel!.querySelector<HTMLElement>('h2')?.focus();
  }

  function renderPanel(country: Country) {
    panel!.replaceChildren();
    const h2 = document.createElement('h2');
    h2.tabIndex = -1;
    h2.textContent = country.name;
    panel!.append(h2);
    if (country.place) {
      const p = document.createElement('p');
      p.textContent = `Including ${country.place}.`;
      panel!.append(p);
    }
    const photos = country.photos ?? [];
    if (!photos.length) {
      const soon = document.createElement('p');
      soon.className = 'travel-soon';
      soon.textContent = 'Photos coming soon. Check back later.';
      panel!.append(soon);
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'travel-grid';
    photos.forEach((photo, i) => {
      const li = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Open photo ${i + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`);
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt ?? photo.caption ?? `Photo from ${country.name}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      button.append(img);
      button.addEventListener('click', () => open(i, button));
      li.append(button);
      ul.append(li);
    });
    panel!.append(ul);
  }

  function show(i: number) {
    const photos = current?.photos ?? [];
    if (!photos.length) return;
    photoIndex = (i + photos.length) % photos.length;
    const photo = photos[photoIndex];
    const img = lightbox.querySelector('img')!;
    img.src = photo.src;
    img.alt = photo.alt ?? photo.caption ?? `Photo from ${current!.name}`;
    lightbox.querySelector('figcaption')!.textContent = photo.caption ?? '';
    lightbox.querySelectorAll<HTMLElement>('.lb-prev, .lb-next').forEach((b) => (b.hidden = photos.length < 2));
  }
  function open(i: number, trigger: HTMLElement) {
    lastTrigger = trigger;
    show(i);
    lightbox.showModal();
  }
  lightbox.querySelector('.lb-close')!.addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lb-prev')!.addEventListener('click', () => show(photoIndex - 1));
  lightbox.querySelector('.lb-next')!.addEventListener('click', () => show(photoIndex + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(photoIndex - 1);
    if (e.key === 'ArrowRight') show(photoIndex + 1);
  });
  lightbox.addEventListener('close', () => lastTrigger?.focus());

  chips.forEach((chip) => chip.addEventListener('click', () => select(chip.dataset.code!)));

  try {
    const world = await (await fetch(ATLAS)).json();
    const features = topojson.feature(world, world.objects.countries).features;
    const width = 960, height = 620;
    const projection = d3.geoConicConformal().rotate([-12, 0]).parallels([40, 58]);
    projection.fitExtent([[6, 6], [width - 6, height - 6]],
      { type: 'MultiPoint', coordinates: [[-10, 36], [-10, 58], [30, 58], [30, 36], [10, 36], [10, 60], [-10, 50], [30, 48]] });
    const path = d3.geoPath(projection);
    host.replaceChildren();
    const svg = d3.select(host).append('svg').attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'group').attr('aria-label', 'Map of Europe');
    svg.append('g').selectAll('path').data(features).join('path')
      .attr('class', (f: { id: string }) => (byCode.has(String(f.id).padStart(3, '0')) ? 'visited' : 'land'))
      .attr('d', path);
    svg.selectAll('path.visited')
      .attr('data-code', (f: { id: string }) => byCode.get(String(f.id).padStart(3, '0'))!.code)
      .attr('tabindex', 0).attr('role', 'button')
      .attr('aria-label', (f: { id: string }) => {
        const c = byCode.get(String(f.id).padStart(3, '0'))!;
        return `${c.name}${c.photos?.length ? '' : ' (photos coming soon)'}`;
      })
      .each(function (this: SVGElement, f: { id: string }) {
        const code = byCode.get(String(f.id).padStart(3, '0'))!.code;
        this.addEventListener('click', () => select(code, true));
        this.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(code, true); }
        });
      })
      .append('title').text((f: { id: string }) => byCode.get(String(f.id).padStart(3, '0'))!.name);
    // Draw visited countries last so their outlines sit on top of neighbours.
    svg.selectAll('path.visited').raise();
  } catch {
    host.textContent = 'The map could not load. Pick a country from the list below instead.';
  }
}
