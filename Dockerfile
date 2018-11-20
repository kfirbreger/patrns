FROM nginx:alpine

EXPOSE 80

COPY index.html /usr/share/nginx/html/index.html
COPY patrns.css /usr/local/nginx/html/patrns.css
COPY *.js /usr/local/nginx/html/

