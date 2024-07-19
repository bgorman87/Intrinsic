FROM node:22.4.0

WORKDIR /usr/src/app

ARG BACKEND_PORT

ENV BACKEND_PORT=$BACKEND_PORT

COPY package*.json ./
RUN npm install

COPY . .

RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE $BACKEND_PORT

CMD ["npm", "run", "dev"]
