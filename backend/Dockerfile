FROM php:8.2-apache

WORKDIR /var/www/html

# Install system dependencies and PHP extensions
RUN apt-get update && \
    apt-get install -y \
    libzip-dev \
    zip \
    git \
    && \
    docker-php-ext-install pdo pdo_mysql mysqli zip && \
    docker-php-ext-enable mysqli

# Enable Apache rewrite module
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html