const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}
const search = document.querySelector('[data-archive-search]');
if (search) {
  const rows = [...document.querySelectorAll('[data-archive-row]')];
  const count = document.querySelector('[data-search-count]');
  search.addEventListener('input', () => {
    const term = search.value.trim().toLowerCase();
    let visible = 0;
    for (const row of rows) {
      const show = row.textContent.toLowerCase().includes(term);
      row.hidden = !show;
      if (show) visible++;
    }
    if (count) count.textContent = `${visible} prediction${visible === 1 ? '' : 's'} found`;
  });
}
