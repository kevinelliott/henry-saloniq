export type AppointmentStatus = 'completed' | 'no_show' | 'cancelled' | 'scheduled'

export interface Profile {
  id: string
  user_id: string
  business_name: string
  created_at: string
}

export interface Stylist {
  id: string
  user_id: string
  name: string
  hire_date: string
  active: boolean
}

export interface Appointment {
  id: string
  user_id: string
  stylist_id: string
  client_name: string
  service: string
  price: number
  scheduled_at: string
  status: AppointmentStatus
  created_at: string
  stylist?: Stylist
}

export interface RevenueGoal {
  id: string
  user_id: string
  month: string // YYYY-MM
  goal_amount: number
}
