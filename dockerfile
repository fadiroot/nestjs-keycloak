FROM quay.io/keycloak/keycloak:25.0.1

# Copy custom providers if needed
COPY keycloak-custom-event-listener/target/custom-event-listener.jar /opt/keycloak/providers/

# Copy realm configuration
# Set the health check command
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 CMD curl -f http://localhost:8080/health/ready || exit 1

# Expose Keycloak port
EXPOSE 8080

# The entrypoint is already set in the base image, so we don't need to specify it here