"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { AddressAutocomplete } from '@/types/booking';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  pickup: AddressAutocomplete | null;
  destination: AddressAutocomplete | null;
  onRouteCalculated: (distance: number, duration: string) => void;
  onRouteError: (error: string) => void;
  isCalculating: boolean;
  resetTrigger: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

export default function MapView({
  pickup,
  destination,
  onRouteCalculated,
  onRouteError,
  isCalculating,
  resetTrigger,
}: MapViewProps) {
  const [pickupCoords, setPickupCoords] = useState<LatLng | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 50.8503, lng: 4.3517 }); // Brussels, Belgium
  const [mapZoom, setMapZoom] = useState(6);

  useEffect(() => {
    if (pickup && destination && !isCalculating) {
      calculateRoute();
    }
  }, [pickup, destination, isCalculating]);

  useEffect(() => {
    // Reset map when resetTrigger changes
    setPickupCoords(null);
    setDestinationCoords(null);
    setRouteCoords([]);
    setMapCenter({ lat: 50.8503, lng: 4.3517 });
    setMapZoom(6);
  }, [resetTrigger]);

  const geocodeAddress = async (address: string): Promise<LatLng | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const calculateRoute = async () => {
    if (!pickup || !destination) return;

    try {
      // Geocode both addresses
      const [pickupCoords, destCoords] = await Promise.all([
        geocodeAddress(pickup.address),
        geocodeAddress(destination.address),
      ]);

      if (!pickupCoords || !destCoords) {
        onRouteError('Unable to find one or both addresses. Please check and try again.');
        return;
      }

      setPickupCoords(pickupCoords);
      setDestinationCoords(destCoords);

      // Get route from OSRM (Open Source Routing Machine)
      const routeResponse = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${pickupCoords.lng},${pickupCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`
      );
      
      const routeData = await routeResponse.json();

      if (routeData.code === 'Ok' && routeData.routes && routeData.routes.length > 0) {
        const route = routeData.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: [number, number]) => ({
          lat: coord[1],
          lng: coord[0],
        }));
        
        setRouteCoords(coordinates);
        
        // Calculate distance and duration
        const distanceMeters = route.distance;
        const durationSeconds = route.duration;
        const durationMinutes = Math.round(durationSeconds / 60);
        const durationText = durationMinutes < 60 
          ? `${durationMinutes} min`
          : `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;

        onRouteCalculated(distanceMeters, durationText);

        // Fit map to show route
        const bounds = L.latLngBounds([
          [pickupCoords.lat, pickupCoords.lng],
          [destCoords.lat, destCoords.lng],
        ]);
        
        // Add some padding to the bounds
        const paddedBounds = bounds.pad(0.1);
        setMapCenter(paddedBounds.getCenter());
        setMapZoom(10); // Will be adjusted by fitBounds
      } else {
        onRouteError('Unable to calculate route. Please check your addresses and try again.');
      }
    } catch (error) {
      console.error('Route calculation error:', error);
      onRouteError('Failed to calculate route. Please try again.');
    }
  };

  const createCustomIcon = (color: string) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[600px] relative">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {pickupCoords && (
          <Marker 
            position={[pickupCoords.lat, pickupCoords.lng]}
            icon={createCustomIcon('#10B981')}
          >
            <Popup>
              <div className="text-sm">
                <strong>Pickup Location</strong>
                <br />
                {pickup?.address}
              </div>
            </Popup>
          </Marker>
        )}
        
        {destinationCoords && (
          <Marker 
            position={[destinationCoords.lat, destinationCoords.lng]}
            icon={createCustomIcon('#EF4444')}
          >
            <Popup>
              <div className="text-sm">
                <strong>Destination</strong>
                <br />
                {destination?.address}
              </div>
            </Popup>
          </Marker>
        )}
        
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords.map(coord => [coord.lat, coord.lng])}
            color="#3B82F6"
            weight={4}
            opacity={0.8}
          />
        )}
      </MapContainer>
      
      {isCalculating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-primary">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <span>Calculating route...</span>
          </div>
        </div>
      )}
    </div>
  );
}