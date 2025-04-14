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

Environment Variables:

#### Development Environment Variables

#### DATABASE_URL=postgres://spclpermitadmin:myp3rm1t@apps.laoagcity.gov.ph:5432/spclpermitdb

#### DATABASE_URL=postgres://localhost:5432/permitdb

#### API_PORT=3021

#### NODE_ENV=development

#### DB_USER_DEV=dbadmin

#### DB_PASSWORD_DEV=dbpasswd

#### DB_NAME_DEV=dbname_dev

#### DB_HOST_DEV=dbadmin

#### DB_PORT_DEV=5432

#### DB_USER_TEST=dbadmintest

#### DB_PASSWORD_TEST=dbpass

#### DB_NAME_TEST=dbname_test

#### DB_HOST_TEST=dbhost

#### DB_PORT_TEST=5432

#### DB_USER_PROD=dbadminprod

#### DB_PASSWORD_PROD=dbpass

#### DB_NAME_PROD=dbname

#### DB_HOST_PROD=dbhost

#### DB_PORT_PROD=5432

#### JWT_SECRET='secret string'

To start the server, run:

```
node src/app.js
```

The server will be running on `http://localhost:{API_PORT}`.

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
