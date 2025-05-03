# Stage 1: Build React frontend
FROM node:18-alpine as react-build
WORKDIR /app

# Cache dependencies layer
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --silent

# Build app
COPY frontend/ .
RUN npm run build

# Stage 2: PHP backend + Serve React
FROM php:8.2-apache
WORKDIR /var/www/html

# Install system dependencies and PHP extensions in one layer
RUN apt-get update && apt-get install -y \
    libzip-dev \
    libpng-dev \
    && docker-php-ext-install -j$(nproc) \
    mysqli \
    pdo \
    pdo_mysql \
    zip \
    gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configure Apache with optimized settings
RUN a2enmod rewrite headers && \
    echo "\
ServerSignature Off\n\
ServerTokens Prod\n\
<VirtualHost *:80>\n\
  DocumentRoot /var/www/html/frontend\n\
  Alias /api /var/www/html\n\
  <Directory /var/www/html>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
  </Directory>\n\
  <Directory /var/www/html/frontend>\n\
    Options -Indexes +FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    # Enable Gzip compression\n\
    <IfModule mod_deflate.c>\n\
      AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript\n\
    </IfModule>\n\
    # Cache static assets\n\
    <FilesMatch \"\.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$\">\n\
      Header set Cache-Control \"public, max-age=31536000, immutable\"\n\
    </FilesMatch>\n\
  </Directory>\n\
  # Redirect server errors to the static page /50x.html\n\
  ErrorDocument 500 /50x.html\n\
  ErrorDocument 502 /50x.html\n\
  ErrorDocument 503 /50x.html\n\
  ErrorDocument 504 /50x.html\n\
</VirtualHost>\n\
" > /etc/apache2/sites-available/000-default.conf

# Copy backend files
COPY backend/ .

# Copy built React files from Stage 1
COPY --from=react-build /app/build /var/www/html/frontend

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && \
    find /var/www/html -type d -exec chmod 755 {} \; && \
    find /var/www/html -type f -exec chmod 644 {} \;

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1

# Optimize PHP configuration
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    { \
        echo 'expose_php = Off'; \
        echo 'memory_limit = 128M'; \
        echo 'upload_max_filesize = 10M'; \
        echo 'post_max_size = 12M'; \
        echo 'max_execution_time = 30'; \
        echo 'opcache.enable = 1'; \
        echo 'opcache.memory_consumption = 128'; \
        echo 'opcache.max_accelerated_files = 4000'; \
        echo 'opcache.revalidate_freq = 60'; \
    } >> "$PHP_INI_DIR/php.ini"

EXPOSE 80