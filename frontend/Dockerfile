FROM node:alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npm", "run", "dev"]
CMD ["npx", "vite", "--host"]
EXPOSE 3000
EXPOSE 30005

