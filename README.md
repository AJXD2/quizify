# Quizify

Quizify is a platform where users can create, share, and take quizzes. Challenge yourself and others, and see how you rank on the leaderboards!

## Key Features

*   **Create & Share Quizzes:** Easily build your own quizzes with various question types and share them with the world.
*   **Engaging Quiz Experience:** Enjoy a smooth and interactive UI while taking quizzes.
*   **Leaderboards:** Compete with other users and climb the ranks.
*   **User Profiles:** Manage your account and track your quiz activity.
*   **Modern UI:** A clean and visually appealing user interface built with Tailwind CSS and DaisyUI.

## Tech Stack

Quizify is built with a modern and powerful tech stack:

*   **Frontend:** [SvelteKit](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [DaisyUI](https://daisyui.com/)
*   **Database:** [Neon.tech](https://neon.tech/) (Serverless Postgres)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
*   **Authentication:** `better-auth`
*   **Form Handling:** `sveltekit-superforms`
*   **Deployment:** [Cloudflare Pages/Workers](https://pages.cloudflare.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   [Bun](https://bun.sh/) (or Node.js and npm/pnpm/yarn)
*   A Neon.tech account and database connection string.

### Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/your_username/quizify.git
    cd quizify
    ```
2.  Install BUN packages:
    ```bash
    bun install
    ```
3.  Set up your environment variables:
    *   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   Fill in your Neon database connection string and other necessary variables in the `.env` file.
4.  Run database migrations:
    ```bash
    bun run db:migrate
    ```
    Alternatively, if you are setting up for the first time or want to push schema changes directly (be cautious with existing data):
    ```bash
    bun run db:push
    ```

### Running Locally

Start the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) in your browser to see the result.

### Running on Cloudflare
Requires [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/)
```bash
wrangler login # Make sure you are logged into cloudflare
wrangler deploy # Can configure custom domain at https://dash.cloudflare.com/
```
## Available Scripts

In the project directory, you can run:

*   `bun run dev`: Runs the app in development mode.
*   `bun run build`: Builds the app for production.
*   `bun run preview`: Runs a local preview of the production build.
*   `bun run check`: Validates your code with SvelteCheck.
*   `bun run lint`: Lints and formats your code with ESLint and Prettier.
*   `bun run format`: Formats your code with Prettier.
*   `bun run db:push`: Pushes schema changes to your database (Drizzle Kit).
*   `bun run db:migrate`: Creates and applies database migration files (Drizzle Kit).
*   `bun run db:studio`: Opens Drizzle Studio to browse your database.
*   `bun run db:generate`: Generates Drizzle ORM client based on your schema.

## Contributing

Contributions are welcome! Please follow these simple guidelines:

*   Be respectful and constructive.
*   Ensure your code follows the existing style and passes linting checks.
*   Test your changes thoroughly.

We appreciate your help in making Quizify better!

## Deployment

This project is configured for deployment on [Cloudflare Pages/Workers](https://pages.cloudflare.com/). The `@sveltejs/adapter-cloudflare` and `wrangler.jsonc` file are set up for this purpose.

## Roadmap

Here are some features planned for the future:

*   More diverse question types (e.g., true/false, matching, fill-in-the-blanks).
*   Enhanced user profiles with statistics and achievements.
*   Quiz categories and tagging for better discovery.
*   Social sharing options for quizzes and results.

## License

Distributed under the MIT License. See `LICENSE` file for more information (or add the license text directly here if no separate file is planned).

---

Happy Quizzing!
