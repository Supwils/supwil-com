import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Load system prompt from JSON file
let systemPrompt = "You are a helpful AI assistant for SupwilSoft, a technology company.";

try {
  const promptPath = path.join(process.cwd(), 'src/data/supwil-com-promt.json');
  const promptData = JSON.parse(fs.readFileSync(promptPath, 'utf8'));
  if (promptData && promptData.systemPrompt) {
    systemPrompt = promptData.systemPrompt;
  }
} catch (error) {
  console.warn('Could not load system prompt from JSON file, using default:', error.message);
}

export async function POST(request) {
  try {
    const { messages, options = {} } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Prepare messages with system prompt
    const chatMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPWIL_COM_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 500,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: err || 'OpenAI request failed' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return NextResponse.json({
      success: true,
      message: aiResponse,
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific error types
    let errorMessage = 'Failed to get AI response. Please try again.';
    let statusCode = 500;
    
    if (error.code === 'insufficient_quota') {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid API key. Please check configuration.';
      statusCode = 401;
    } else if (error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your connection.';
      statusCode = 503;
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}