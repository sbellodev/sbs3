# SmashBrosSpain v2 (Prototype)

A new version of SmashBrosSpain web app built with React and PHP.

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