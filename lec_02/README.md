# Role-Based Authentication System with Node.js & MongoDB

A robust and secure role-based authentication system built with Node.js, Express, MongoDB, and EJS templating engine. This project demonstrates user authentication, authorization, and role-based access control (RBAC) with different user roles.

## Features

- 🔐 User registration and login
- 👥 Role-based access control (Admin, Manager, User)
- 🔒 Protected routes with middleware
- 🍪 Session-based authentication
- 📱 Responsive design with EJS layouts
- 🛡️ CSRF protection
- 🔄 Password hashing with bcrypt
- 📝 Form validation

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Express Session, JWT
- **Frontend**: EJS, HTML5, CSS3, JavaScript
- **Styling**: Custom CSS
- **Development Tools**: Nodemon for development

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd lec_02
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   JWT_SECRET=your_jwt_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
lec_02/
├── config/               # Configuration files
├── controllers/          # Route controllers
├── middleware/           # Custom middleware
├── models/               # Database models
├── public/               # Static files
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   └── images/           # Image assets
├── routes/               # Route definitions
├── views/                # EJS templates
│   ├── layouts/          # Layout templates
│   └── partials/         # Reusable template partials
├── .env                  # Environment variables
├── app.js                # Application entry point
└── package.json          # Project dependencies
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (coming soon!)

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ for educational purposes
- Special thanks to the Express.js and MongoDB communities

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
