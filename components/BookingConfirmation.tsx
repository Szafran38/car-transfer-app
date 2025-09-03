"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, User, Users, MapPin, Calendar, Route } from 'lucide-react';
import { Booking } from '@/types/booking';
import { formatPrice, formatDistance } from '@/utils/price';

interface BookingConfirmationProps {
  booking: Booking;
  onNewBooking: () => void;
}

export default function BookingConfirmation({ booking, onNewBooking }: BookingConfirmationProps) {
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl text-green-700">Booking Confirmed!</CardTitle>
        <p className="text-muted-foreground">
          Your transfer has been successfully booked
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Confirmation Number */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Confirmation Number</p>
          <Badge variant="outline" className="text-lg font-mono">
            {booking.id}
          </Badge>
        </div>

        {/* Booking Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{booking.name}</p>
              <p className="text-sm text-muted-foreground">Passenger name</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</p>
              <p className="text-sm text-muted-foreground">Total passengers</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{booking.pickup}</p>
              <p className="text-sm text-muted-foreground">Pickup location</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{booking.destination}</p>
              <p className="text-sm text-muted-foreground">Destination</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{formatDateTime(booking.dateTime)}</p>
              <p className="text-sm text-muted-foreground">Scheduled time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Route className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{formatDistance(booking.distance * 1000)} • {booking.duration}</p>
              <p className="text-sm text-muted-foreground">Distance and duration</p>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total Price:</span>
            <Badge className="text-xl font-bold bg-green-100 text-green-800 hover:bg-green-100">
              {formatPrice(booking.price)}
            </Badge>
          </div>
        </div>

        {/* New Booking Button */}
        <Button onClick={onNewBooking} className="w-full" size="lg">
          Book Another Transfer
        </Button>
      </CardContent>
    </Card>
  );
}