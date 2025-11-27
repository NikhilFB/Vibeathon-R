const sidebar = document.getElementById('sidebar');
const sidebarBtn = document.querySelector('.threats');
const threatParent = document.getElementById('threatParent');
const threatCount = document.getElementById('threatCount');


const threats = [
  { type: "Fire", location: "Street 12", urgency: "High" },
  { type: "Accident", location: "Highway 5", urgency: "Medium" },
  { type: "Flood", location: "Sector 8", urgency: "Low" }
];

sidebarBtn.addEventListener('click', () => {
  if(sidebar.style.width === "500px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "500px";
    renderThreats();
  }
});


function renderThreats() {
  threatParent.innerHTML = ""; 
  threatCount.textContent = threats.length;

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

// Get user location
navigator.geolocation.getCurrentPosition(position => {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  map.setView([lat,lng],14);
  L.marker([lat,lng]).addTo(map).bindPopup("You are here").openPopup();

  threats.forEach(threat => {
    L.marker([threat.lat, threat.lng]).addTo(map)
      .bindPopup(`<b>${threat.type}</b><br>${threat.location}<br>Urgency: ${threat.urgency}`);
  });
}, err => {
  console.error("Location error:", err);
});
