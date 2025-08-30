import { 
  User, Trip, Booking, Message, Chat, Notification, 
  Wallet, Transaction, Rating, Setting, AuthResponse,
  LoginForm, RegisterForm, TripForm, BookingForm, 
  MessageForm, RatingForm, DepositForm 
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';

interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Проверяем, есть ли тело ответа
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        throw new Error('Неверный ответ от сервера');
      }

      if (!response.ok) {
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      // Laravel возвращает данные напрямую, а не в data поле
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData: RegisterForm) {
    return this.request<{ message: string; success: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Laravel возвращает данные напрямую
    if (response?.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async resetPassword(data: { phone: string; password: string; password_confirmation: string }) {
    return this.request('/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    const response = await this.request('/logout', {
      method: 'POST',
    });
    this.clearToken();
    return response;
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response = await this.request<User>('/user');
    return response;
  }

  async updateUser(userData: Partial<User>) {
    return this.request<User>('/user', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: { password: string; new_password: string }) {
    return this.request('/user/password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  // Trips endpoints
  async createTrip(tripData: TripForm) {
    return this.request<{ message: string; trip: Trip }>('/trip', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  }

  async getMyTrips() {
    return this.request<{ trips: Trip[] }>('/my-trips');
  }

  async getAllTrips() {
    return this.request<{ trips: Trip[] }>('/trips');
  }

  async updateTrip(tripId: number, tripData: Partial<TripForm>) {
    return this.request<{ message: string; trip: Trip }>(`/trips/${tripId}`, {
      method: 'PATCH',
      body: JSON.stringify(tripData),
    });
  }

  async deleteTrip(tripId: number) {
    return this.request(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  }

  async completeTrip(tripId: number) {
    return this.request<{ 
      message: string; 
      trip: Trip; 
      driver_fee: number;
      passenger_fee: number;
      passengers_count: number;
      total_passenger_fees: number;
    }>(`/trips/${tripId}/complete`, {
      method: 'POST',
    });
  }

  // Bookings endpoints
  async createBooking(tripId: number, bookingData: BookingForm) {
    return this.request<Booking>(`/trips/${tripId}/booking`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(bookingId: number, bookingData: Partial<BookingForm>) {
    return this.request<Booking>(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(bookingData),
    });
  }

  async approveBooking(bookingId: number) {
    return this.request<{ 
      message: string; 
      status: string; 
      trip_seats_remaining: number;
    }>(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'confirmed' }),
    });
  }

  async rejectBooking(bookingId: number) {
    return this.request<{ 
      message: string; 
      status: string; 
      trip_seats_remaining: number;
    }>(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'declined' }),
    });
  }

  async getMyBookings() {
    return this.request<Booking[]>('/bookings');
  }

  async getTripBookings(tripId: number) {
    return this.request<{ bookings: Booking[] }>(`/trips/${tripId}/bookings`);
  }

  async cancelBooking(bookingId: number) {
    return this.request<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Chat endpoints
  async sendMessage(tripId: number, messageData: MessageForm) {
    return this.request<{ 
      status: string; 
      message: Message; 
    }>(`/chats/${tripId}/send`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getChatMessages(tripId: number, receiverId: number) {
    return this.request<{ 
      status: string; 
      messages: Message[]; 
    }>(`/chats/${tripId}/with/${receiverId}`);
  }

  async getUserChats() {
    return this.request<{ 
      status: string; 
      chats: Chat[]; 
    }>('/chats');
  }

  async getUnreadCount() {
    return this.request<{ unread_count: number }>('/chats/unread-count');
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request<Notification[]>('/notifications');
  }

  async markNotificationAsRead(notificationId: number) {
    return this.request<Notification>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }



  // Wallet endpoints
  async getWallet() {
    return this.request<Wallet>('/wallet');
  }

  async depositWallet(depositData: DepositForm) {
    return this.request<{ 
      message: string; 
      balance: number; 
    }>('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  async getWalletTransactions() {
    return this.request<{ 
      transactions: Transaction[]; 
    }>('/wallet/transactions');
  }

  // Ratings endpoints
  async rateUser(tripId: number, toUserId: number, ratingData: RatingForm) {
    return this.request<{ 
      message: string; 
      rating: Rating; 
    }>(`/ratings/${tripId}/to/${toUserId}`, {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  }

  async getUserRatings(userId: number) {
    return this.request<{ 
      average_rating: number; 
      ratings: { 
        data: Rating[]; 
        total: number; 
      }; 
    }>(`/ratings/user/${userId}`);
  }

  async getMyRatingsGiven() {
    return this.request<{ 
      ratings_given: { 
        data: Rating[]; 
        total: number; 
      }; 
    }>('/ratings/given');
  }

  // Settings endpoints
  async getSettings() {
    return this.request<Setting[]>('/settings');
  }

  async getSetting(key: string) {
    return this.request<Setting>(`/settings/${key}`);
  }

  async createOrUpdateSetting(settingData: { key: string; value: string }) {
    return this.request<Setting>('/settings', {
      method: 'POST',
      body: JSON.stringify(settingData),
    });
  }

  async deleteSetting(key: string) {
    return this.request(`/settings/${key}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL); 