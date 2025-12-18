import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NotificationItem } from '@/components/shared/NotificationItem';
import { mockNotifications } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCheck, Bell, Settings } from 'lucide-react';

export default function MemberNotifications() {
  const unreadCount = mockNotifications.filter(n => !n.read).length;
  
  return (
    <DashboardLayout title="Notifications">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Notifications</h2>
              <p className="text-sm text-muted-foreground">{unreadCount} unread messages</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="votes">Votes</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardContent className="p-2 divide-y">
                {mockNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unread">
            <Card>
              <CardContent className="p-2 divide-y">
                {mockNotifications
                  .filter(n => !n.read)
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="votes">
            <Card>
              <CardContent className="p-2 divide-y">
                {mockNotifications
                  .filter(n => n.type === 'success')
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardContent className="p-2 divide-y">
                {mockNotifications
                  .filter(n => n.type === 'info' || n.type === 'warning')
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
