# BizPilot — Project Setup Guide

## Prerequisites (Install First)

### 1. Install Laragon (PHP + MySQL + Composer + Apache)
> Download from: https://laragon.org/download/

- Download **Laragon Full** (includes PHP 8.3, MySQL 8.0, Composer, Git, Node.js)
- Install to default path: `C:\laragon`
- Start Laragon → click **Start All**
- Verify in terminal: `php --version` and `composer --version`

### 2. Node.js (already installed ✅)
- v24.14.0 detected on this machine

---

## Project Bootstrap (Run Once After Laragon is Installed)

Open **PowerShell** or the **Laragon Terminal** inside this `bizpilot/` folder and run:

```powershell
# Step 1 — Install Laravel (run from inside the bizpilot/ directory)
composer create-project laravel/laravel . --prefer-dist

# Step 2 — Install Laravel Breeze with Inertia + React preset
# (This installs: Inertia.js, React, Vite, Tailwind CSS, and auth scaffolding in one command)
composer require laravel/breeze --dev
php artisan breeze:install react --ssr=false

# Step 3 — Install additional frontend packages
npm install framer-motion @headlessui/react @heroicons/react

# Step 4 — Set up local environment
copy .env.example .env
php artisan key:generate

# Step 5 — Create local database
# Open http://localhost/phpmyadmin -> create database: bizpilot_local
# Then update .env: DB_DATABASE=bizpilot_local

# Step 6 — Run migrations and start dev server
php artisan migrate
npm run dev
# In a second terminal:
php artisan serve
```

Open http://127.0.0.1:8000 — BizPilot is running locally.

---

## Production Deployment (One-Time cPanel Setup)

1. cPanel > MySQL Databases > Create database `bizpilot_prod`, user, assign ALL PRIVILEGES
2. cPanel > Domains > set document root to `bizpilot/public`
3. SSH into server and run:

```bash
cd ~/public_html
git clone https://github.com/YOUR_USERNAME/bizpilot.git bizpilot
cd bizpilot
composer install --no-dev --optimize-autoloader
cp .env.example .env
# Edit .env with production DB credentials
php artisan key:generate
php artisan migrate --force
php artisan storage:link
php artisan optimize
```

4. Add GitHub Secrets (Settings > Secrets > Actions):
   - `CPANEL_HOST` — your server IP
   - `CPANEL_USERNAME` — SSH username
   - `SSH_PRIVATE_KEY` — your SSH private key content

### After Initial Setup
Just `git push origin main` — GitHub Actions deploys automatically.
