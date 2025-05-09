# InsightTrader AI (MVP) - Frontend

This is the frontend application for the InsightTrader AI (MVP) platform. It's built with Next.js, React, and TypeScript, providing a user interface to visualize market data, technical analysis, trade ideas, and manage alerts for BTC/USD.

## Table of Contents

- [Features (Frontend Focus)](#features-frontend-focus)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Frontend Application](#running-the-frontend-application)
- [Key Components](#key-components)
- [Environment Variables](#environment-variables)
- [Interacting with the Backend](#interacting-with-the-backend)
- [Contributing](#contributing)
- [License](#license)

## Features (Frontend Focus)

*   **Dashboard Display:**
    *   Shows current BTC/USD price, trend, and simulated sentiment.
    *   Presents rule-based trade ideas (BUY/SELL/HOLD) from the backend.
*   **Interactive Charting:**
    *   Displays historical price data for BTC/USD using Chart.js.
    *   Visualizes technical indicators like RSI and MACD on sub-charts (or overlays).
*   **Alert Management:**
    *   User interface to set price alerts (e.g., "Notify when BTC > $120,000").
    *   Displays active and triggered alerts.
*   **Responsive Design:**
    *   Styled with Tailwind CSS for a clean and adaptable user interface.
*   **Risk Disclaimer:**
    *   Prominently displays disclaimers about the use of simulated/live data and the nature of AI suggestions.

## Technology Stack

*   Node.js (v18+) & npm/yarn
*   Next.js (React framework)
*   React
*   TypeScript
*   Tailwind CSS
*   Chart.js (via `react-chartjs-2`)
*   `date-fns` (for date utilities with charts)

## Project Structure

insighttrader_frontend/
├── components/ # Reusable React components (Dashboard, Charts, Cards, etc.)
├── lib/ # Utility functions:
│ ├── api.ts # Client for making requests to the backend API
│ └── mockData.ts # (Optional) Frontend mock data for development
├── pages/ # Next.js page components (defining routes)
│ ├── _app.tsx # Custom App component for global styles/layout
│ └── index.tsx # Main dashboard page
├── public/ # Static assets (images, favicon)
├── styles/ # Global CSS, Tailwind CSS configuration
│ └── globals.css
├── types/ # TypeScript type definitions for API responses and props
│ └── index.ts
├── .env.local # Local environment variables (ignored by Git)
├── next.config.js # Next.js configuration
├── postcss.config.js # PostCSS configuration (for Tailwind)
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
├── package.json # Project dependencies and scripts
├── .gitignore
└── README.md # This file


## Prerequisites

*   Node.js 18.x or higher
*   npm 9.x or higher (or Yarn)
*   Git (for version control)
*   A running instance of the `insighttrader_backend` (unless using `NEXT_PUBLIC_USE_MOCK_DATA=true`).

## Setup and Installation

1.  **Clone the repository (if you haven't already) and navigate to this directory:**
    ```bash
    # Assuming you are in the root project directory
    cd insighttrader_frontend
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Set up environment variables:**
    Create a `.env.local` file in the `insighttrader_frontend` root:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:8000/api
    NEXT_PUBLIC_USE_MOCK_DATA=false 
    ```
    *   Set `NEXT_PUBLIC_USE_MOCK_DATA=true` to develop the UI with frontend mock data without needing the backend.

## Running the Frontend Application

1.  Ensure the backend server is running (typically on `http://localhost:8000`) if not using mock data.
2.  Start the Next.js development server from the `insighttrader_frontend` root directory:
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    The frontend application will be available at `http://localhost:3000`.

## Key Components

*   **`pages/index.tsx`**: The main entry point for the dashboard, responsible for fetching data (or using mocks) and managing overall page state.
*   **`components/Dashboard.tsx`**: Orchestrates the layout and display of various informational cards and charts.
*   **`components/PriceChart.tsx`**: Renders the BTC/USD price history chart.
*   **`components/IndicatorChart.tsx`**: (Or similar) Renders charts for RSI, MACD.
*   **`components/TradeIdeaCard.tsx`**: Displays the generated trade idea.
*   **`components/AlertManager.tsx`**: Provides UI for setting and viewing price alerts.
*   **`components/DisclaimerBanner.tsx`**: Shows important risk disclaimers.

## Environment Variables

*   **`NEXT_PUBLIC_API_URL`**: Specifies the base URL of the backend API.
    *   Default: `http://localhost:8000/api`
*   **`NEXT_PUBLIC_USE_MOCK_DATA`**: If set to `true`, the application will use mock data defined in `lib/mockData.ts` instead of calling the backend API. This is useful for UI development or when the backend is unavailable.
    *   Default: `false`

## Interacting with the Backend

The frontend communicates with the backend API (defined by `NEXT_PUBLIC_API_URL`) to:

*   Fetch market data (prices, indicators, sentiment).
*   Request trade ideas.
*   Create, check, and delete price alerts.

All API communication logic is centralized in `lib/api.ts`.

## Contributing

Contributions to the frontend are welcome. Please refer to the main project README for general contribution guidelines. Focus on UI/UX improvements, new component development, or enhancing interactivity.

## License

This project is licensed under the MIT License. See the `LICENSE.md` file in the root project directory.