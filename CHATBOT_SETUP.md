# AI Chatbot Setup Guide

This guide will help you set up the AI chatbot feature for your emergency portal.

## Features

- 🤖 AI-powered emergency assistance
- 💬 Real-time chat interface
- ⚡ Quick action buttons for common queries
- 💾 Chat history persistence
- 📱 Mobile-responsive design
- 🎨 Beautiful UI with animations

## Prerequisites

1. **OpenAI API Key**: You'll need an OpenAI API key to use the chatbot
2. **Node.js**: Version 18 or higher
3. **pnpm**: Package manager (already installed in your project)

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the API key (keep it secure!)

### 2. Configure Environment Variables

Create or update your `.env.local` file in the root directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Other existing environment variables...
```

### 3. Install Dependencies

The required dependencies have already been installed:

```bash
pnpm add ai openai
```

### 4. Start the Development Server

```bash
pnpm dev
```

## Usage

### For Users

1. **Access the Chatbot**: Click the chat icon (💬) in the bottom-right corner of any page
2. **Quick Actions**: Use the quick action buttons for common emergency queries:

   - Find Shelters
   - Emergency Contact
   - Safety Tips
   - First Aid
   - Evacuation
   - Emergency Alerts
   - Preparedness
   - Family Plan

3. **Custom Queries**: Type your own questions about emergency procedures, safety, or shelters
4. **Chat History**: Your conversation history is automatically saved and restored
5. **Reset Chat**: Click "Start New Chat" to begin a fresh conversation

### For Developers

#### Components Structure

```
components/chatbot/
├── chatbot.tsx          # Main chatbot component
└── quick-actions.tsx    # Quick action buttons

hooks/
└── use-chatbot.tsx      # Chatbot state management hook

app/api/chat/
└── route.ts             # API endpoint for chat
```

#### Key Features

- **State Management**: Uses custom hook for persistent chat state
- **Rate Limiting**: Built-in rate limiting (10 requests per minute)
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive Design**: Works on all device sizes
- **Accessibility**: ARIA labels and keyboard navigation support

#### Customization

You can customize the chatbot by:

1. **Modifying System Prompt**: Edit the `emergencySystemPrompt` in `app/api/chat/route.ts`
2. **Adding Quick Actions**: Update the `quickActions` array in `components/chatbot/quick-actions.tsx`
3. **Styling**: Modify the Tailwind classes in the components
4. **Rate Limiting**: Adjust the rate limit in `app/api/chat/route.ts`

## API Endpoints

### POST /api/chat

Handles chat requests to the AI assistant.

**Request Body:**

```json
{
  "message": "string",
  "history": [
    {
      "role": "user" | "assistant",
      "content": "string"
    }
  ],
  "stream": boolean (optional)
}
```

**Response:**

```json
{
  "message": "string",
  "usage": {
    "prompt_tokens": number,
    "completion_tokens": number,
    "total_tokens": number
  }
}
```

## Security Considerations

1. **API Key Security**: Never expose your OpenAI API key in client-side code
2. **Rate Limiting**: The API includes rate limiting to prevent abuse
3. **Input Validation**: Messages are validated for length and content
4. **Error Handling**: Sensitive error information is not exposed to clients

## Troubleshooting

### Common Issues

1. **"OpenAI API key is invalid or missing"**

   - Check that `OPENAI_API_KEY` is set in your `.env.local` file
   - Verify the API key is correct and has sufficient credits

2. **"Rate limit exceeded"**

   - Wait a minute before sending another message
   - The limit is 10 requests per minute per IP

3. **Chatbot not appearing**

   - Check that the chatbot component is imported in your layout
   - Verify there are no console errors

4. **Messages not sending**
   - Check your internet connection
   - Verify the API endpoint is accessible
   - Check browser console for errors

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
DEBUG_CHATBOT=true
```

## Cost Considerations

- OpenAI charges per token used
- GPT-3.5-turbo is cost-effective for most use cases
- Monitor your usage in the OpenAI dashboard
- Consider implementing usage limits for production

## Production Deployment

1. **Environment Variables**: Ensure `OPENAI_API_KEY` is set in your production environment
2. **Rate Limiting**: Consider using a more robust rate limiting solution for production
3. **Monitoring**: Set up monitoring for API usage and errors
4. **Backup**: Consider implementing a fallback response system

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the browser console for errors
3. Verify your OpenAI API key and credits
4. Check the network tab for API request/response issues

## Contributing

To contribute to the chatbot feature:

1. Follow the existing code style
2. Add appropriate TypeScript types
3. Include error handling
4. Test on different devices and browsers
5. Update this documentation if needed
