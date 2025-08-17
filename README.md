# Nexora Portal (app.nexora.com)

Mock: login, dashboard, productos, suscripciones, instalación con QR.

## Code quality

Run the linter and formatter before committing:

```bash
npm run lint
npm run format
```

## Escanear QR y validar POS

1. En el dashboard, ve a **Instalación** para obtener un código QR con la IP, puerto y token del host.
2. Conecta un dispositivo móvil a la misma red local y escanea el QR para abrir `http://<ip>:<port>`.
3. Si la página carga, el POS es accesible desde la LAN y puede continuar la instalación.
