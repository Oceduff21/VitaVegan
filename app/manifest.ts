import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VitaVegan",
    short_name: "VitaVegan",
    description: "Scan, recettes, jauges et mode de vie 100 % vegan.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F1E8",
    theme_color: "#1F4D3A",
    lang: "fr",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
