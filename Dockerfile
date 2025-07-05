FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# --- Build Arguments for Vite ---
# Declare arguments that can be passed during the build process.
ARG VITE_APP_CONFIG_NOCODB_URL
ARG VITE_APP_CONFIG_NOCODB_API_KEY
ARG VITE_APP_CONFIG_NOCODB_DATABASE
ARG VITE_APP_CONFIG_NOCODB_ID_TABLE

# --- Environment Variables for the Build Stage ---
# Set the arguments as environment variables for the build process to use.
ENV VITE_APP_CONFIG_NOCODB_URL=$VITE_APP_CONFIG_NOCODB_URL
ENV VITE_APP_CONFIG_NOCODB_API_KEY=$VITE_APP_CONFIG_NOCODB_API_KEY
ENV VITE_APP_CONFIG_NOCODB_DATABASE=$VITE_APP_CONFIG_NOCODB_DATABASE
ENV VITE_APP_CONFIG_NOCODB_ID_TABLE=$VITE_APP_CONFIG_NOCODB_ID_TABLE

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the application
# The build process will now have access to the VITE_... variables.
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
