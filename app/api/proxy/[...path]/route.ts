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
  
  console.log('=== PROXY: Request to:', url)
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Копируем Authorization header если он есть
  const authHeader = request.headers.get('authorization')
  if (authHeader) {
    headers['Authorization'] = authHeader
  }

  const body = method !== 'GET' ? await request.text() : undefined

  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    })

    // Проверяем, есть ли тело ответа
    const responseText = await response.text()
    
    let data
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      console.error('=== PROXY: Failed to parse JSON:', parseError)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }

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