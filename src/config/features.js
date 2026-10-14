// Feature switches for temporarily hidden parts of the site.
// Plain module (no "use client") on purpose: it is imported by the server
// root layout as well as client components. A value exported from a
// "use client" file reaches server components as a client reference
// (always truthy), so switches must live here.

// Navbar dark/light toggle. While false, everyone gets the light look and
// any saved choice is ignored; set to true to restore the toggle.
export const THEME_TOGGLE_ENABLED = false;

// Floating voice-presentation (mic) button.
export const SHOW_VOICE_PRESENTATION = true;

// "MNC App" link in the navbar (the /app page itself stays live).
export const SHOW_APP_NAV_LINK = false;
