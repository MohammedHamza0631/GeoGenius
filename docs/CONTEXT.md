# Capital Cities Quiz - Product Requirements Document

## Project Overview

Capital Cities Quiz is an interactive web application that tests users' knowledge of world capital cities. The application features a visually appealing interface with modern design elements, multiple difficulty levels, and a competitive leaderboard system. The quiz challenges users to identify the capital cities of 195 countries across the globe in a timed, multiple-choice format.

## Target Audience

- Geography enthusiasts
- Students learning about world geography
- Casual trivia fans
- Educational institutions
- Anyone looking to improve their knowledge of world capitals

## Core Features

### 1. Quiz Experience

#### 1.1 Initial Setup
- Users enter a username before starting the quiz
- Users select difficulty level: Easy, Medium, or Hard
- Users can toggle whether they want their scores saved to the leaderboard
- Clear instructions provided before quiz begins

#### 1.2 Quiz Mechanics
- Multiple-choice format with 4 options per question
- Timed questions with visual countdown
- Increasing difficulty as the quiz progresses:
  - Time allocation decreases as users advance through questions
  - Easy: More time per question, commonly known countries
  - Medium: Moderate time per question, mix of known and lesser-known countries
  - Hard: Less time per question, focus on lesser-known countries

#### 1.3 Scoring System
- Points awarded based on:
  - Correct answers
  - Speed of response (faster responses earn more points)
  - Difficulty level (harder levels have higher point multipliers)
- Running score displayed during quiz
- Final score calculation and display at quiz completion

### 2. User Interface

#### 2.1 Design Elements
- Modern SaaS aesthetic design
- Responsive layout that works across devices (desktop, tablet, mobile)
- Engaging animations using framer and transitions between questions
- Stylish timer visualization
- Appropriate color coding for difficulty levels and time pressure
- Gradient elements like modern SaaS for visual interest

#### 2.2 Quiz Components\
- Landing Page marketing/promoting the quiz like a modern SaaS would do with an option to start the quiz
- Welcome/start screen with username input and difficulty selection
- Question screen with:
  - Current question number and total
  - Country name prominently displayed
  - Four answer options in a grid or list
  - Visual timer with color changes as time decreases
  - Current score
- Results screen showing:
  - Final score
  - Number of correct answers
  - Average response time
  - Option to play again
  - Link to leaderboard

### 3. Leaderboard System

#### 3.1 Functionality
- Displays top scores across all difficulty levels
- Filterable by difficulty level
- Shows username, score, date/time, and difficulty
- Updated in real-time when new high scores are achieved
- Limited to top 100 scores to maintain performance

#### 3.2 User Privacy
- Only usernames displayed, that is asked from the user (no personal information required)
- Option to opt out of leaderboard at quiz start
- User data for those who opt out is not stored in the database

## Technical Requirements

### 1. Frontend

#### 1.1 Technology Stack
- Next.js 14.x for the application framework
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Context API for state management

#### 1.2 Performance Requirements
- Initial load time under 2 seconds
- Smooth transitions between questions (no noticeable lag)
- Responsive across all screen sizes

### 2. Backend

#### 2.1 Technology Stack
- Next.js API Routes for backend functionality
- PostgreSQL (hosted on NeonDB) for database
- Appropriate ORM/query builder (Prisma or similar)

#### 2.2 Database Schema
- Decide on the best way to implement this

### 3. Security & Performance

#### 3.1 Security Measures
- Input validation for all user inputs
- Rate limiting on API endpoints
- Protection against common web vulnerabilities
- No collection of personal user data

#### 3.2 Performance Optimization
- Database indexing for efficient leaderboard queries
- Caching strategies for quiz questions
- Optimized images and assets
- Lighthouse score targets:
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+

## User Flows

### 1. New User Flow
1. User visits the website and explores the landing page, if he wants then proceeds on to play the quiz
2. User enters username
3. User selects difficulty level
4. User toggles leaderboard participation
5. User clicks "Start Quiz" button
6. Quiz begins with first question
7. User completes quiz by answering all questions or running out of time(Decide on quiz ending strategy, every user cannot be allowed to play total 195 questions and explain your choices/approach)
8. Results page displays with score and statistics
9. User can choose to play again or view leaderboard

### 2. Returning User Flow
1. User visits the website
2. (Optional) User may see a welcome back message if browser storage has previous username
3. User follows same flow as new user

### 3. Leaderboard Interaction Flow
1. User clicks on "Leaderboard" from home page or results page
2. Leaderboard displays with default sorting (highest scores first)
3. User can filter by difficulty level
4. User can return to home page to start new quiz

## Development Phases

### Phase 1: Core Quiz Functionality
- I have Set up project with Next.js, Tailwind, and shadcn/ui
- Implement quiz mechanics and question flow
- Create timer functionality
- Design and implement UI for quiz screens

### Phase 2: Database and Scoring
- Set up PostgreSQL database on NeonDB
- Implement API routes for quiz data and scoring
- Create user score tracking
- Implement difficulty progression

### Phase 3: Leaderboard and Polish
- Develop leaderboard functionality
- Polish the Home Page
- Implement animations and transitions
- Optimize performance
- Conduct testing across devices and browsers


## Future Enhancements (Post-MVP)

- Additional quiz categories (flags, languages, landmarks)
- User accounts with persistent statistics
- Social sharing functionality
- Achievements/badges system
- Multiplayer mode for real-time competition
- Progressive Web App (PWA) implementation for offline play
- Localization to multiple languages

## Technical Dependencies

- NeonDB for PostgreSQL hosting
- Vercel for application hosting and deployment
- Next.js and React for frontend framework
- Tailwind CSS and shadcn/ui for styling
- PostgreSQL for database

## Success Metrics

- User engagement: Average quiz completion rate > 80%
- Return rate: > 30% of users return to play again
- Leaderboard participation: > 60% of users opt to save scores
- Performance: Consistent Lighthouse scores above 90
- User satisfaction: Measured through feedback forms or surveys

## Constraints and Considerations

- Mobile responsiveness is critical as many users will access via mobile devices
- Quiz should function well on lower-end devices and slower connections
- Database queries should be optimized to handle potential scaling if the app becomes popular
- Design should be accessible and follow WCAG guidelines