FROM node:lts-alpine AS builder
WORKDIR /app

# Instalação de dependências global para o monorepo
COPY package*.json ./
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/
COPY apps/backend/prisma ./apps/backend/prisma

RUN npm install

COPY . .

# Build do backend
WORKDIR /app/apps/backend
RUN npm run build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

EXPOSE 3333

WORKDIR /app/apps/backend
CMD ["npm", "start"]
