"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route, Clock, Euro } from 'lucide-react';
import { RouteInfo } from '@/types/booking';
import { formatDistance, formatPrice } from '@/utils/price';

interface SummaryProps {
  routeInfo: RouteInfo | null;
}

export default function Summary({ routeInfo }: SummaryProps) {
  if (!routeInfo) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Calculate a route to see the summary
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Route className="h-5 w-5 text-primary" />
          Trip Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Distance</p>
              <p className="font-medium">{formatDistance(routeInfo.distance)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{routeInfo.duration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Euro className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Total Price</p>
              <Badge variant="secondary" className="text-lg font-bold">
                {formatPrice(routeInfo.price)}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Rate: €0.30 per kilometer
          </p>
        </div>
      </CardContent>
    </Card>
  );
}