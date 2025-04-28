# PatientFlow

Agentic Clinical Assistant

## Overview

Uses 2 user-facing agents, one for the patient in `api/p/chat` and `api/chat` for the doctor. The patient agent is a simple chat agent that can ask questions and get answers. The doctor agent is a more complex agent that can ask questions, get answers, and also perform actions on the patient's data and interact with PostgreSQL database.

## Installation

- Clone the repository
- Install the required packages

```bash
npm install
```

- Create a `.env` file in the root directory and add the following environment variables:

```env
OPENAI_API_KEY=sk-...
LOOPS_API_KEY=<your_loops_api_key>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL="postgresql://..."
```

- Create a PostgreSQL database and update the `DATABASE_URL` in the `.env` file with your database connection string.
- Run the following command to create the database tables:

```bash
npx prisma migrate dev --name init
```

- Start the development server:

```bash
npm run dev
```

- Open your browser and go to `http://localhost:3000` to see the application in action.
