# nestjs/Dockerfile
FROM node:22-alpine3.18

WORKDIR /app

COPY package*.json ./

# 개발 환경에서 필요한 모든 패키지 설치
RUN npm install
RUN npm install glob rimraf cross-env

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
