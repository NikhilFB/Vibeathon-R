const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.querySelector('.threats');
const threatParent = document.getElementById('threatParent');
const threatCount = document.getElementById('threatCount');
const routeBtn = document.getElementById('routeBtn');
const toast = document.getElementById('toast');
const destinationInput = document.getElementById('destinationInput');

const threats = [];
const circles = [];
let safeRoute;

// Sidebar toggle
sidebarBtn.addEventListener('click', () => {
  sidebar.style.width = sidebar.style.width === "500px" ? "0" : "500px";
  renderThreats();
});

// Render sidebar threats
function renderThreats() {
  threatParent.innerHTML = "";
  threatCount.textContent = threats.length;
  if (threats.length === 0) {
    threatParent.innerHTML = "<p>No live threats</p>";
    return;
  }

  threats.forEach(threat => {
    const div = document.createElement('div');
    div.classList.add('threat');

    const urgency = threat.urgency.trim().toLowerCase();
    let color = "#a5cf27"; // Low - Green
    if (urgency === "medium") color = "#c86d2d"; // Medium - Orange
    if (urgency === "high") color = "#ff0000"; // High - Red

    div.style.backgroundColor = color;
    div.style.color = "#fff";
    div.style.padding = "10px 15px";
    div.style.marginBottom = "10px";
    div.style.borderRadius = "8px";
    div.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
    div.style.fontWeight = "bold";
    div.style.cursor = "pointer";

    div.addEventListener('click', () => {
      map.setView([threat.lat, threat.lng], 16);
      circles.forEach(c => {
        const cLatLng = c.getLatLng();
        if (cLatLng.lat === threat.lat && cLatLng.lng === threat.lng) {
          c.openPopup();
        }
      });
    });

    div.innerHTML = `<strong>${threat.type}</strong><br>Location: ${threat.location}<br>Urgency: ${threat.urgency}`;
    threatParent.appendChild(div);
  });
}

// Initialize map
const map = L.map('map', { zoomControl: false }).setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }).addTo(map);

// Current location marker
navigator.geolocation.getCurrentPosition(pos => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  map.setView([lat, lng], 14);
  L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
}, err => console.error(err));

// Toast notifications
function showToast(msg, urgency) {
  let color = "#a5cf27"; // Low - Green
  if (urgency.toLowerCase() === "medium") color = "#c86d2d"; // Medium - Orange
  if (urgency.toLowerCase() === "high") color = "#ff0000"; // High - Red

  toast.textContent = msg;
  toast.style.background = color;
  toast.style.right = "20px";
  setTimeout(() => { toast.style.right = "-300px"; }, 3000);
}

// Add threat on map
map.on('click', e => {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  const type = prompt("Enter type of alert (Fire, Accident, Flood etc.):");
  if (!type) return;
  let urgency = prompt("Enter urgency (High / Medium / Low):");
  if (!urgency) urgency = "Low";
  const location = `Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`;

  const newThreat = { type, urgency, lat, lng, location };
  threats.push(newThreat);

  // Show toast notification
  showToast(`${urgency} Alert: ${type}`, urgency);

  // Find nearby threats (200m)
  const nearby = threats.filter(t => map.distance([lat, lng], [t.lat, t.lng]) <= 200);

  // Remove overlapping circles
  let color = "#a5cf27";
  if (urgency.toLowerCase() === "medium") color = "#c86d2d";
  if (urgency.toLowerCase() === "high") color = "#ff0000";

  circles.forEach((c, i) => {
    const dist = map.distance([lat, lng], c.getLatLng());
    if (dist <= 200 && c.options.color === color) {
      map.removeLayer(c);
      circles.splice(i, 1);
    }
  });

  let radius = nearby.length >= 3 ? 200 : 20;

  const circle = L.circle([lat, lng], {
    color: color,
    fillColor: color,
    fillOpacity: 0.5,
    radius: radius
  }).addTo(map).bindPopup(`<b>${type}</b><br>Urgency: ${urgency}<br>${location}`);

  circles.push(circle);
  renderThreats();
});

// Convert address to coordinates
async function getCoordinates(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.length === 0) return null;
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

// Safe routing
routeBtn.addEventListener('click', async () => {
  if (!navigator.geolocation) return alert("Geolocation not supported");
  const destination = destinationInput.value;
  if (!destination) return alert("Enter destination");

  const coords = await getCoordinates(destination);
  if (!coords) return alert("Destination not found");

  const destLat = coords[0];
  const destLng = coords[1];

  navigator.geolocation.getCurrentPosition(pos => {
    const start = [pos.coords.latitude, pos.coords.longitude];
    const end = [destLat, destLng];

    if (safeRoute) map.removeLayer(safeRoute);

    const unsafeZones = circles.map(c =>
      turf.circle([c.getLatLng().lng, c.getLatLng().lat], c.getRadius() / 1000, { steps: 20, units: 'kilometers' })
    );
    const steps = 50;
    const route = [start];
    let current = start;

    for (let i = 1; i <= steps; i++) {
      let next = [
        current[0] + i * (end[0] - current[0]) / steps,
        current[1] + i * (end[1] - current[1]) / steps
      ];
      let point = turf.point([next[1], next[0]]);
      let unsafe = unsafeZones.some(z => turf.booleanPointInPolygon(point, z));

      if (unsafe) {
        let found = false;
        for (let offset = 0.001; offset <= 0.01; offset += 0.001) {
          const alternatives = [
            [next[0] + offset, next[1]],
            [next[0] - offset, next[1]],
            [next[0], next[1] + offset],
            [next[0], next[1] - offset],
            [next[0] + offset, next[1] + offset],
            [next[0] - offset, next[1] - offset],
            [next[0] + offset, next[1] - offset],
            [next[0] - offset, next[1] + offset]
          ];
          for (let alt of alternatives) {
            const altPoint = turf.point([alt[1], alt[0]]);
            if (!unsafeZones.some(z => turf.booleanPointInPolygon(altPoint, z))) {
              next = alt;
              found = true;
              break;
            }
          }
          if (found) break;
        }
        if (!found) continue;
      }

      route.push(next);
      current = next;
    }

    route.push(end);
    safeRoute = L.polyline(route, { color: '#16a34a', weight: 5 }).addTo(map);
    map.fitBounds(L.latLngBounds(route));
    showToast("Safe route calculated", "low"); // Green toast
  });
});
