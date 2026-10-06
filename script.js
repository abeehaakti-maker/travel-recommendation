const results = document.getElementById('results');
const input = document.getElementById('searchInput');

function show(items) {
  results.innerHTML = items.map(i =>
    `<div class="card"><img src="${i.imageUrl}" alt="${i.name}"><div><h3>${i.name}</h3><p>${i.description}</p></div></div>`
  ).join('');
}

function search() {
  const key = input.value.trim().toLowerCase();
  if (!key) { results.innerHTML = ''; return; }
  fetch('travel_recommendation_api.json')
    .then(r => r.json())
    .then(data => {
      let found = [];
      if (key.startsWith('beach')) found = data.beaches;
      else if (key.startsWith('temple')) found = data.temples;
      else if (key.startsWith('countr')) found = data.countries.flatMap(c => c.cities);
      else {
        data.countries.forEach(c => {
          if (c.name.toLowerCase().includes(key)) found.push(...c.cities);
          else c.cities.forEach(ci => { if (ci.name.toLowerCase().includes(key)) found.push(ci); });
        });
      }
      if (found.length) show(found);
      else results.innerHTML = '<p>No recommendations found. Try beach, temple or country.</p>';
    })
    .catch(err => { results.innerHTML = '<p>Could not load recommendations.</p>'; console.error(err); });
}

document.getElementById('searchBtn')?.addEventListener('click', search);
input?.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
document.getElementById('clearBtn')?.addEventListener('click', () => { input.value = ''; results.innerHTML = ''; });
