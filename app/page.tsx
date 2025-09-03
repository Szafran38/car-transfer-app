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
      <div style={{ marginTop: "20px" }}>
  <h2>Book Your Transfer</h2>
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const distance = Number((form.distance as HTMLInputElement).value);
      const price = distance * 0.3;
      alert(`Price: €${price.toFixed(2)}`);
    }}
  >
    <div>
      <label>Name: </label>
      <input name="name" type="text" required />
    </div>
    <div>
      <label>Passengers: </label>
      <input name="passengers" type="number" min={1} required />
    </div>
    <div>
      <label>Pickup: </label>
      <input name="pickup" type="text" required />
    </div>
    <div>
      <label>Destination: </label>
      <input name="destination" type="text" required />
    </div>
    <div>
      <label>Distance (km): </label>
      <input name="distance" type="number" min={1} required />
    </div>
    <button type="submit">Calculate Price</button>
  </form>
</div>

    </div>
  );
}
