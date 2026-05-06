# SliderTV

A multi-tenant web application for managing dynamic TV display content. Display rotating slides, live weather, news, and customizable branding on connected screens.

## Prerequisites

### For Local Development
- **Node.js** >= 24.0.0
- **npm** >= 11.0.0

### For Docker Deployment
- **Docker** and **Docker Compose**
- **Git** (for version control)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slidertv
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` and set the required values:

```env
# Node Configuration
TZ=UTC
PORT=3333
HOST=localhost
NODE_ENV=development

# Application
LOG_LEVEL=info
APP_KEY=<generate-a-random-key-or-use-node-ace-generate-key>
APP_URL=http://localhost:3333

# Session Configuration
SESSION_DRIVER=cookie
DRIVE_DISK=fs
```

To generate an `APP_KEY`, run:

```bash
node ace generate:key
```

### 4. Initialize the Database

The project uses SQLite by default. Run migrations to create the database schema:

```bash
node ace migration:run
```

### 5. (Optional) Seed the Database

To populate the database with initial data:

```bash
node ace db:seed
```

## Running the Application

### Option 1: Local Development

Start the development server with hot module reloading (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:3333`

### Option 2: Docker

Build and run the application in a Docker container:

```bash
docker-compose up -d
```

The application will be available at `http://localhost:3333`

To stop the container:

```bash
docker-compose down
```

To view logs:

```bash
docker-compose logs -f slidertv-app
```

### Available Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run start` | Run the production build |
| `npm run test` | Run tests |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
├── app/
│   ├── controllers/       # HTTP request handlers
│   ├── middleware/        # Request middleware
│   ├── models/           # Database models
│   ├── services/         # Business logic services
│   └── validators/       # Input validation
├── inertia/
│   ├── components/       # React components
│   └── pages/           # React page components
├── database/
│   ├── migrations/       # Database schema changes
│   └── seeders/         # Database seed files
├── start/
│   └── routes.ts        # Application routes
├── config/              # Configuration files
└── public/              # Static assets
```

## Key Features

- **Multi-Tenant Architecture**: Manage multiple independent TV displays with separate configurations
- **Slide Management**: Create, update, and schedule content slides with media support
- **Weather Integration**: Real-time weather display with location configuration
- **News Ticker**: RSS feed integration for dynamic news updates
- **Customizable Branding**: Tenant-specific color schemes and styling
- **Real-Time Updates**: Server-Sent Events (SSE) for instant display updates
- **Authentication**: Secure admin and tenant user management

## Database

The application uses SQLite with Lucid ORM. Key models include:

- **User**: Admin and tenant users with role-based access
- **Tenant**: Multi-tenant configuration and isolation
- **Slide**: Content slides with media and scheduling
- **WeatherLocation**: Configured weather display locations
- **AppSetting**: Tenant-specific styling and configuration

## Troubleshooting

### Port Already in Use

If port 3333 is already in use, change it in `.env`:

```env
PORT=3334
```

### Database Errors

Reset the database:

```bash
node ace migration:fresh
node ace db:seed
```

### HMR Not Working

Ensure `localhost` is properly configured and try clearing the browser cache. If issues persist, restart the dev server.

### Missing APP_KEY

Generate a new key:

```bash
node ace generate:key
```

## Development Tips

- Use `node ace tinker` to interact with the application in a REPL
- Check logs in the console for detailed error messages
- Database migrations are in `database/migrations/`
- React components use TypeScript for type safety
- Controllers handle request routing and business logic

## License

UNLICENSED
