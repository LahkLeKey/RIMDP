FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN pnpm install --frozen-lockfile --filter @rimdp/web --filter @rimdp/shared

COPY apps/web apps/web
COPY packages/shared packages/shared

RUN pnpm --filter @rimdp/shared build

EXPOSE 5173

ENV VITE_API_URL=http://host.docker.internal:4000

CMD ["pnpm", "--filter", "@rimdp/web", "dev", "--host", "0.0.0.0", "--port", "5173"]