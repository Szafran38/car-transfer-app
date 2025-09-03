import { Booking } from '@/types/booking';

const BOOKINGS_KEY = 'car_transfer_bookings';

export function saveBooking(booking: Booking): void {
  try {
    const existingBookings = getBookings();
    const updatedBookings = [...existingBookings, booking];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
  } catch (error) {
    console.error('Failed to save booking:', error);
  }
}

export function getBookings(): Booking[] {
  try {
    const bookingsStr = localStorage.getItem(BOOKINGS_KEY);
    return bookingsStr ? JSON.parse(bookingsStr) : [];
  } catch (error) {
    console.error('Failed to retrieve bookings:', error);
    return [];
  }
}

export function generateBookingId(): string {
  return `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
}