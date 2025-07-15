# Memento ✍️

Memento is a modern blog web application built with **Vite + React + TypeScript**. It features a clean UI and supports full blog functionality, including story creation, rich-text editing, interactivity with like-comment, token-based authentication, and more.

## 🚀 Features

- 📝 Story CRUD with a Rich Text Editor
- 👤 User & Admin Roles with Token-based Authentication
- 🌐 Global Search across stories
- 👍 Like & Comment feature
- 🌍 Localization (i18n) – English, Norwegian & Bengali
- 🔄 Pagination & Load More
- ⚙️ User Profile & Settings
- 🔒 Secure Login, JWT handling

## 🛠 Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Fetch api, React Query
- **Routing**: React Router
- **Localization**: i18next
- **Auth**: JWT-based Auth

## ⚙️ Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

- Backend API running ([memento-backend](https://github.com/sakib62/memento-backend))

### 1. Clone the Repository

```bash
git clone https://github.com/Sakib62/memento-frontend.git
cd memento-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the root directory and add the following:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Start the Development Server

```
npm run dev
```
