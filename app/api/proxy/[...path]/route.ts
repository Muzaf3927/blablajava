import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'PUT')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'PATCH')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params.path, 'DELETE')
}

async function handleRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  const path = pathSegments.join('/')
  const url = `https://blabla-main.laravel.cloud/api/${path}`
  
  console.log('=== PROXY: Request method:', method)
  console.log('=== PROXY: Request path:', path)
  console.log('=== PROXY: Full URL:', url)
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Копируем Authorization header если он есть
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    headers['Authorization'] = authHeader
    console.log('=== PROXY: Authorization header present')
  } else {
    console.log('=== PROXY: No Authorization header')
  }

  const body = method !== 'GET' ? await request.text() : undefined
  console.log('=== PROXY: Request body:', body)

  try {
    console.log('=== PROXY: Making request to backend...')
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    console.log('=== PROXY: Backend response status:', response.status)
    console.log('=== PROXY: Backend response headers:', Object.fromEntries(response.headers.entries()))

    const data = await response.json()
    console.log('=== PROXY: Backend response data:', data)

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('=== PROXY: Error occurred:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 