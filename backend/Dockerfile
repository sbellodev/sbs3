# root/backend/Dockerfile
FROM php:8.2-apache

WORKDIR /var/www/html

# Install PHP extensions and dependencies
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    && \
    docker-php-ext-install pdo_mysql zip

# Enable Apache rewrite module
RUN a2enmod rewrite

COPY . .

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html