Overview

This project is a real-time threat mapping and safe routing application built using Leaflet.js and OpenStreetMap APIs. It allows users to report threats such as fire, accidents, floods, or other emergencies, visualize them on a map, and calculate a safe route to a chosen destination avoiding unsafe areas.

The app is designed for demonstrations, local safety monitoring, and emergency awareness.

Features

Interactive Map: Shows user’s current location using geolocation.

Threat Reporting: Click on the map to report a threat, specifying type and urgency (High, Medium, Low).

Dynamic Circles: Threats within the same area combine into a bigger circle for high-risk zones.

Sidebar Listing: All threats are displayed in a sidebar with readable location names instead of latitude and longitude.

Safe Routing: Calculates a route from your current location to a destination while avoiding unsafe zones.

Popup Notifications: Click a threat in the sidebar or map to highlight it.

Toast Alerts: Immediate notification when a new threat is reported.

Technologies Used

Frontend:

HTML, CSS, JavaScript

Leaflet.js
 for interactive maps

APIs:

OpenStreetMap Nominatim API
 for geocoding and reverse geocoding

Turf.js



Usage

Report a Threat:

Click anywhere on the map.

Enter the type of threat (Fire, Flood, Accident, etc.).

Enter urgency (High, Medium, Low). Default is Low.

The threat will appear as a colored circle on the map.

View Threats:

Click the Threats sidebar button to open the list of live threats.

Click a threat in the sidebar to zoom to its location on the map.

Safe Routing:

Enter a destination in the input box.

Click Route to calculate a safe path avoiding all current threats.

Screenshots


Threats visualized on the map with bigger circles for multiple nearby threats.


Sidebar listing threats with readable location names.

Future Improvements

Integrate Firebase for real-time threat updates from multiple users.

Add mobile-friendly design and responsive layout.

Include notifications via SMS or email for nearby high-risk threats.

Add filtering for threat types and urgency levels
 for safe route calculations and spatial operations

Hosting/Deployment: Can be deployed on any static hosting (e.g., GitHub Pages, Netlify, Vercel)
