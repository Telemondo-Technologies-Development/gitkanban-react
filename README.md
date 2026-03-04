# GitKanban Board

## 🚀 The Objective

Your task is to build a functional **Kanban Board** that syncs in real-time with a GitHub Repository. You will use the **GitHub REST API** to treat a repository’s "Issues" as your tasks. This project is designed to test your ability to read documentation, handle authentication securely, and manage complex asynchronous state.

## 🛠 The Tech Stack

- **Framework:** React (Vite recommended)
- **Styling:** Tailwind CSS and ShadCN Components
- **API:** GitHub REST API
- **Backend:** None (Client-side integration only)

## 📋 Core Requirements

### 1. The Setup (Discovery Phase)

- You must create a generic **public repository** on your personal GitHub to act as the database.
- You will need to generate a **Personal Access Token (PAT)** to allow your app to read/write to that repository.
- **Critical Security Constraint:** You must implement a way to use this token without hardcoding it into the codebase.
  - _If a token is committed to the Git history, the task is immediately failed._

### 2. The Board (Read)

The application main view should visualize "Issues" in three distinct columns:

1.  **Todo**
2.  **In Progress**
3.  **Done**

You must determine the logic for how an Issue is sorted into these columns. (Hint: Research how GitHub **Labels** work and how you can map them to UI columns).

### 3. Ticket Management (Write)

- **Create Ticket:** Users should be able to create a new ticket directly from the "Todo" column. This must create a real Issue on GitHub.
- **Move Ticket:** Users must be able to move a ticket from one column to another (e.g., from "Todo" to "In Progress").
  - _Technical expectation:_ This action should update the specific Issue on GitHub to reflect its new status.

## 🧐 Evaluation Criteria

I will be reviewing your code based on the following:

1.  **RTFM (Read The Manual):** Did you find the correct API endpoints for Listing, Creating, and Patching issues without being told which ones to use?
2.  **Architecture:** How did you handle the logic for "moving" a card? Is the state management clean?
3.  **Security:** Is the API token handled via Environment Variables?
4.  **UX/UI:** Does the board provide feedback (loading states) while waiting for the API?

## 🌟 Bonus Points (Stretch Goals)

If you finish early and want to impress:

- Implement **Drag and Drop** for moving cards.
- Add a **Search Bar** to filter issues by title.
- Handle **API Errors** gracefully (e.g., what happens if the network is down?).

## 🔗 Resources

- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

**Good luck.**
