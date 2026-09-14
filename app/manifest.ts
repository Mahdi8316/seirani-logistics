import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} | ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#181a1d",
    theme_color: "#181a1d",
    lang: "fa",
    dir: "rtl",
    icons: [
      {
        src: "/assets/logo.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
