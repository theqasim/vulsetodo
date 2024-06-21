# Todo App

A simple todo list application with user authentication.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have installed Node.js and npm.

## Getting Started

Follow these instructions to set up the project locally.

### 1. Clone the Repository

```sh
git clone https://github.com/theqasim/vulsetodo.git
cd your-repository
```

### 2. Setup 

#### 1. Navigate to the backend directory (vuletodobackend)

```sh
cd ../vulsetodobackend
```

#### 2. Rename the `env.example` file to `.env`

#### 4. Populate the `JWT_SECRET` and `NEXTAUTH_SECRET` with appropiate values:

```sh
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_actual_jwt_secret"
NEXTAUTH_SECRET="your_actual_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### Note: Read Section 5 "Generating Secrets" if you need assistance generating secret values. 

#### 6. Install backend dependencies:

```sh
npm install
```

#### 8. Run the database migration:

```sh
npx prisma migrate dev
```

#### 9. Generate the Prisma client:

```sh
npx prisma generate
```

#### 10. Start the backend server:

```sh
npm run dev
```

#### 11. Navigate to the frontend directory (vulsetodofrontend)

```sh
cd ../vulsetodofrontend
```

#### 12. Rename the `env.example` file to `.env`

#### 13. Populate the `NEXTAUTH_SECRET` with appropiate value:

```sh
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXTAUTH_SECRET="your_actual_nextauth_secret"
DATABASE_URL="file:../vulsetodobackend/prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
```

#### Note: Ensure the `NEXTAUTH_SECRET` is the same in the frontend and backend .env files.

#### 14. Install frontend dependencies:

```sh
npm install
```

#### 15. Start the frontend server:

```sh
npx prisma generate
```

#### 16. Start the frontend server:

```sh
npm run dev
```

### 3. Running Instructions

#### 1. Once both servers are running, you can access the application by navigating to:

```sh
http://localhost:3000
```
##### This will take you to the login page, from there you can navigate to the `register` page to create an account. Once you have registered an account, you will be taken to the dashboard where you can create lists and add items to your lists.


### 4. Running Tests

#### 1. A singular frontend test was written for this application, this can be found in the `tests` folder in the root of the frontend folder named `vulsetodofrontend`. 

#### 2. To run this test navigate to the frontend directory (vulsetodofrontend)

```sh
cd ../vulsetodofrontend
```

#### 3. Run the command below:

```sh
npm playwright test
```

#### Note: The frontend and backend must be running to perform this test.

### 5. Generating Secrets

#### 1. To generate a new `NEXTAUTH_SECRET` and `JWT_SECRET`, you can use the following command:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

