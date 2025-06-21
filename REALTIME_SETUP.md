# Realtime Organization Dashboard Setup

This guide explains how to set up the realtime functionality for the organization dashboard, which allows real-time updates when members join, leave, or change roles.

## Prerequisites

- Supabase account and project
- PostgreSQL database (Supabase provides this)
- Next.js application with the emergency portal

## Setup Instructions

### 1. Supabase Configuration

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials**:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy your Project URL and anon/public key

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The realtime functionality uses the existing Prisma schema. Make sure your database has the following tables:

- `Organization` - Organizations table
- `User` - Users table
- `UserOrganization` - Junction table for organization memberships

### 4. Enable Realtime in Supabase

1. **Enable realtime for the UserOrganization table**:

   - Go to your Supabase dashboard
   - Navigate to Database > Replication
   - Find the `UserOrganization` table
   - Enable realtime by toggling the switch

2. **Configure Row Level Security (RLS)**:
   - Go to Database > Policies
   - Create policies for the `UserOrganization` table to allow read access for organization members

Example RLS policy:

```sql
-- Allow users to read UserOrganization records for organizations they belong to
CREATE POLICY "Users can view organization members" ON "UserOrganization"
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM "UserOrganization" uo2
    WHERE uo2."organizationId" = "UserOrganization"."organizationId"
    AND uo2."userId" = auth.uid()
  )
);
```

### 5. Features

Once set up, the realtime functionality provides:

#### Real-time Member Updates

- **New members joining**: Instant notification when someone joins the organization
- **Members leaving**: Notification when someone leaves the organization
- **Role changes**: Notification when member roles are updated

#### Visual Indicators

- **Live badge**: Shows "Live" indicator in the dashboard header
- **Realtime icons**: WiFi icons next to member statistics
- **Loading states**: Proper loading indicators during data fetching

#### Toast Notifications

- **Success notifications**: Green toasts for new members joining
- **Info notifications**: Blue toasts for members leaving or role changes
- **Auto-dismiss**: Notifications automatically disappear after 5 seconds

### 6. How It Works

1. **Supabase Realtime**: Uses PostgreSQL's built-in replication to listen for database changes
2. **WebSocket Connection**: Establishes a persistent connection to receive real-time updates
3. **Event Handling**: Processes INSERT, UPDATE, and DELETE events on the UserOrganization table
4. **State Management**: Updates React state immediately when changes are detected
5. **Notifications**: Shows toast notifications for user-friendly feedback

### 7. Troubleshooting

#### Common Issues

1. **No realtime updates**:

   - Check if realtime is enabled for the UserOrganization table
   - Verify environment variables are set correctly
   - Check browser console for connection errors

2. **Permission errors**:

   - Ensure RLS policies are configured correctly
   - Check if the user has proper authentication

3. **Connection issues**:
   - Verify Supabase project URL and keys
   - Check network connectivity
   - Ensure Supabase service is running

#### Debug Mode

To enable debug logging, add this to your environment:

```bash
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

### 8. Performance Considerations

- **Connection limits**: Supabase has connection limits based on your plan
- **Event frequency**: Limit events to 10 per second (configured in supabase client)
- **Memory usage**: Clean up subscriptions when components unmount
- **Network usage**: Realtime connections use WebSocket, which is more efficient than polling

### 9. Security

- **Authentication**: All realtime connections require proper authentication
- **Authorization**: RLS policies ensure users only see data they're authorized to access
- **Data validation**: Server-side validation prevents unauthorized changes

## Files Modified

The following files were added or modified to implement realtime functionality:

- `lib/supabase.ts` - Supabase client configuration
- `hooks/use-realtime-organization-members.tsx` - Realtime members hook
- `components/organization/organization-dashboard.tsx` - Updated dashboard with realtime features
- `components/organization/organization-members.tsx` - Updated members component
- `components/common/realtime-notification.tsx` - Toast notification component
- `messages/en.json` & `messages/my.json` - Added translation keys

## Testing

To test the realtime functionality:

1. Open the organization dashboard in multiple browser tabs
2. In one tab, invite a new member or change a member's role
3. Verify that the other tabs show real-time updates and notifications
4. Check that the member count and statistics update immediately

The realtime functionality enhances the user experience by providing immediate feedback when organization membership changes occur.
