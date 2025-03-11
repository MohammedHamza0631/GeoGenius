# GeoGenius 🌍

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-007ACC?style=for-the-badge&logo=javascript&logoColor=white)](https://www.javascript.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

GeoGenius is an interactive, modern web application that tests users' knowledge of world capital cities. Challenge yourself with multiple difficulty levels, compete on global leaderboards, and enhance your geography knowledge - all in a sleek, engaging interface.

## 🌟 Features

- **Interactive Quiz Experience**: Test your knowledge of 195 world capitals with a timed, multiple-choice format
- **Multiple Difficulty Levels**: Choose between Easy, Medium, and Hard modes that adjust time constraints and question selection
- **Dynamic Scoring System**: Earn points based on accuracy, speed, and difficulty level
- **Real-time Leaderboard**: Compare your performance with other geography enthusiasts globally
- **Responsive Design**: Enjoy a seamless experience across desktop, tablet, and mobile devices
- **Modern UI/UX**: Engaging animations and stylish design elements enhance the quiz experience

## 🖥️ Demo

[Live Demo](#) - *Coming Soon*

![GeoGenius Screenshot](https://via.placeholder.com/800x450?text=GeoGenius+Screenshot)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- PostgreSQL database (we recommend using NeonDB for easy setup)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/geogenius.git
   cd geogenius
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   DATABASE_URL=YOUR-DATABASE-URL
   ```
   Then edit `.env.local` with your database credentials and other configuration.

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Tech Stack

- **Frontend**: Next.js 14.x, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (hosted on NeonDB)
- **ORM**: Prisma
- **Deployment**: Vercel

## 🌐 User Flow

1. Visit the landing page and learn about GeoGenius
2. Enter username 
3. Toggle leaderboard participation preference
4. Start the quiz and answer capital city questions within the time limit
5. View results showing score, accuracy, and average response time
6. Optionally view the leaderboard or play again


## 🔍 Quiz Mechanics

### Difficulty Levels

- **Easy**: Commonly known countries, more time per question, 1x point multiplier
- **Medium**: Mix of well-known and lesser-known countries, moderate time, 2x point multiplier
- **Hard**: Focus on lesser-known countries, less time per question, 3x point multiplier

### Scoring System

Points are calculated based on:
- Correct answer: Base points (100)
- Speed bonus: Up to 50 additional points for faster answers
- Difficulty multiplier: 1x, 2x, or 3x based on selected difficulty

## 🛣️ Development Roadmap

- [x] Phase 1: Core Quiz Functionality
- [x] Phase 2: Database and Scoring Implementation
- [ ] Phase 3: Leaderboard and UI Polish
- [ ] Future Enhancements:
  - [ ] Additional quiz categories (flags, landmarks)
  - [ ] User accounts with statistics
  - [ ] Achievements system
  - [ ] Multiplayer mode

## 📞 Contact

Contact me [here](https://github.com/MohammedHamza0631)
