FROM quay.io/keycloak/keycloak:25.0.1

# Copy custom providers
COPY keycloak-custom-event-listener/target/custom-event-listener.jar /opt/keycloak/providers/

# Copy custom theme
COPY keycloak-custom-event-listener/purple-theme /opt/keycloak/themes/purple-theme

# Set proper permissions
USER root
RUN chown -R keycloak:keycloak /opt/keycloak/themes/purple-theme
USER keycloak

# Build the optimized Keycloak server
RUN /opt/keycloak/bin/kc.sh build

# Set the health check command
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health/ready || exit 1

# Expose Keycloak port
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

# Set the default command
CMD ["start-dev"]