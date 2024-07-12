# Use the official Keycloak image as a base
FROM quay.io/keycloak/keycloak:25.0.1

# Install PostgreSQL
USER root
RUN microdnf update -y && microdnf install -y postgresql postgresql-server && microdnf clean all

# Set up PostgreSQL
RUN mkdir -p /var/lib/postgresql/data && chown -R 1000:1000 /var/lib/postgresql/data
RUN su postgres -c "initdb -D /var/lib/postgresql/data"
RUN echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf

# Set environment variables
ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin
ENV DB_VENDOR=postgres
ENV DB_ADDR=localhost
ENV DB_DATABASE=keycloak
ENV DB_USER=keycloak
ENV DB_PASSWORD=keycloak
ENV POSTGRES_DB=keycloak
ENV POSTGRES_USER=keycloak
ENV POSTGRES_PASSWORD=keycloak

# Expose Keycloak port
EXPOSE 8080

# Create a startup script
RUN echo '#!/bin/bash\n\
su postgres -c "pg_ctl start -D /var/lib/postgresql/data"\n\
su postgres -c "psql -c \\"CREATE DATABASE $POSTGRES_DB;\\""\n\
su postgres -c "psql -c \\"CREATE USER $POSTGRES_USER WITH ENCRYPTED PASSWORD '"'"'$POSTGRES_PASSWORD'"'"';\\""\n\
su postgres -c "psql -c \\"GRANT ALL PRIVILEGES ON DATABASE $POSTGRES_DB TO $POSTGRES_USER;\\""\n\
/opt/keycloak/bin/kc.sh start-dev\n\
' > /start.sh && chmod +x /start.sh

# Set the startup command
CMD ["/start.sh"]