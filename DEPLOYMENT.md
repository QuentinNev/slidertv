# Production Deployment Guide

This guide explains how to deploy SliderTV using Docker Compose.

## Prerequisites

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Server** with at least 2GB RAM and 10GB disk space
- **Domain name** (for production)

## Directory Structure

```
/app/slidertv/
├── docker-compose.prod.yml
├── Dockerfile
├── nginx.conf
├── .env.prod              # (create from .env.prod.example)
├── ssl/                   # (optional, for HTTPS)
│   ├── cert.pem
│   └── key.pem
└── ... (rest of project)
```

## Setup Steps

### 1. Configure Production Environment

```bash
cp .env.prod.example .env.prod
nano .env.prod  # Edit with your configuration
```

Required changes in `.env.prod`:
- `APP_KEY`: Generate with `node ace generate:key` (on your local machine)
- `APP_URL`: Your production domain (e.g., https://slidertv.example.com)
- `LOG_LEVEL`: Set to `info` or `warn` for production

### 2. (Optional) Setup SSL/HTTPS

If you have SSL certificates:

```bash
mkdir -p ssl
# Copy your certificates
cp /path/to/cert.pem ssl/cert.pem
cp /path/to/key.pem ssl/key.pem
chmod 600 ssl/key.pem
```

Then uncomment the HTTPS section in `nginx.conf`.

Alternatively, use **Let's Encrypt with Certbot**:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
# Certificates will be in /etc/letsencrypt/live/yourdomain.com/
```

### 3. Build and Start Services

```bash
# Build the Docker image
docker-compose -f docker-compose.prod.yml build

# Start services in background
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 4. Run Database Migrations

```bash
docker-compose -f docker-compose.prod.yml exec app node ace migration:run
```

### 5. Verify Deployment

Check that services are running:

```bash
docker-compose -f docker-compose.prod.yml ps
```

Visit your domain in a browser. You should see the SliderTV login page.

## Managing the Application

### View Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### Restart Services

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Stop Services

```bash
docker-compose -f docker-compose.prod.yml down
```

### Run Commands in App Container

```bash
# Access Node.js shell
docker-compose -f docker-compose.prod.yml exec app node ace tinker

# Run migrations
docker-compose -f docker-compose.prod.yml exec app node ace migration:run

# Seed database
docker-compose -f docker-compose.prod.yml exec app node ace db:seed
```

### Backup Data

Important files to backup:
- `storage/` directory (uploads, images, videos)
- Database (SQLite: `storage/db.sqlite`)
- `.env.prod` file

```bash
# Backup storage
tar -czf slidertv-backup-$(date +%Y%m%d).tar.gz storage/ .env.prod

# Store backup securely
scp slidertv-backup-*.tar.gz backup-server:/backups/
```

### Restore from Backup

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore files
tar -xzf slidertv-backup-*.tar.gz

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Verify
docker-compose -f docker-compose.prod.yml logs -f app
```

## Updating the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild image
docker-compose -f docker-compose.prod.yml build

# Recreate services
docker-compose -f docker-compose.prod.yml up -d

# Run migrations if schema changed
docker-compose -f docker-compose.prod.yml exec app node ace migration:run

# View logs to verify
docker-compose -f docker-compose.prod.yml logs -f app
```

## Performance Optimization

### Nginx Caching

Static files are cached for 30 days. To clear cache:

```bash
# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Database Optimization (if using PostgreSQL)

If you migrate to PostgreSQL for better performance:

1. Update `.env.prod`:
```env
DB_CONNECTION=postgres
DB_HOST=postgres
DB_PORT=5432
DB_USER=slidertv
DB_PASSWORD=<secure-password>
DB_DATABASE=slidertv
```

2. Add PostgreSQL service to `docker-compose.prod.yml`:
```yaml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_USER: slidertv
    POSTGRES_PASSWORD: <secure-password>
    POSTGRES_DB: slidertv
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - slidertv-network
```

## Troubleshooting

### App container exits immediately

```bash
docker-compose -f docker-compose.prod.yml logs app
```

Check error messages. Common issues:
- Invalid `APP_KEY`
- Database migration failed
- Port already in use

### Nginx returns 502 Bad Gateway

```bash
# Check if app is running
docker-compose -f docker-compose.prod.yml ps

# Restart app
docker-compose -f docker-compose.prod.yml restart app

# Check app logs
docker-compose -f docker-compose.prod.yml logs app
```

### High Memory Usage

Check which service is consuming memory:

```bash
docker stats
```

If Node.js app is using too much:
- Increase container memory limit in `docker-compose.prod.yml`
- Check for memory leaks in app logs
- Restart the service

### Storage Permission Issues

```bash
# Ensure storage directory is writable
docker-compose -f docker-compose.prod.yml exec app chmod -R 755 storage

# Or fix from host
sudo chown -R 1000:1000 storage/
```

## Security Checklist

- [ ] Generated unique `APP_KEY`
- [ ] Set `APP_URL` to correct domain
- [ ] Configured SSL/HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Disabled debug logging (`LOG_LEVEL=info`)
- [ ] Set secure session cookie flags
- [ ] Changed default passwords
- [ ] Set up regular backups
- [ ] Configured firewall rules
- [ ] Set up monitoring/alerting

## Monitoring

### Health Check

```bash
curl http://localhost/health
```

### System Resources

```bash
docker stats
```

### Application Logs

```bash
docker-compose -f docker-compose.prod.yml logs --tail=100 -f app
```

## Support

For issues or questions:
1. Check logs: `docker-compose -f docker-compose.prod.yml logs`
2. Verify `.env.prod` configuration
3. Ensure Docker and Docker Compose are up to date
4. Check available disk space: `df -h`
