export const RSVP_DEADLINE = '2026-11-15T23:59:59+08:00';
export const RSVP_TIME_ZONE = 'Asia/Manila';
export const formatDeadlineDate = (value = RSVP_DEADLINE) => new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: RSVP_TIME_ZONE }).format(new Date(value));
export const formatDeadlineTime = (value = RSVP_DEADLINE) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: RSVP_TIME_ZONE }).format(new Date(value)).replace(/\s+/g, ' ') + ' Philippine Time (UTC+08:00)';
export const formatDeadline = (value = RSVP_DEADLINE) => formatDeadlineDate(value) + ', ' + formatDeadlineTime(value);
