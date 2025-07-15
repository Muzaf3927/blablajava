// User types
export interface User {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  role?: string | null;
  balance?: number;
  rating?: number;
  rating_count?: number;
  created_at: string;
  updated_at: string;
}

// Trip types
export interface Trip {
  id: number;
  user_id: number;
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  note?: string;
  carModel?: string;
  carColor?: string;
  numberCar?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  driver?: User;
}

// Booking types
export interface Booking {
  id: number;
  trip_id: number;
  user_id: number;
  seats: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
  trip?: Trip;
  user?: User;
}

// Message types
export interface Message {
  id: number;
  trip_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

// Chat types
export interface Chat {
  trip_id: number;
  trip: Trip;
  last_message?: Message;
  unread_count: number;
}

// Notification types
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'booking' | 'trip' | 'message' | 'rating' | 'system';
  is_read: boolean;
  created_at: string;
  data?: any;
}

// Wallet types
export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  wallet_id: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  created_at: string;
}

// Rating types
export interface Rating {
  id: number;
  trip_id: number;
  from_user_id: number;
  to_user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  from_user?: User;
  to_user?: User;
  trip?: Trip;
}

// Settings types
export interface Setting {
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface AuthResponse {
  message: string;
  access_token: string;
  token_type: string;
  user?: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Form types
export interface LoginForm {
  phone: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface TripForm {
  from_city: string;
  to_city: string;
  date: string;
  time: string;
  price: number;
  seats: number;
  note?: string;
  carModel?: string;
  carColor?: string;
  numberCar?: string;
}

export interface BookingForm {
  seats: number;
}

export interface MessageForm {
  message: string;
}

export interface RatingForm {
  rating: number;
  comment?: string;
}

export interface DepositForm {
  amount: number;
} 