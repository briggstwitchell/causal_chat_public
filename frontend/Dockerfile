FROM node:20-alpine

# Set the default port
ARG FRONTEND_PORT=3000
ENV FRONTEND_PORT ${FRONTEND_PORT}

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install && npm update
COPY . .
RUN npm install -g serve
RUN npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p

# Use the default port if no environment variable is provided
EXPOSE ${FRONTEND_PORT}
CMD ["sh", "-c", "npm run dev -- --port ${FRONTEND_PORT}"]