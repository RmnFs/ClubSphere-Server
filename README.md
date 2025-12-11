# ClubSphere Server

## Project Purpose
ClubSphere is a web application that helps people discover, join, and manage local clubs. Ideally suited for community groups, tech meetups, and hobby clubs. This backend powers the ClubSphere platform.

## Live URL
*(Insert deployed server URL here, e.g., on Vercel or Render)*

## Key Features
- **User Authentication**: Secure Firebase-based auth with Role-Based Access Control (Admin, Club Manager, Member).
- **Club Management**: CRUD operations for clubs, with approval workflow.
- **Event Management**: Create and manage events, including paid events.
- **Membership System**: Join clubs (free or paid) and track status.
- **Payments**: Stripe integration for membership fees and paid events.
- **Dashboard API**: Aggregated stats for Admins and Managers.

## Important NPM Packages
- `express`: Web framework.
- `mongoose`: MongoDB object modeling.
- `firebase-admin`: Token verification.
- `stripe`: Payment processing.
- `cors`: Cross-Origin Resource Sharing.
- `dotenv`: Environment variable management.
- `helmet`: Security headers.

## Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone <repo-url>
    cd server
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    STRIPE_SECRET_KEY=your_stripe_secret_key
    FIREBASE_ADMIN_CREDENTIALS=path/to/serviceAccountKey.json
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

## API Documentation
- **Users**: `/api/users`
- **Clubs**: `/api/clubs`
- **Events**: `/api/events`
- **Payments**: `/api/payments`
- **Memberships**: `/api/memberships`
- **Dashboard**: `/api/dashboard`
