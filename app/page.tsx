"use client";

import React, { useState } from 'react';
import BookingForm, { FormData } from '@/components/BookingForm';
import MapView from '@/components/MapView';
import Summary from '@/components/Summary';
import BookingConfirmation from '@/components/BookingConfirmation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLeafletMaps } from '@/hooks/useGoogleMaps';
import { RouteInfo, AddressAutocomplete, Booking } from '@/types/booking';
import { calculatePrice } from '@/utils/price';
import { saveBooking, generateBookingId } from '@/utils/storage';

export default function Home() {
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [currentPickup, setCurrentPickup] = useState<AddressAutocomplete | null>(null);
  const [currentDestination, setCurrentDestination] = useState<AddressAutocomplete | null>(null);

  const { isLoaded: isMapsLoaded, error: mapsError } = useLeafletMaps();

  const handleCalculateRoute = (pickup: AddressAutocomplete, destination: AddressAutocomplete) => {
    setError(null);
    setIsCalculating(true);
    setCurrentPickup(pickup);
    setCurrentDestination(destination);
  };

  const handleRouteCalculated = (distance: number, duration: string) => {
    const price = calculatePrice(distance);
    setRouteInfo({ distance, duration, price });
    setIsCalculating(false);
  };

  const handleRouteError = (errorMessage: string) => {
    setError(errorMessage);
    setIsCalculating(false);
    setRouteInfo(null);
  };

  const handleBookNow = (formData: FormData) => {
    if (!routeInfo || !formData.pickup || !formData.destination) return;

    const booking: Booking = {
      id: generateBookingId(),
      name: formData.name,
      passengers: formData.passengers,
      pickup: formData.pickup.address,
      destination: formData.destination.address,
      dateTime: formData.dateTime,
      distance: routeInfo.distance / 1000, // Convert to km for storage
      duration: routeInfo.duration,
      price: routeInfo.price,
      timestamp: new Date().toISOString(),
    };

    saveBooking(booking);
    setConfirmedBooking(booking);
  };

  const handleReset = () => {
    setRouteInfo(null);
    setError(null);
    setIsCalculating(false);
    setCurrentPickup(null);
    setCurrentDestination(null);
    setResetTrigger(prev => prev + 1);
  };

  const handleNewBooking = () => {
    setConfirmedBooking(null);
    handleReset();
  };

  if (mapsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {mapsError}. Please check your map configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isMapsLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-primary">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <BookingConfirmation 
            booking={confirmedBooking} 
            onNewBooking={handleNewBooking}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Car Transfer Service</h1>
          <p className="text-lg text-gray-600">Book your reliable door-to-door transfer</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form and Summary */}
          <div className="space-y-6">
            <BookingForm
              onCalculateRoute={handleCalculateRoute}
              onBookNow={handleBookNow}
              onReset={handleReset}
              routeInfo={routeInfo}
              isCalculating={isCalculating}
              error={error}
            />
            <Summary routeInfo={routeInfo} />
          </div>

          {/* Right Column - Map */}
          <div className="relative">
            <MapView
              pickup={currentPickup}
              destination={currentDestination}
              onRouteCalculated={handleRouteCalculated}
              onRouteError={handleRouteError}
              isCalculating={isCalculating}
              resetTrigger={resetTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
}