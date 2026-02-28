# MTG Portfolio Tracker

Full-stack web application to track Magic: The Gathering card investments. Automatically updates portfolio value by scraping StarCityGames market prices.

## Overview

A reliable, containerized tracker that calculates cost basis, current value, absolute PnL, and percentage gains server-side. Resilient background jobs ensure daily price synchronization despite layout variations on external vendors.

## Tech Stack

* **Frontend**: Next.js 13 (App Router), React Server Components, TailwindCSS.
* **Backend**: Node.js, Express, Prisma, PostgreSQL.
* **Scraping**: Puppeteer (Headless Chrome), node-cron.
* **Infrastructure**: Docker, docker-compose, Multi-stage builds.

## Architecture

* **Separation of Concerns**: UI rendering is decoupled from heavy DOM scraping and background chron tasks.
* **Resilient Scraping**: Implements strict fallbacks, 3-attempt retry mechanisms, and error classification (`NOT_FOUND`, `STRUCTURE_CHANGE`, `NETWORK_ERROR`) to prevent application crashes during target HTML modifications.
* **Idempotency**: Daily sync updates existing records rather than duplicating entries.

## Security Considerations

* **API Hardening**: `helmet` manages security headers; `express-rate-limit` prevents API abuse.
* **Input Validation**: `zod` validates payload shapes prior to controller invocation, dropping bad requests cleanly.
* **Data integrity**: Prepared statements via Prisma prevent SQL injection.
* **Execution Isolation**: Dockerfiles enforce `USER nodejs` to prevent root execution vulnerabilities within containers.

## Setup Instructions

### Local Development

1. Ensure Node.js 18+ and PostgreSQL are installed.
2. Clone repository and `cp .env.example .env`.
3. Update `.env` variables.
4. Setup Backend:
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npm run dev

## Future Considerations

1. Better UI 
2. Finds exact card through collector number and other details
3. Allow user to deleate or edit entries  
