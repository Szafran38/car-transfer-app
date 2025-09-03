"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, Users, MapPin, Calendar, RotateCcw } from 'lucide-react';
import { RouteInfo, AddressAutocomplete } from '@/types/booking';

interface BookingFormProps {
  onCalculateRoute: (pickup: AddressAutocomplete, destination: AddressAutocomplete) => void;
  onBookNow: (formData: FormData) => void;
  onReset: () => void;
  routeInfo: RouteInfo | null;
  isCalculating: boolean;
  error: string | null;
}

interface FormData {
  name: string;
  passengers: number;
  pickup: AddressAutocomplete | null;
  destination: AddressAutocomplete | null;
  dateTime: string;
}

export default function BookingForm({
  onCalculateRoute,
  onBookNow,
  onReset,
  routeInfo,
  isCalculating,
  error,
}: BookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    passengers: 1,
    pickup: null,
    destination: null,
    dateTime: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pickupInput, setPickupInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState<AddressAutocomplete[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<AddressAutocomplete[]>([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);

  const searchAddresses = async (query: string): Promise<AddressAutocomplete[]> => {
    if (query.length < 3) return [];
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      
      return data.map((item: any) => ({
        address: item.display_name,
        placeId: item.place_id.toString(),
      }));
    } catch (error) {
      console.error('Address search error:', error);
      return [];
    }
  };

  const handlePickupInputChange = async (value: string) => {
    setPickupInput(value);
    if (value.length >= 3) {
      const suggestions = await searchAddresses(value);
      setPickupSuggestions(suggestions);
      setShowPickupSuggestions(true);
    } else {
      setShowPickupSuggestions(false);
    }
  };

  const handleDestinationInputChange = async (value: string) => {
    setDestinationInput(value);
    if (value.length >= 3) {
      const suggestions = await searchAddresses(value);
      setDestinationSuggestions(suggestions);
      setShowDestinationSuggestions(true);
    } else {
      setShowDestinationSuggestions(false);
    }
  };

  const selectPickupAddress = (address: AddressAutocomplete) => {
    setFormData(prev => ({ ...prev, pickup: address }));
    setPickupInput(address.address);
    setShowPickupSuggestions(false);
    setErrors(prev => ({ ...prev, pickup: '' }));
  };

  const selectDestinationAddress = (address: AddressAutocomplete) => {
    setFormData(prev => ({ ...prev, destination: address }));
    setDestinationInput(address.address);
    setShowDestinationSuggestions(false);
    setErrors(prev => ({ ...prev, destination: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.passengers < 1 || formData.passengers > 8) {
      newErrors.passengers = 'Passengers must be between 1 and 8';
    }

    if (!formData.pickup) {
      newErrors.pickup = 'Pickup address is required';
    }

    if (!formData.destination) {
      newErrors.destination = 'Destination address is required';
    }

    if (!formData.dateTime) {
      newErrors.dateTime = 'Date and time are required';
    }

    if (formData.pickup && formData.destination && 
        formData.pickup.address === formData.destination.address) {
      newErrors.destination = 'Pickup and destination cannot be the same';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculatePrice = () => {
    if (!validateForm()) return;
    
    if (formData.pickup && formData.destination) {
      onCalculateRoute(formData.pickup, formData.destination);
    }
  };

  const handleBookNow = () => {
    if (!validateForm() || !routeInfo) return;
    onBookNow(formData);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      passengers: 1,
      pickup: null,
      destination: null,
      dateTime: '',
    });
    setErrors({});
    setPickupInput('');
    setDestinationInput('');
    setShowPickupSuggestions(false);
    setShowDestinationSuggestions(false);
    onReset();
  };

  const canBook = routeInfo && Object.keys(errors).length === 0 && 
                 formData.name && formData.pickup && formData.destination && formData.dateTime;

  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Book Your Transfer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Passengers */}
          <div className="space-y-2">
            <Label htmlFor="passengers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Passengers *
            </Label>
            <Input
              id="passengers"
              type="number"
              min={1}
              max={8}
              step={1}
              value={formData.passengers}
              onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
              className={errors.passengers ? 'border-red-500' : ''}
            />
            {errors.passengers && <p className="text-sm text-red-500">{errors.passengers}</p>}
          </div>

          {/* Pickup */}
          <div className="space-y-2 relative">
            <Label htmlFor="pickup" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Pickup Address *
            </Label>
            <Input
              id="pickup"
              placeholder="Enter pickup address"
              value={pickupInput}
              onChange={(e) => handlePickupInputChange(e.target.value)}
              onFocus={() => pickupSuggestions.length > 0 && setShowPickupSuggestions(true)}
              className={errors.pickup ? 'border-red-500' : ''}
            />
            {showPickupSuggestions && pickupSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {pickupSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                    onClick={() => selectPickupAddress(suggestion)}
                  >
                    {suggestion.address}
                  </button>
                ))}
              </div>
            )}
            {errors.pickup && <p className="text-sm text-red-500">{errors.pickup}</p>}
          </div>

          {/* Destination */}
          <div className="space-y-2 relative">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination Address *
            </Label>
            <Input
              id="destination"
              placeholder="Enter destination address"
              value={destinationInput}
              onChange={(e) => handleDestinationInputChange(e.target.value)}
              onFocus={() => destinationSuggestions.length > 0 && setShowDestinationSuggestions(true)}
              className={errors.destination ? 'border-red-500' : ''}
            />
            {showDestinationSuggestions && destinationSuggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {destinationSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b border-gray-100 last:border-b-0"
                    onClick={() => selectDestinationAddress(suggestion)}
                  >
                    {suggestion.address}
                  </button>
                ))}
              </div>
            )}
            {errors.destination && <p className="text-sm text-red-500">{errors.destination}</p>}
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <Label htmlFor="dateTime" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date & Time *
            </Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
              className={errors.dateTime ? 'border-red-500' : ''}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.dateTime && <p className="text-sm text-red-500">{errors.dateTime}</p>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button 
            onClick={handleCalculatePrice}
            disabled={isCalculating}
            className="w-full"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Price'}
          </Button>
          
          <Button 
            onClick={handleBookNow}
            disabled={!canBook || isCalculating}
            variant="default"
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Book Now
          </Button>
          
          <Button 
            onClick={handleReset}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Export FormData type for use in parent component
export type { FormData };