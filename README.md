# Emergency Portal

A Progressive Web App (PWA) built with **Next.js**, **Tailwind CSS**, **Supabase**, and **Leaflet** to help users find and share critical shelter information during emergencies in Myanmar.

> 🌍 Available in English and Burmese | 🗺️ Map-based shelter submission and lookup | 🔔 Real-time notifications with alerts

## 🚀 Features

- Submit and view **Emergency Shelters**
- View **Earthquakes** on map
- Progressive Web App (PWA) support for push notifications
- Interactive map integration
- Multi-language support
- Responsive design
- Database integration with Prisma

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Query
- **Database**: Supabase, Prisma
- **PWA Implementation**: Serwist
- **Maps**: Leaflet
- **Form Handling**: React Hook Form
- **Internationalization**: next-intl

## 📱 Progressive Web App (PWA)

This application is built as a Progressive Web App, providing:

- **Installable**: Can be installed on home screens of mobile devices
- **Push Notifications**: Receive real-time emergency alerts
- **Fast Loading**: Optimized performance with service workers

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

Edit `.env` with your configuration values.

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
```

The workflow can be found in `.github/workflows/check-earthquake.yml`.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions, feedback, and ideas are welcome! Please feel free to submit a Pull Request.

```bash
git checkout -b feature/your-feature
git commit -m "Add your feature"
git push origin feature/your-feature
```
