"use client";

import { Bell, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Notification {
  id: string;
  type: 'alert' | 'trade' | 'info' | 'update';
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'alert', title: 'High Market Volatility Alert', message: 'NASDAQ Composite shows high volatility. Consider adjusting strategies.', time: '2m ago', read: false },
  { id: '2', type: 'trade', title: 'Trade Executed: BUY AAPL', message: 'Successfully bought 10 shares of AAPL at $175.30.', time: '5m ago', read: false },
  { id: '3', type: 'info', title: 'Portfolio Update', message: 'Your portfolio value increased by 1.2% today.', time: '15m ago', read: true },
  { id: '4', type: 'update', title: 'AI Model Updated', message: 'The trading analysis model has been updated with new data.', time: '1h ago', read: true },
  { id: '5', type: 'alert', title: 'Price Drop: TSLA', message: 'TSLA dropped by 5% in the last hour. Review position.', time: '2h ago', read: false },
  { id: '6', type: 'trade', title: 'Trade Executed: SELL MSFT', message: 'Successfully sold 20 shares of MSFT at $450.10.', time: '3h ago', read: true },
];

const getIconForType = (type: Notification['type']) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-destructive drop-shadow-neon-primary" />;
    case 'trade':
      return <CheckCircle2 className="h-5 w-5 text-green-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.7)]" />;
    case 'update':
      return <Bell className="h-5 w-5 text-primary drop-shadow-neon-primary" />;
    default:
      return <Bell className="h-5 w-5 text-primary drop-shadow-neon-primary" />;
  }
};

export function NotificationsPanel() {
  return (
    <Card className="w-full shadow-xl hover:shadow-accent/20 transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Bell className="h-8 w-8 mr-3 text-primary drop-shadow-neon-primary" />
          <CardTitle className="text-2xl font-headline">Real-time Notifications</CardTitle>
        </div>
        <CardDescription>Stay updated with market movements, trades, and alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border flex items-start space-x-3 transition-all ${
                  !notification.read ? 'bg-primary/5 border-primary/20' : 'bg-card/50 border-border'
                }`}
              >
                <div className="flex-shrink-0 mt-1">{getIconForType(notification.type)}</div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center">
                    <h4 className={`font-semibold ${!notification.read ? 'text-primary-foreground' : 'text-foreground'}`}>{notification.title}</h4>
                    {!notification.read && <Badge variant="default" className="text-xs bg-primary text-primary-foreground">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
             {mockNotifications.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No new notifications.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
