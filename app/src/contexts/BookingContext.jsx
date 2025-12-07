import { createContext, useContext, useState, useCallback } from 'react';
import { bookingService } from '../services/bookingService';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user's bookings from backend
  const fetchMyBookings = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings(filters);
      setBookings(data.bookings || []);
      return data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new booking
  const saveBooking = async (bookingData) => {
    try {
      setLoading(true);
      const newBooking = await bookingService.createBooking(bookingData);
      setBookings(prev => [...prev, newBooking]);
      setCurrentBooking(newBooking);
      return newBooking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId, cancellationReason = '') => {
    try {
      setLoading(true);
      const updatedBooking = await bookingService.cancelBooking(bookingId, cancellationReason);
      setBookings(prev =>
        prev.map(booking => (booking.id === bookingId ? updatedBooking : booking))
      );
      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get booking by ID
  const getBookingById = async (bookingId) => {
    try {
      setLoading(true);
      const booking = await bookingService.getBookingById(bookingId);
      return booking;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for filtering bookings (client-side)
  const getUpcomingBookings = () => {
    const now = new Date();
    return bookings.filter(
      booking =>
        booking.status === 'CONFIRMED' &&
        new Date(booking.tourDate?.startDate) > now
    );
  };

  const getPastBookings = () => {
    const now = new Date();
    return bookings.filter(
      booking =>
        booking.status === 'CANCELLED' ||
        booking.status === 'COMPLETED' ||
        new Date(booking.tourDate?.startDate) <= now
    );
  };

  const value = {
    bookings,
    currentBooking,
    loading,
    setCurrentBooking,
    saveBooking,
    cancelBooking,
    getBookingById,
    fetchMyBookings,
    getUpcomingBookings,
    getPastBookings,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
