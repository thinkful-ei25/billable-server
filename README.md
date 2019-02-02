# CallMEter 
This project was bootstrapped with Create React App.

## Welcome to CallMEter 

CallMEter is a tool for business owners and freelancers that takes the admin work out of tracking and invoicing for billable time spent on calls. 
Check us out at <a href="https://callmeter.netlify.com/">callmeter.netlify.com</a>!

### Features:
- CallMEter provides a phone number powered by twilio, allowing for call time tracking, that reroutes to your provided business number. 
- Client management, easily create, call, and edit clients from their profile. 
- In app inbound and outbound browser calling and call redirects to your phone while you're offline. 
- Automated invoicing system. CallMEter programmatically generates invoices unique to each client and delivers them via email with a single click. 
- Graphic breakdown of calls made over time and the time spent on each.

### Preview: 
Landing Page


Client Profile


Stats Dashboard


Browser Calling


### Tech Stack:

React and Redux for state management on the frontend

MongoDb for backend data management -clients, users, calls

Twilio for call functionality

NodeMailer for invoice mailing


### Client-side Core Dependencies:
```
"dependencies": {
    "@fortawesome/fontawesome-svg-core": "^1.2.12",
    "@fortawesome/free-solid-svg-icons": "^5.6.3",
    "@fortawesome/react-fontawesome": "^0.1.4",
    "animejs": "^3.0.1",
    "chart.js": "^2.7.3",
    "jquery": "^3.3.1",
    "jwt-decode": "^2.2.0",
    "namor": "^1.1.1",
    "normalize.css": "^8.0.1",
    "react": "^16.7.0",
    "react-burger-menu": "^2.6.1",
    "react-chartjs-2": "^2.7.4",
    "react-dom": "^16.7.0",
    "react-redux": "^6.0.0",
    "react-router-dom": "^4.3.1",
    "react-scripts": "2.1.3",
    "react-sparklines": "^1.7.0",
    "react-table": "^6.8.6",
    "redux": "^4.0.1",
    "redux-devtools": "^3.5.0",
    "redux-form": "^8.1.0",
    "redux-thunk": "^2.3.0",
    "twilio": "^3.25.0",
    "twilio-client": "^1.6.5"
  }
```

### Server-side Core Dependencies:
```
  "dependencies": {
    "bcryptjs": "^2.4.0",
    "body-parser": "^1.15.2",
    "cors": "^2.8.4",
    "dotenv": "^6.2.0",
    "express": "^4.16.3",
    "jsonwebtoken": "^8.2.0",
    "knex": "^0.16.3",
    "moment": "^2.24.0",
    "mongoose": "^5.2.6",
    "morgan": "^1.9.0",
    "nodemon": "^1.18.9",
    "passport": "^0.4.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "pg": "^7.4.3",
    "twilio": "^3.27.1"
  }
```


### Check out our api docs in <a href="https://gist.github.com/jsantiag/1c6ce266616343d228bd2279781b1f62">this public gist</a>