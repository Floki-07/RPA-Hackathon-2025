# 🚀 FeedBot – AI-Powered Feedback Management System 🤖

FeedBot is a full-stack MERN application integrated with Robotic Process Automation (RPA) and AI to streamline student feedback collection, analysis, and visualization. It enables administrators to manage faculty and course feedback efficiently while automating the evaluation process.

## 🎯 How It Works?  
1️⃣ **Students** submit feedback on different faculty members and courses via the frontend.  
2️⃣ **Admins** can download the collected feedback as an **Excel file**.  
3️⃣ **RPA triggers an AI model** to analyze and quantify the feedback, providing structured ratings.  
4️⃣ **A detailed report** is generated and can be downloaded or visualized on the frontend.

## 🌟 Key Features  
✅ **User-Friendly Feedback Collection** – Students can easily submit course and faculty feedback.  
✅ **Admin Control Panel** – Admins can manage courses, faculty, and download feedback reports.  
✅ **AI-Powered Analysis** – RPA processes raw feedback to generate structured ratings.  
✅ **Excel Report Generation** – Feedback data is downloadable in an Excel format.  
✅ **Data Visualization** – Reports are displayed using interactive graphs and charts.

## 🛠️ Tech Stack  
- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **Automation:** RPA (UiPath or Python-based automation)  
- **AI Integration:** Sentiment Analysis & Feedback Quantification  


## Project Structure

```
Your folder/
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
git clone https://github.com/Floki-07/RPA-Hackathon-2025.git
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
   nodemon ./app.js`
   
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

4. Start the client:
 

## Available Scripts

### Server

- `nodemon ./app.js`: Starts the server in development mode with nodemon

### Client

- `npm run dev`: Starts the development server
- 

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

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
