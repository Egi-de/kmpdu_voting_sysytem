import { cn } from '@/lib/utils';
import { Notification } from '@/types/voting';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationItemProps {
  notification: Notification;
  className?: string;
}

export function NotificationItem({ notification, className }: NotificationItemProps) {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    info: Info,
    error: XCircle,
  };

  const colors = {
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
    error: 'text-destructive',
  };

  const bgColors = {
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    info: 'bg-info/10',
    error: 'bg-destructive/10',
  };

  const Icon = icons[notification.type];

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg p-3 transition-colors',
        !notification.read && 'bg-muted/50',
        className
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full',
          bgColors[notification.type]
        )}
      >
        <Icon className={cn('h-4 w-4', colors[notification.type])} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className={cn('font-medium text-sm', !notification.read && 'text-foreground')}>
            {notification.title}
          </h4>
          {!notification.read && (
            <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}
