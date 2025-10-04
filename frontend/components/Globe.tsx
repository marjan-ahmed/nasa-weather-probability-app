import React, { useRef, useEffect, useState, useCallback } from "react";
import Globe from "react-globe.gl";

// City data from API
export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  admin1?: string;
  country_code?: string;
  id?: number;
}

interface GlobeComponentProps {
  selectedCity: City | null;
  onRotationComplete: () => void;
}

export default function GlobeComponent({
  selectedCity,
  onRotationComplete,
}: GlobeComponentProps) {
  const globeRef = useRef<any>();
  const [isRotating, setIsRotating] = useState(false);

  // Handle city selection and camera movement
  const handleCitySelect = useCallback(
    (city: City) => {
      if (!globeRef.current || isRotating) return;

      setIsRotating(true);

      // Smooth transition to the selected city
      globeRef.current.pointOfView(
        {
          lat: city.lat,
          lng: city.lng,
          altitude: 2.5, // Distance from surface
        },
        2000, // Animation duration in ms
      );

      // Mark rotation as complete after animation
      setTimeout(() => {
        setIsRotating(false);
        onRotationComplete();
      }, 2000);
    },
    [isRotating, onRotationComplete],
  );

  // Trigger rotation when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      handleCitySelect(selectedCity);
    }
  }, [selectedCity, handleCitySelect]);

  // Prepare marker data for selected city with enhanced visuals
  const markerData = selectedCity
    ? [
        {
          lat: selectedCity.lat,
          lng: selectedCity.lng,
          size: 1.2,
          color: "#fbbf24",
          city: selectedCity,
        },
      ]
    : [];

  // Create label data for selected city with better formatting
  const labelData = selectedCity
    ? [
        {
          lat: selectedCity.lat,
          lng: selectedCity.lng,
          text: `${selectedCity.name}${selectedCity.admin1 ? `, ${selectedCity.admin1}` : ""}\n${selectedCity.country}`,
          color: "rgba(255, 255, 255, 0.9)",
          size: 1.5,
          city: selectedCity,
        },
      ]
    : [];

  return (
    <div className="w-full h-full">
      <Globe
        ref={globeRef}
        // Globe appearance
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
//   backgroundColor="#ffffff"   // White background
backgroundColor={''}
        // Disable automatic rotation
        showAtmosphere={true}
         atmosphereColor="lightskyblue"
  atmosphereAltitude={0.25}
        enablePointerInteraction={true}
        animateIn={false}
        // Markers for selected city with enhanced appearance
        pointsData={markerData}
        pointAltitude={0.02}
        pointColor="color"
        pointRadius="size"
        pointResolution={32}
        pointsMerge={false}
        // Labels for selected city with better typography
        labelsData={labelData}
        labelLat="lat"
        labelLng="lng"
        labelText="text"
        labelColor="color"
        labelSize="size"
        labelResolution={4}
        labelAltitude={0.03}
        labelDotRadius={0.6}
        labelDotOrientation={() => "bottom"}
        labelTypeFace={() =>
          'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
        }
        labelIncludeDot={true}
        // Enhanced visual effects
        // Show country borders for better geographic context
        showGlobe={true}
        showGraticules={false}
        // Lighting configuration for realistic appearance
        // NOTE: react-globe.gl does not support a 'lightConfig' prop directly.
        // If you need custom lighting, you must access the Three.js scene via globeRef.current.scene in a useEffect.
        // Initial camera position
        onGlobeReady={() => {
          if (globeRef.current) {
            // Set initial camera position
            globeRef.current.pointOfView(
              {
                lat: 20,
                lng: 0,
                altitude: 2.5,
              },
              0,
            );
            // Set camera controls options
            const controls = globeRef.current.controls();
            if (controls) {
              controls.autoRotate = false;
              controls.autoRotateSpeed = 0;
              controls.enableDamping = true;
              controls.dampingFactor = 0.1;
              controls.enablePan = false;
              controls.enableZoom = true;
              controls.maxDistance = 1000;
              controls.minDistance = 101;
            }
          }
        }}
        // Responsive sizing
        width={typeof window !== "undefined" ? window.innerWidth : 1200}
        height={typeof window !== "undefined" ? window.innerHeight : 800}
      />

      {/* Enhanced marker glow effect overlay */}
      {selectedCity && isRotating && (
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(251, 191, 36, 0.9) 0%, rgba(251, 191, 36, 0.6) 40%, rgba(251, 191, 36, 0.2) 70%, transparent 100%)",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            className="absolute"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0.2) 40%, transparent 70%)",
              animation: "pulse 2s ease-in-out infinite reverse",
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
