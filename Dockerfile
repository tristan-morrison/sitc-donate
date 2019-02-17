FROM php:7.2-apache

RUN a2enmod ssl
RUN a2ensite default-ssl

#COPY ./dockerconfig/httpd.conf /usr/local/apache2/apache2.conf
COPY ./dockerconfig/domain.key /etc/ssl/private/ssl-cert-snakeoil.key
COPY ./dockerconfig/domain.crt /etc/ssl/certs/ssl-cert-snakeoil.pem
