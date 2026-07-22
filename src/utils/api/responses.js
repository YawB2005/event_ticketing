import { NextResponse } from 'next/server'

export function jsonOk(data, init = {}) {
  return NextResponse.json(data, init)
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function parseEventId(searchParams) {
  const eventId = searchParams.get('eventId')
  return eventId || null
}
