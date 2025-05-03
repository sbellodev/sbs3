# SmashBrosSpain v2 (Prototype)

A new version of SmashBrosSpain web app built with React and PHP.


## TODO

- [ ] Frontend - Visual Mockup of SBS index page
- [ ] Frontend - Visual Mockup of Noticias (only index)
- [ ] Frontend - Visual Mockup of Torneos (only index)
- [ ] Frontend - Visual Mockup of Rankings (only index)
- [ ] Frontend - Visual Mockup of Regiones (only index)
- [ ] Frontend - Visual Mockup of Discord (only index)
- [ ] Frontend - Visual Mockup of Gacha (only index)
- [ ] Backend  - BBDD - Add entities UserProfile, TournamentSets
- [ ] Backend  - BBDD - Add entities News
- [ ] Backend -  Code - Implement user roles/permissions
- More in future (admin page, emails, gacha points...)

## DONE
- Initialize PHP app
- Initialize React app
- Connect both apps
- Deploy development app 

## Development Setup

1. Clone repository
2. Set up PHP backend (requires MySQL)
3. Configure frontend to point to your API
4. `npm start` to run React dev server

## License

MIT

## Overview

- **Technology Stack**: React (Frontend) + PHP (Backend)
- **Status**: Prototype/Development
- **Live Demo**: [https://sbs3.onrender.com/](https://sbs3.onrender.com/)

## Features

- Tournament management (CRUD)
- User management (CRUD)
- Basic authentication system
- Responsive design

## Project Structure

    .
    ├── ...
    ├── backend          # Backend app in vanilla PHP
    │   ├── api.php      # Main endpoint for redirecting requests.
    │   ├── models/     
    │   └── controllers/
    │   └── config/     
    │
    ├── frontend         # Frontend app in React
    │   ├── App.js       
    │   ├── components/  
    │   └── etc/         
    └── ...

## Development Setup

1. Clone repository
2. Set up PHP backend (requires MySQL)
3. Configure frontend to point to your API
4. `npm start` to run React dev server

## License

MIT