// lib/api/eventBookings.ts
// UPDATED VERSION - Uses Next.js API routes as proxy

export interface EventBookingData {
  // Venue and dates
  venue_id: number
  check_in_date: string // Format: YYYY-MM-DD
  check_out_date: string // Format: YYYY-MM-DD
  is_single_day: boolean
  number_of_days: number
  number_of_nights: number
  expected_attendees: number
  needs_accommodation: boolean

  // Contact information
  organization?: string
  event_name?: string
  contact_person: string
  position?: string
  email: string
  phone: string
  details?: string

  // Pricing
  venue_price_per_day: number
  venue_total: number
  rooms_total?: number
  grand_total: number

  // Rooms (if accommodation needed)
  rooms?: Array<{
    room_id: string
    room_name: string
    bed_type?: string
    capacity: number
    size?: string
    quantity: number
    price_per_night: number
    number_of_nights: number
    subtotal: number
  }>
}

export interface EventBookingResponse {
  success: boolean
  message: string
  data?: {
    booking_id: number
    reference_number: string
    status: string
    venue_name: string
    check_in_date: string
    check_out_date: string
    grand_total: number
    booking: any
  }
  errors?: any
}

/**
 * Submit a new event booking request
 * NOW USES NEXT.JS API ROUTE INSTEAD OF DIRECT LARAVEL CALL
 */
export async function submitEventBooking(
  bookingData: EventBookingData
): Promise<EventBookingResponse> {
  try {
    // Call Next.js API route instead of Laravel directly
    const response = await fetch('/api/event-bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add authorization header if user is logged in
        ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      },
      body: JSON.stringify(bookingData),
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle validation errors
      if (response.status === 422 && data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(', ')
        throw new Error(errorMessages)
      }
      throw new Error(data.message || 'Failed to submit booking')
    }

    return data
  } catch (error) {
    console.error('Error submitting event booking:', error)
    throw error
  }
}

/**
 * Check if dates are available for a venue
 */
export async function checkVenueAvailability(
  venueId: number,
  checkInDate: string,
  checkOutDate: string
): Promise<{
  success: boolean
  is_available: boolean
  unavailable_dates: string[]
  message: string
}> {
  try {
    const response = await fetch('/api/event-bookings/check-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        venue_id: venueId,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error('Error checking availability:', error)
    throw error
  }
}

/**
 * Get unavailable dates for a venue
 */
export async function getUnavailableDates(
  venueId?: number,
  startDate?: string,
  endDate?: string
): Promise<{
  success: boolean
  data: Array<{
    id: number
    venue_id: number | null
    unavailable_date: string
    reason: string | null
    type: 'blocked' | 'booked' | 'maintenance' | 'holiday'
  }>
}> {
  try {
    const params = new URLSearchParams()
    if (venueId) params.append('venue_id', venueId.toString())
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)

    const response = await fetch(
      `/api/event-bookings/unavailable-dates?${params}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    return await response.json()
  } catch (error) {
    console.error('Error fetching unavailable dates:', error)
    throw error
  }
}

/**
 * Get user's bookings (requires authentication)
 */
export async function getUserBookings(
  page: number = 1,
  perPage: number = 15,
  status?: string
): Promise<any> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    
    if (status) params.append('status', status)

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const response = await fetch(`/api/event-bookings?${params}`, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    throw error
  }
}

/**
 * Get a specific booking by ID (requires authentication)
 */
export async function getBookingById(bookingId: number): Promise<any> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    const response = await fetch(`/api/event-bookings/${bookingId}`, {
      headers: {
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
    })

    return await response.json()
  } catch (error) {
    console.error('Error fetching booking:', error)
    throw error
  }
}