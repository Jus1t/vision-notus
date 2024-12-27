FROM nginx:latest

# Copy the React build files to the Nginx HTML directory
COPY build/ /usr/share/nginx/html

# Copy the SSL certificate and key
COPY selfsigned.crt /etc/ssl/certs/selfsigned.crt
COPY selfsigned.key /etc/ssl/private/selfsigned.key

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports 80 and 443
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
