# Build stage
FROM node:20-alpine AS build

# Add libc6-compat for Prisma
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build
RUN npm prune --production

# Production stage
FROM node:20-alpine

# Add libc6-compat for Prisma
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/entrypoint.sh ./entrypoint.sh

# Expose port
EXPOSE 4000

RUN chmod +x entrypoint.sh

# Start the application
ENTRYPOINT ["./entrypoint.sh"]
