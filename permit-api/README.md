# README.md

# Permit API

This project is a REST API server built with Node.js and JavaScript, designed for managing special permits. It features CRUD endpoints and utilizes PostgreSQL as the relational database management system. The API is secured with JWT authentication.

## Features

- User authentication (login and registration)
- CRUD operations for permits
- JWT-based authentication for secure access
- Input validation for requests

## Project Structure

```
permit-api
├── src
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── app.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd permit-api
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your database connection string and JWT secret.

## Usage

To start the server, run:

```
node src/app.js
```

The server will be running on `http://localhost:3000`.

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login an existing user

- **Permits**
  - `GET /api/permits` - Retrieve all permits
  - `GET /api/permits/:id` - Retrieve a specific permit by ID
  - `POST /api/permits` - Create a new permit
  - `PUT /api/permits/:id` - Update an existing permit
  - `DELETE /api/permits/:id` - Delete a permit

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
