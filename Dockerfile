# Stage 1: Build the Vite app
FROM node:18 as build
WORKDIR /app

# Copy package files first to optimize Docker layer caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the Vite project
RUN yarn run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy Vite build output to Nginx's serving directory
COPY --from=build /app/dist /usr/share/nginx/html/blog_react

# Expose port 80
EXPOSE 80

