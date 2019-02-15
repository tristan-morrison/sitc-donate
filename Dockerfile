FROM httpd:2.4

COPY ./dockerconfig/httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./dockerconfig/domain.key /usr/local/apache2/conf/server.key
COPY ./dockerconfig/domain.crt /usr/local/apache2/conf/server.crt
