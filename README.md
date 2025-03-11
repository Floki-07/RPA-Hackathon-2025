# MERN Stack Application

This repository contains a full-stack application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Project Structure

```
mern-app/
├── client/            # Frontend React application
└── server/            # Backend Node.js/Express application
```

## Prerequisites

Before getting started, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) (v8 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (v4 or later)

## Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/your-username/mern-app.git
cd mern-app
```

### Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-app
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

### Client Setup

1. Navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the client:
   ```bash
   npm start
   ```

## Available Scripts

### Server

- `npm start`: Starts the server in production mode
- `npm run dev`: Starts the server in development mode with nodemon
- `npm test`: Runs server tests

### Client

- `npm start`: Starts the development server
- `npm build`: Builds the app for production
- `npm test`: Runs client tests
- `npm run eject`: Ejects from Create React App configuration

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/user` - Get current user information

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Folder Structure

### Client
```
client/
├── public/              # Static files
├── src/                 # Source files
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   ├── context/         # React context for state management
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── App.js           # Main application component
│   ├── index.js         # Application entry point
│   └── routes.js        # Application routes
├── .env                 # Environment variables
└── package.json         # Dependencies and scripts
```

### Server
```
server/
├── config/              # Configuration files
├── controllers/         # Request handlers
├── middleware/          # Custom middleware
├── models/              # Mongoose models
├── routes/              # API routes
├── utils/               # Utility functions
├── .env                 # Environment variables
├── index.js             # Server entry point
└── package.json         # Dependencies and scripts
```

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas account or other MongoDB hosting
2. Deploy your server to a hosting service (Heroku, AWS, etc.)
3. Set the environment variables in your hosting service

### Frontend Deployment
1. Build the React application: `cd client && npm run build`
2. Deploy the build folder to a static hosting service (Netlify, Vercel, etc.)
3. Configure the production API URL

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
