FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
RUN npm run build

FROM node:18-slim AS production
WORKDIR /app
COPY --from=build /app/build /app/build
RUN npm install -g serve
EXPOSE 4000
CMD ["serve", "-s", "build", "-l", "4000"]
