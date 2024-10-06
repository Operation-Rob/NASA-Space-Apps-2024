// hooks/useLeaflet.ts
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet"; // Import types only

export default function useLeaflet() {
  const LRef = useRef<typeof Leaflet>();
  const [customIcon, setCustomIcon] = useState<Leaflet.Icon | null>(null);
  const [satelliteIcon, setSatelliteIcon] = useState<Leaflet.Icon | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof window !== "undefined") {
        const L = await import("leaflet");
        LRef.current = L;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        const customIcon = new L.Icon({
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
          shadowSize: [41, 41],
        });
        setCustomIcon(customIcon);


        const satelliteIcon = new L.Icon({
            iconUrl:
              "https://cdn.icon-icons.com/icons2/2479/PNG/512/satellite_icon_149781.png",
            iconRetinaUrl:
              "https://cdn.icon-icons.com/icons2/2479/PNG/512/satellite_icon_149781.png",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15],
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            shadowSize: [41, 41],
          });
        setSatelliteIcon(satelliteIcon);
      }
    })();
  }, []);

  return { LRef, customIcon, satelliteIcon };
}
