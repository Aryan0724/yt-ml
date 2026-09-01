FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
ENV NEXT_PUBLIC_BACKEND_URL=https://api.preyt.integralgroups.in
# Note: For this deployment, API requests should ideally be routed through Nginx, 
# or NextJS server actions/API routes call http://api:8000 internally.
# But client-side fetches need the public URL.
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 3000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
