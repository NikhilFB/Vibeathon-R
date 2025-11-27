const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.querySelector('.threats');
const threatParent = document.getElementById('threatParent');
const threatCount = document.getElementById('threatCount');

const threats = [];

sidebarBtn.addEventListener('click', () => {
  sidebar.style.width = sidebar.style.width === "500px" ? "0" : "500px";
  renderThreats();
});

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

    if(threat.urgency === "High") div.style.backgroundColor = "#af000fff";
    if(threat.urgency === "Medium") div.style.backgroundColor = "#c86d2dff";
    if(threat.urgency === "Low") div.style.backgroundColor = "#a5cf27ff";

    div.innerHTML = `
      <strong>${threat.type}</strong><br>
      Location: ${threat.location}<br>
      Urgency: ${threat.urgency}
    `;
    threatParent.appendChild(div);
  });
}


const map = L.map('map', { zoomControl: false }).setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);


navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  map.setView([lat, lng], 14);
  L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
}, err => console.error(err));

const circles = [];



map.on('click', e => {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;

  const type = prompt("Enter type of alert (Fire, Accident, Flood etc.):");
  if(!type) return;

  let urgency = prompt("Enter urgency (High / Medium / Low):");
  if(!urgency) urgency = "Low";

  const location = `Lat: ${lat.toFixed(3)}, Lng: ${lng.toFixed(3)}`;


  let color = "#a5cf27"; 
  if(urgency.toLowerCase() === "medium") color = "#c86d2d";
  if(urgency.toLowerCase() === "high") color = "#af000f";

  
  const newThreat = { type, urgency, lat, lng, location };
  threats.push(newThreat);

  
  const nearbyThreats = threats.filter(t => 
    map.distance([lat, lng], [t.lat, t.lng]) <= 200 && 
    ((t.urgency.toLowerCase() === urgency.toLowerCase()))
  );

 
  circles.forEach((c, index) => {
    const dist = map.distance([lat, lng], c.getLatLng());
    if(dist <= 200 && c.options.color === color) {
      map.removeLayer(c);
      circles.splice(index, 1);
    }
  });

  let circleRadius = 20;

  if(nearbyThreats.length >= 3) {
    circleRadius = 200; 
  }

  
  const circle = L.circle([lat, lng], {
    color: color,
    fillColor: color,
    fillOpacity: 0.5,
    radius: circleRadius
  }).addTo(map).bindPopup(`<b>${type}</b><br>Urgency: ${urgency}<br>${location}`);

  circles.push(circle);
  renderThreats();
});
