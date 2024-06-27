# Usar una imagen base de Node.js
FROM node:20-slim AS base
WORKDIR /usr/app

# Etapa de construcción
FROM base AS build
COPY package.json package-lock.json ./
RUN npm install --production
COPY . ./
RUN npm install @nestjs/cli
RUN node node_modules/puppeteer/install.mjs
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Etapa final
FROM base
RUN apt-get update \
    && apt-get install -y wget gnupg xvfb \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /usr/app ./
ENV PATH /usr/app/node_modules/.bin:$PATH
ENV DISPLAY=:99

CMD ["sh", "-c", "xvfb-run -a --server-args='-screen 0 1920x1080x24' npm start"]
# CMD ["npm", "start"]
