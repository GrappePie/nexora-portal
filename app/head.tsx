// Root-level <head> additions for favicons/meta
export default function Head() {
  return (
    <>
      {/* Modern SVG favicon (auto light/dark via CSS inside the SVG) */}
      <link rel="icon" type="image/svg+xml" href="/favicon-auto.svg" />

      {/* PNG fallbacks for older browsers */}
      <link rel="alternate icon" type="image/png" sizes="32x32" href="/icon-32.png" />
      <link rel="alternate icon" type="image/png" sizes="16x16" href="/icon-16.png" />

      {/* iOS PWA icon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/icon-512.png" />

      {/* PWA colors */}
      <meta name="theme-color" content="#111827" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </>
  );
}
