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
      console.log('=== API: Making request to:', url)
      console.log('=== API: Request method:', config.method || 'GET')
      console.log('=== API: Request headers:', config.headers)
      console.log('=== API: Request body:', config.body)
      
      const response = await fetch(url, config);
      console.log('=== API: Response status:', response.status)
      console.log('=== API: Response headers:', Object.fromEntries(response.headers.entries()))
      
      const data = await response.json();
      console.log('=== API: Response data:', data)

      if (!response.ok) {
        console.error('=== API: Request failed with status:', response.status)
        console.error('=== API: Error data:', data)
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      // Laravel возвращает данные напрямую, а не в data поле
      return data;
    } catch (error) {
      console.error('=== API: Request failed with error:', error);
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
    console.log('API: Sending login request with:', credentials)
    const response = await this.request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    console.log('API: Login response received:', response)
    
    // Laravel возвращает данные напрямую
    if (response?.access_token) {
      this.setToken(response.access_token);
      console.log('API: Token saved successfully')
    } else {
      console.log('API: No access_token in response')
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
    console.log('API: Getting current user...')
    const response = await this.request<User>('/user');
    console.log('API: Current user response:', response)
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
    return this.request<Booking>(`/bookings/${bookingId}/approve`, {
      method: 'PATCH',
    });
  }

  async rejectBooking(bookingId: number) {
    return this.request<Booking>(`/bookings/${bookingId}/reject`, {
      method: 'PATCH',
    });
  }

  async getMyBookings() {
    return this.request<Booking[]>('/bookings');
  }

  async getTripBookings(tripId: number) {
    console.log('=== API: getTripBookings called with tripId:', tripId)
    const result = await this.request<{ bookings: Booking[] }>(`/trips/${tripId}/bookings`);
    console.log('=== API: getTripBookings result:', result)
    return result;
  }

  async cancelBooking(bookingId: number) {
    return this.request<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  }

  // Chat endpoints
  async sendMessage(tripId: number, messageData: MessageForm) {
    return this.request<Message>(`/chats/${tripId}/send`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getChatMessages(tripId: number, receiverId: number) {
    return this.request<Message[]>(`/chats/${tripId}/with/${receiverId}`);
  }

  async getUserChats() {
    return this.request<Chat[]>('/chats');
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/chats/unread-count');
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
    return this.request<Transaction>('/wallet/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  async getWalletTransactions() {
    return this.request<Transaction[]>('/wallet/transactions');
  }

  // Ratings endpoints
  async rateUser(tripId: number, toUserId: number, ratingData: RatingForm) {
    return this.request<Rating>(`/ratings/${tripId}/to/${toUserId}`, {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  }

  async getUserRatings(userId: number) {
    return this.request<Rating[]>(`/ratings/user/${userId}`);
  }

  async getMyRatingsGiven() {
    return this.request<Rating[]>('/ratings/given');
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