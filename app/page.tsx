"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false, // disable server-side rendering
});

export default function HomePage() {
  return (
    <div>
      <h1>Car Transfer Booking</h1>
      <MapView />
    </div>
  );
}
