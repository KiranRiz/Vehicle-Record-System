FROM nginx:1.27-alpine

COPY frontend/index.html /usr/share/nginx/html/index.html
COPY frontend/style.css /usr/share/nginx/html/style.css
COPY js /usr/share/nginx/html/js
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
