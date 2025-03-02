# Use an official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package.json /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
RUN npm install

# Copy the entire src directory into the container (and other necessary files)
COPY . .

# Expose port 4200 for Angular development server
EXPOSE 4200

# Start the Angular application using ng serve
CMD ["ng", "serve", "--host", "0.0.0.0"]

