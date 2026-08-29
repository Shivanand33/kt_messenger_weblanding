# KT Messenger backend — production image
#
# Alpine (musl libc) with OpenSSL 3.x. This MUST match the Prisma engine target
# declared in prisma/schema.prisma: `linux-musl-openssl-3.0.x`.
FROM node:20-alpine

# Prisma's query engine dynamically links OpenSSL at runtime. node:20-alpine
# ships Alpine 3.x (OpenSSL 3.x) but does NOT include the openssl package by
# default, so Prisma "fails to detect the libssl/openssl version" and the
# engine cannot find libssl.so.3. Installing openssl provides libssl.so.3 and
# lets Prisma detect the version. (This is why the old image failed looking for
# libssl.so.1.1 — the wrong engine variant against a host with no OpenSSL libs.)
RUN apk add --no-cache openssl

WORKDIR /app

# Copy manifests + the Prisma schema BEFORE install so the `postinstall`
# (`prisma generate`) can find prisma/schema.prisma and build the musl engine
# INSIDE this image (correct arch + OpenSSL for the runtime).
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# App source.
COPY . .

# Prisma client is generated during `npm ci` (postinstall). Regenerate once more
# now that the full schema/source is present — idempotent, cheap, and guarantees
# the client matches the shipped schema.
RUN npx prisma generate

ENV NODE_ENV=production
EXPOSE 4000

# Apply any pending migrations, then start the API.
# DATABASE_URL, JWT_SECRET, R2_*, SMTP_* etc. are supplied at runtime
# (docker run --env-file / platform env vars) — never baked into the image.
CMD ["npm", "run", "start:prod"]
