import express from 'express';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CohereClient } from 'cohere-ai';
import axios from 'axios';

const router = express.Router();

// Initialize AI clients conditionally - will be called after env is loaded
let openai = null;
let anthropic = null;
let genAI = null;
let cohere = null;

function initializeClients() {
  if (process.env.OPENAI_API_KEY && !openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  if (process.env.ANTHROPIC_API_KEY && !anthropic) {
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  if (process.env.GOOGLE_API_KEY && !genAI) {
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  }

  if (process.env.COHERE_API_KEY && !cohere) {
    cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });
  }
}

// OpenAI Chat Handler
async function handleOpenAIChat(req, res) {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  const { model, messages, temperature = 0.7, maxTokens = 2048, topP = 1 } = req;
  
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  if (req.systemInstructions) {
    formattedMessages.unshift({
      role: 'system',
      content: req.systemInstructions
    });
  }

  const stream = await openai.chat.completions.create({
    model,
    messages: formattedMessages,
    temperature,
    max_tokens: maxTokens,
    top_p: topP,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    if (content) {
      res.write(`data: ${JSON.stringify({ type: 'content', content })}\n\n`);
    }
  }
}

// Anthropic Chat Handler
async function handleAnthropicChat(req, res) {
  if (!anthropic) {
    throw new Error('Anthropic API key not configured');
  }

  const { model, messages, temperature = 0.7, maxTokens = 2048, topP = 1 } = req;
  
  const userMessages = messages.filter(msg => msg.role !== 'system');
  const systemMessage = req.systemInstructions || messages.find(msg => msg.role === 'system')?.content;

  const stream = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    system: systemMessage,
    messages: userMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
      res.write(`data: ${JSON.stringify({ type: 'content', content: chunk.delta.text })}\n\n`);
    }
  }
}

// Google AI Chat Handler
async function handleGoogleChat(req, res) {
  if (!genAI) {
    throw new Error('Google API key not configured');
  }

  const { model, messages, temperature = 0.7, maxTokens = 2048, topP = 1 } = req;
  
  const model_instance = genAI.getGenerativeModel({ 
    model,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      topP,
    }
  });

  const chat = model_instance.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))
  });

  const lastMessage = messages[messages.length - 1];
  const prompt = req.systemInstructions 
    ? `${req.systemInstructions}\n\n${lastMessage.content}`
    : lastMessage.content;

  const result = await chat.sendMessageStream(prompt);
  
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      res.write(`data: ${JSON.stringify({ type: 'content', content: text })}\n\n`);
    }
  }
}

// Cohere Chat Handler
async function handleCohereChat(req, res) {
  if (!cohere) {
    throw new Error('Cohere API key not configured');
  }

  const { model, messages, temperature = 0.7, maxTokens = 2048, topP = 1 } = req;
  
  const chatHistory = messages.slice(0, -1).map(msg => ({
    role: msg.role === 'assistant' ? 'CHATBOT' : 'USER',
    message: msg.content
  }));

  const lastMessage = messages[messages.length - 1];
  const prompt = req.systemInstructions 
    ? `${req.systemInstructions}\n\n${lastMessage.content}`
    : lastMessage.content;

  const stream = await cohere.chatStream({
    model,
    message: prompt,
    chatHistory,
    temperature,
    maxTokens,
    p: topP,
  });

  for await (const chunk of stream) {
    if (chunk.eventType === 'text-generation' && chunk.text) {
      res.write(`data: ${JSON.stringify({ type: 'content', content: chunk.text })}\n\n`);
    }
  }
}

// Generic API Handler for other providers
async function handleGenericAPIChat(req) {
  const { provider, model, messages, temperature = 0.7, maxTokens = 2048, topP = 1 } = req;
  
  let apiUrl = '';
  let headers = {};
  let payload = {};

  switch (provider) {
    case 'xai':
      apiUrl = 'https://api.x.ai/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
        'Content-Type': 'application/json'
      };
      payload = {
        model,
        messages: req.systemInstructions 
          ? [{ role: 'system', content: req.systemInstructions }, ...messages]
          : messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP
      };
      break;

    case 'deepseek':
      apiUrl = 'https://api.deepseek.com/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      };
      payload = {
        model,
        messages: req.systemInstructions 
          ? [{ role: 'system', content: req.systemInstructions }, ...messages]
          : messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP
      };
      break;

    case 'mistral':
      apiUrl = 'https://api.mistral.ai/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
        'Content-Type': 'application/json'
      };
      payload = {
        model,
        messages: req.systemInstructions 
          ? [{ role: 'system', content: req.systemInstructions }, ...messages]
          : messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP
      };
      break;

    case 'perplexity':
      apiUrl = 'https://api.perplexity.ai/chat/completions';
      headers = {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json'
      };
      payload = {
        model,
        messages: req.systemInstructions 
          ? [{ role: 'system', content: req.systemInstructions }, ...messages]
          : messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP
      };
      break;

    default:
      throw new Error(`Provider ${provider} not supported`);
  }

  const response = await axios.post(apiUrl, payload, { headers });
  return response.data.choices[0]?.message?.content || 'No response generated';
}

// Main chat endpoint
router.post('/', async (req, res) => {
  try {
    // Initialize clients with current environment variables
    initializeClients();
    
    const chatRequest = req.body;
    const { provider } = chatRequest;

    // Set up Server-Sent Events headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'start' })}\n\n`);

    switch (provider) {
      case 'openai':
        await handleOpenAIChat(chatRequest, res);
        break;
      case 'anthropic':
        await handleAnthropicChat(chatRequest, res);
        break;
      case 'google':
        await handleGoogleChat(chatRequest, res);
        break;
      case 'cohere':
        await handleCohereChat(chatRequest, res);
        break;
      case 'xai':
      case 'deepseek':
      case 'mistral':
      case 'perplexity':
        // For generic APIs, we'll need to handle them differently
        const response = await handleGenericAPIChat(chatRequest);
        res.write(`data: ${JSON.stringify({ content: response })}\n\n`);
        break;
      default:
        res.write(`data: ${JSON.stringify({ error: `Provider ${provider} not supported` })}\n\n`);
        res.end();
        return;
    }

    // Send completion event
    res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Failed to generate response', message: error.message })}\n\n`);
    res.end();
  }
});

// Get available providers endpoint
router.get('/providers', (req, res) => {
  const providers = [
    'openai',
    'anthropic', 
    'google',
    'meta',
    'mistral',
    'xai',
    'deepseek',
    'alibaba',
    'cohere',
    'perplexity'
  ];
  
  res.json({ providers });
});

export default router;