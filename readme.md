# Location Management System

A full-stack location management system built with React, Leaflet, Redux, Node.js, and MySQL.  
Users can view locations on a map, add new locations, and see their current location.

---

## Main Web Structure
- Register
- Login
- Interactive Map
- Upload Location

## Functional Requirements
- 4-page application (user-registration, login, interactive map, file upload)
- Implement sidebar navigation with logout option
- Secure the map and file upload pages
- unauthenticated visitors automatically redirected to the login page
- map page -> can enter a location name and its latitude/longitude coordinates
- display this location as a clickable marker
- shows the location name when clicked
- place that the user added should be displayed instantly on the map
- note that the page should not be refreshed and should happen on the fly
- file upload page -> users to upload a single ZIP file that must contain exactly one text file with location data (latitude/longitude coordinates and place names)
- Upon successful upload, display a confirmation popup for 3 seconds, then automatically add all the locations from the file to the user's map. 
- If the ZIP file contains anything other than a single text file, show an error popup for 3 seconds instead.  
- the following format for the .txt file
Name,Latitude,Longitude
Suria KLCC,3.157324409,101.7121981
Zoo Negara,3.21054160,101.75920504  

---

## Technical Specifications
- State Management Solution : Redux
- Map Functionality : react-leaflet
- Used MySQL for data persistance (Database)
- Implemented JWT-based authentication
- Frontend : React.js with Bootstrap
- Backend: Node.js, Express
- JavaScript

---

## Prerequisites

- Node.js (v18+ recommended)
- MySQL server (local or cloud)
- npm (comes with Node.js)

---

## Database Setup (MySQL)

1. Install and run MySQL.  
   - **Local:** [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)  

2. Create a database: refer readme.txt

