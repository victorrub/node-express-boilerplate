# Build
FROM node:16.13.0 as build
WORKDIR /app
ADD package.json .
ADD tsconfig.json .
ADD babel.config.js .
ADD ./src ./src
RUN npm install
RUN npm run build

# Runner
FROM node:16.13.0-alpine
WORKDIR /app
COPY package.json .
COPY --from=build /app/dist ./dist
RUN npm install --only=prod
ENTRYPOINT ["node", "dist/index.js"]

# Expose Server Port
ENV PORT=3333
EXPOSE 3333
