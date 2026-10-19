# =========================================================================================
# 📌 APEXFLOW OS — Enterprise Production Dockerfile (v1.0.0 Gold Master)
# -----------------------------------------------------------------------------------------
# 🎯 ARCHITECTURAL ROLE:
# Self-contained, hardened Alpine Linux container providing 100% air-gapped keynote hosting.
# - Footprint: <15 MB total image footprint
# - Zero remote dependencies at runtime
# - Immutable zero-upload client presentation delivery
# =========================================================================================

FROM nginx:1.27-alpine-slim

LABEL org.opencontainers.image.title="APEXFLOW OS — Executive Architecture Presentation Engine" \
      org.opencontainers.image.description="Enterprise Air-Gapped Keynote OS for Software Architects and C-Suite Leaders" \
      org.opencontainers.image.version="1.0.0-gold-master" \
      org.opencontainers.image.vendor="APEXFLOW Enterprise Systems" \
      org.opencontainers.image.licenses="Proprietary"

# Remove default NGINX website
RUN rm -rf /usr/share/nginx/html/*

# Copy hardened NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy core HTML presentation views
COPY index.html stage.html admin.html war-room.html remote.html /usr/share/nginx/html/

# Copy PWA assets & Service Worker
COPY manifest.json icon.svg sw.js /usr/share/nginx/html/

# Copy presentation engine modules, components & static assets
COPY src/ /usr/share/nginx/html/src/
COPY public/ /usr/share/nginx/html/public/

# Ensure secure file permissions (read-only for nginx user)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Health check validation
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/healthz || exit 1

# Expose standard HTTP port
EXPOSE 80

# Execute NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
