"use client";

import dynamic from "next/dynamic";

// Dynamic import of MapView to fix "window is not defined"
const MapView = dynamic(() => import("../components/MapView"), {
  ssr: false,
});

// Import your original Bolt components
import Header from "../components/Header";
import Footer from "../components/Footer";
import BookingForm from "../components/BookingForm";

export default function HomePage() {
  return (
    <div className="app-container">
      {/* Original Bolt header */}
      <Header />

      <main className="main-content">
        <h1 className="page-title">Car Transfer Booking</h1>

        {/* Map section */}
        <section className="map-section">
          <MapView />
        </section>

        {/* Booking form section */}
        <section className="form-section">
          <BookingForm />
        </section>
      </main>

      {/* Original Bolt footer */}
      <Footer />
    </div>
  );
}
