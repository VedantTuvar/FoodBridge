export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'corporate' | 'admin' | 'superadmin';

export interface User {
  id: string;
  phone_number: string;
  email?: string;
  full_name: string;
  role: UserRole;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface DonorProfile {
  id: string;
  user: string;
  organization_name: string;
  donor_type: 'restaurant' | 'hotel' | 'grocery' | 'individual' | 'event' | 'corporate';
  address: string;
  latitude?: number;
  longitude?: number;
  rating_avg: number;
  created_at: string;
}

export interface NGOProfile {
  id: string;
  user: string;
  organization_name: string;
  registration_number: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verification_document_url?: string;
  capacity_per_day: number;
  address: string;
  latitude?: number;
  longitude?: number;
  rating_avg: number;
  created_at: string;
}

export interface VolunteerProfile {
  id: string;
  user: string;
  vehicle_type: 'on_foot' | 'bike' | 'car' | 'van';
  is_available: boolean;
  latitude?: number;
  longitude?: number;
  rating_avg: number;
  total_deliveries: number;
  created_at: string;
}

export type DonationStatus =
  | 'listed'
  | 'claimed'
  | 'assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'confirmed'
  | 'closed'
  | 'cancelled'
  | 'expired';

export interface Donation {
  id: string;
  donor: string;
  donor_name?: string;
  food_type: string;
  quantity_kg: number;
  estimated_meals: number;
  perishability_window: string;
  pickup_address: string;
  pickup_latitude?: number;
  pickup_longitude?: number;
  status: DonationStatus;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  donation: string;
  donation_detail?: Donation;
  volunteer?: string;
  ngo_name?: string;
  ngo_address?: string;
  ngo_latitude?: number;
  ngo_longitude?: number;
  donor_phone?: string;
  ngo_phone?: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'confirmed';
  pickup_time?: string;
  delivery_time?: string;
  proof_image_url?: string;
  otp_code?: string;
  created_at: string;
}

export interface VolunteerBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  req_count: number;
  unlocked: boolean;
  progress: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  user_id: string;
  full_name: string;
  vehicle_type: string;
  total_deliveries: number;
  total_kg: number;
  rating_avg: number;
  points: number;
  is_current_user: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  notification_type: 'task_alert' | 'status_update' | 'badge_earned' | 'rating_received' | 'system';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface Rating {
  id: string;
  task: string;
  rated_by: string;
  rated_by_name?: string;
  rated_user: string;
  rated_user_name?: string;
  score: number;
  comment?: string;
  created_at: string;
}

export interface ImpactMetric {
  id: string;
  user: string;
  total_kg_donated: number;
  total_meals_estimated: number;
  co2_saved_kg: number;
  updated_at: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'amber' | 'error' | 'info';
  title: string;
  message?: string;
}

