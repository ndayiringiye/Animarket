# Animarket 🐄🐐

Welcome to **Animarket** — an innovative e-commerce and management platform specifically tailored for the buying, selling, and health tracking of livestock and animals.

Animarket seamlessly connects farmers, buyers, sellers, and veterinary professionals to ensure healthy, verified, and safe animal trading.

## 🌟 Key Features

- **Multi-Role System**: Dedicated profiles for `farmers`, `customers`, `sellers`, `veterinary` professionals, and `admins`.
- **Advanced Animal Listings**: Support for various animals (cows, goats, sheep, pigs, horses, chickens) complete with details such as breed, age, health records (vaccinations, diseases), and precise geographical location.
- **Verification & Demand Scoring**: Animals are given verification levels (unverified, basic, veterinary_verified, premium_verified) and calculated market demand scores.
- **Robust Authentication**: Secure registration and login flow with email OTP verification, strict password validation, password hashing (bcrypt), and JWT-based session management.
- **Owner History**: Track the full lineage of previous animal owners and transfer history.
- **Internationalization (i18n)**: Out-of-the-box support for multiple languages on the frontend.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Routing**: React Router DOM
- **Internationalization**: i18next & react-i18next

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ORM
- **Security & Auth**: JSON Web Tokens (JWT), bcrypt, OTP Generator
- **Validation**: Joi & express-validator
- **Mailing**: Nodemailer

## 📁 Project Structure

```text
Animarketing/
├── Backend/                 # Express backend server
│   ├── src/
│   │   ├── controllers/     # API route controllers
│   │   ├── emails/          # Nodemailer OTP and email services
│   │   ├── Middlewares/     # Auth and verification middlewares
│   │   ├── models/          # Mongoose DB Schemas (User, Animal, etc.)
│   │   ├── services/        # Business logic (User registration, login, etc.)
│   │   └── validoators/     # Joi validation schemas
│   ├── .env                 # Backend environment variables
│   └── server.js            # Entry point for backend
│
├── frontend/                # React Vite application
│   ├── src/                 # UI components, pages, and i18n configs
│   └── package.json         # Frontend dependencies
│
└── package.json             # Root level scripts (if applicable)
```

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) and [MongoDB](https://www.mongodb.com/) installed and running on your local machine.

### 1. Clone the repository
```bash
git clone https://github.com/ndayiringiye/Animarket.git
cd Animarketing
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory and add your environment variables (e.g., Database URI, JWT Secret, SMTP credentials):
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add SMTP details for Nodemailer
```

Start the backend server:
```bash
# Assuming 'npm start' or 'node server.js' is configured
node server.js
```

### 3. Setup the Frontend
Open a new terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173` (or similar) and the backend on `http://localhost:5000`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License
This project is licensed under the ISC License.
