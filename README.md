Project Title

Table of Contents

Introduction

Features

Technologies Used

Installation

Running the Project

Running Tests

API Documentation

Configuration

Contributing

License

Introduction

This project is a backend application built with Express.js and TypeScript. It provides APIs for user authentication and task management, complete with error handling and JWT authentication. The project also includes Swagger for API documentation and CORS support.

Features

User registration and login

Task management (create, read, update, delete)

Error handling middleware

JWT authentication

API documentation with Swagger

Cross-Origin Resource Sharing (CORS)

Technologies Used

Express.js: Fast, unopinionated, minimalist web framework for Node.js

TypeScript: JavaScript with static type definitions

Jest: Delightful JavaScript testing framework

Swagger: API documentation and testing tool

CORS: Middleware to enable CORS with various options

Other dependencies: Various npm packages as needed

Installation

Follow these steps to set up the project locally:

# Clone the repository
git clone https://github.com/Daniel1798-web/to-do-list-API.git

# Navigate into the project directory
cd to-do-list-API

# Install dependencies
npm install

Running the Project

To start the project in development mode:

# Run the development server
npm run dev

Running Tests

To run the tests:

# Run the tests
npm test

API Documentation

Access the Swagger API documentation by starting the server and navigating to:

http://localhost:3000/api-docs

Configuration

Set up the environment variables by creating a .env file with the following content:

PORT=3000
DATABASE_URL=your-database-url
JWT_SECRET=your-secret-key

Contributing

If you wish to contribute:

Fork the repository.

Create a new branch (git checkout -b feature/YourFeature).

Make your changes.

Commit your changes (git commit -m 'Add some feature').

Push to the branch (git push origin feature/YourFeature).

Open a pull request.

License

This project is licensed under the MIT License.