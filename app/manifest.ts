import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VitaVegan",
    short_name: "VitaVegan",
    description: "Scan, recettes, jauges et mode de vie 100 % vegan.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff7e3",
    theme_color: "#128a48",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
