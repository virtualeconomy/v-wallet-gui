# build stage
#test
FROM node:9.11.1-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm i -f
COPY . .
RUN npm run build
RUN apk --no-cache add bash openssl \
 && openssl req -new -newkey rsa:2048 -days 3650 -nodes -x509 \
    -subj '/CN=vee-wallet' \
    -keyout vee_wallet.key \
    -out vee_wallet.crt

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY config/nginx.default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/vee_wallet.key /etc/nginx/certs/vee_wallet.key
COPY --from=build-stage /app/vee_wallet.crt /etc/nginx/certs/vee_wallet.crt
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
