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
  if(sidebar.style.width === "850px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "850px";
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
