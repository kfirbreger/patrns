FROM nginx:alpine

EXPOSE 80

COPY index.html /usr/share/nginx/html
COPY patrns.css/usr/local/nginx/html
COPY *.js /usr/local/nginx/html

