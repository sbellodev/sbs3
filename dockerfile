# Stage 1: Build React frontend
FROM node:18-alpine as react-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: PHP backend + Serve React
FROM php:8.2-apache
WORKDIR /var/www/html

# Install PHP extensions (MySQL, JSON, etc.)
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy PHP backend
COPY backend/ .

# Copy built React files from Stage 1
COPY --from=react-build /app/build /var/www/html/frontend

# Configure Apache to:
# 1. Serve PHP from /backend
# 2. Serve React from /frontend
RUN echo "\
<VirtualHost *:80>\n\
  DocumentRoot /var/www/html/frontend\n\
  Alias /api /var/www/html\n\
  <Directory /var/www/html>\n\
    Options -Indexes\n\
    AllowOverride All\n\
  </Directory>\n\
</VirtualHost>\n\
" > /etc/apache2/sites-available/000-default.conf

# Enable Apache mod_rewrite
RUN a2enmod rewrite