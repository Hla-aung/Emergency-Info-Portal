# Emergency Portal

A Progressive Web App (PWA) built with **Next.js**, **Tailwind CSS**, **Supabase**, and **Leaflet** to help users find and share critical shelter information during emergencies.

> 🌍 Available in English and Burmese | 🗺️ Map-based shelter submission and lookup | 🔔 Real-time notifications with alerts | ⚡ Real-time member updates | 🤖 AI-powered emergency assistance

## 🚀 Features

- Submit and view **Emergency Shelters**
- View **Earthquakes** on map
- Progressive Web App (PWA) support for push notifications
- **Real-time member updates** when users join organizations
- **AI Chatbot** for emergency assistance and information
- Interactive map integration
- Multi-language support
- Responsive design
- Database integration with Prisma

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Query
- **Database**: Supabase, Prisma
- **Real-time**: Supabase Realtime
- **PWA Implementation**: Serwist
- **Maps**: Leaflet
- **Form Handling**: React Hook Form
- **Internationalization**: next-intl
- **AI Integration**: OpenAI GPT-3.5-turbo

## 📱 Progressive Web App (PWA)

This application is built as a Progressive Web App, providing:

- **Installable**: Can be installed on home screens of mobile devices
- **Push Notifications**: Receive real-time emergency alerts
- **Fast Loading**: Optimized performance with service workers

## ⚡ Real-time Features

The application includes real-time functionality powered by Supabase:

- **Member Join Notifications**: Real-time notifications when new members join organizations
- **Live Member Updates**: Member list updates in real-time without page refresh
- **Connection Status**: Visual indicators for real-time connection status
- **Toast Notifications**: Instant feedback for real-time events

### Setting up Supabase Real-time

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the project settings
3. Add the following environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

## 🌐 External APIs

The application integrates with several external APIs to provide comprehensive emergency information:

- **USGS Earthquake API**: Real-time earthquake data visualization
- **Nominatim API**: Geocoding and reverse geocoding for location search
- **OpenStreetMap**: Base map tiles for the interactive map interface
- **GeoJSON Plate Boundaries**: Tectonic plate boundary visualization
- **Web Push API**: Delivering emergency notifications to subscribed users

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- PostgreSQL (for database)
- Supabase account (for real-time features)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Hla-aung/emergency-portal.git
cd emergency-portal
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration values, including Supabase credentials.

4. Initialize the database:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

5. Start the development server:

```bash
pnpm dev
```

## 📦 Building for Production

```bash
pnpm build
pnpm start
```

## 🔧 Development Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma:studio` - Open Prisma Studio
- `pnpm prisma:migrate` - Run database migrations

## 🔄 GitHub Workflows

### Check Earthquake Workflow

The project includes an automated GitHub workflow that checks for new earthquakes and sends notifications:

- **Scheduled Runs**: Checks for earthquakes every 15 minutes
- **Earthquake Detection**: Monitors USGS Earthquake API for new events
- **Notification System**: Sends push notifications to subscribed users

To enable the workflow, ensure the following environment variables are set in your GitHub repository secrets:

```bash
DATABASE_URL="your-database-url"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
WEB_PUSH_EMAIL="your-email"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

The workflow can be found in `.github/workflows/check-earthquake.yml`.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, feedback, and ideas are welcome! Please feel free to submit a Pull Request.

## 🤖 AI Chatbot

The application includes an AI-powered chatbot that provides emergency assistance and information:

- **Emergency Guidance**: Get information about shelters, evacuation procedures, and safety tips
- **Quick Actions**: Pre-defined buttons for common emergency queries
- **Real-time Responses**: Instant AI-powered responses to user questions
- **Chat History**: Persistent conversation history across sessions
- **Mobile Optimized**: Fully responsive design for all devices

### Setting up the AI Chatbot

1. Get an OpenAI API key from [OpenAI Platform](https://platform.openai.com/)
2. Add the following environment variable:

```bash
OPENAI_API_KEY="your-openai-api-key"
```

3. The chatbot will automatically appear on all pages as a floating chat button
4. Users can click the chat icon to start a conversation
5. Quick action buttons provide instant access to common emergency information

For detailed setup instructions, see [CHATBOT_SETUP.md](CHATBOT_SETUP.md).

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```
