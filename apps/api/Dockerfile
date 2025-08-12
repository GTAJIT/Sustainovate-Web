FROM node

WORKDIR /usr/src/app

COPY package*.json ./

# Install *all* dependencies, not just production
RUN npm install

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
