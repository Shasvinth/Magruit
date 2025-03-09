# Fruit Match Lottery - Mobile PWA

A mobile-first Progressive Web App (PWA) for a simple lottery game called 'Fruit Match Lottery Ticket System'. The app allows users to spin once per day, displaying a 3x3 grid with random fruit symbols. Users win if they match three identical fruits in a row, column, or diagonal.

## Features

- **User Authentication**: Email and password-based login and registration
- **Daily Lottery Game**: Each user can play once per day
- **Mobile-First Design**: Fully responsive UI optimized for mobile devices
- **PWA Support**: Installable on mobile devices with offline capabilities
- **Admin Dashboard**: View users who played and won
- **Game History**: Users can view their past game results

## Technologies Used

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Authentication & Database**: Firebase (Authentication and Firestore)
- **PWA**: next-pwa for Progressive Web App functionality

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fruit-match-lottery
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Set up Authentication with Email/Password
   - Create a Firestore database

4. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
# or
yarn build
```

## PWA Installation

The app can be installed as a PWA on mobile devices:

1. Open the website in a mobile browser (Chrome, Safari, etc.)
2. For iOS: Tap the Share button and select "Add to Home Screen"
3. For Android: Tap the menu button and select "Install App" or "Add to Home Screen"

## Admin Access

To create an admin user:

1. Register a new user through the app
2. In Firebase Console, go to Firestore Database
3. Find the user document in the "users" collection
4. Edit the document and set `isAdmin` field to `true`

## License

This project is licensed under the MIT License - see the LICENSE file for details.
