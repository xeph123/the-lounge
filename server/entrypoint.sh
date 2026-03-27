#!/bin/sh
# Run migrations
npx prisma migrate deploy

# Start the server
npm start
