/**
 * Smart Notifications Component
 * Multi-channel smart notifications with preferences
 */

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Settings, Check, X } from 'lucide-react';
import { EnhancedCard, EnhancedCardContent } from '@/components/ui/enhanced-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'alert' | 'info';
  channel: 'push' | 'email' | 'sms' | 'whatsapp';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationPreferences {
  orderUpdates: { push: boolean; email: boolean; sms: boolean; whatsapp: boolean };
  promotions: { push: boolean; email: boolean; sms: boolean; whatsapp: boolean };
  priceAlerts: { push: boolean; email: boolean; sms: boolean; whatsapp: boolean };
  stockAlerts: { push: boolean; email: boolean; sms: boolean; whatsapp: boolean };
}

export function SmartNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'تم شحن طلبك',
      message: 'طلب #1234 في الطريق إليك',
      type: 'order',
      channel: 'push',
      timestamp: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'عرض خاص!',
      message: 'خصم 20% على الإلكترونيات',
      type: 'promo',
      channel: 'email',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
  ]);

  const [preferences, setPreferences] = useState<NotificationPreferences>({
    orderUpdates: { push: true, email: true, sms: false, whatsapp: true },
    promotions: { push: true, email: true, sms: false, whatsapp: false },
    priceAlerts: { push: true, email: false, sms: false, whatsapp: true },
    stockAlerts: { push: true, email: true, sms: false, whatsapp: true },
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    const colors = {
      order: 'bg-blue-500',
      promo: 'bg-purple-500',
      alert: 'bg-red-500',
      info: 'bg-green-500',
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getChannelIcon = (channel: string) => {
    const icons = {
      push: <Bell className="h-4 w-4" />,
      email: <Mail className="h-4 w-4" />,
      sms: <MessageSquare className="h-4 w-4" />,
      whatsapp: <Smartphone className="h-4 w-4" />,
    };
    return icons[channel as keyof typeof icons];
  };

  const togglePreference = (category: keyof NotificationPreferences, channel: keyof NotificationPreferences['orderUpdates']) => {
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [channel]: !preferences[category][channel],
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">الإشعارات</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount}</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 ml-2" />
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 ml-2" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Settings className="h-4 w-4 ml-2" />
            التفضيلات
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          {notifications.length === 0 ? (
            <EnhancedCard>
              <EnhancedCardContent className="p-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">لا توجد إشعارات</p>
              </EnhancedCardContent>
            </EnhancedCard>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <EnhancedCard
                  key={notification.id}
                  className={notification.read ? 'opacity-60' : ''}
                >
                  <EnhancedCardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)} text-white`}>
                        {getChannelIcon(notification.channel)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold">{notification.title}</h4>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 hover:bg-accent rounded"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-destructive/10 hover:text-destructive rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{notification.timestamp.toLocaleTimeString('ar-EG')}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {notification.channel === 'push' && 'إشعار'}
                            {notification.channel === 'email' && 'بريد'}
                            {notification.channel === 'sms' && 'رسالة'}
                            {notification.channel === 'whatsapp' && 'واتساب'}
                          </Badge>
                        </div>

                        {notification.actionUrl && (
                          <Button size="sm" variant="link" className="p-0 h-auto mt-2">
                            عرض التفاصيل
                          </Button>
                        )}
                      </div>
                    </div>
                  </EnhancedCardContent>
                </EnhancedCard>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-4">
          <EnhancedCard>
            <EnhancedCardContent className="p-6">
              <h3 className="font-bold mb-4">تفضيلات الإشعارات</h3>

              <div className="space-y-6">
                {/* Order Updates */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    تحديثات الطلبات
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(preferences.orderUpdates).map(([channel, enabled]) => (
                      <div key={channel} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel)}
                          <span className="text-sm capitalize">{channel}</span>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => togglePreference('orderUpdates', channel as any)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promotions */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    العروض والتخفيضات
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(preferences.promotions).map(([channel, enabled]) => (
                      <div key={channel} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel)}
                          <span className="text-sm capitalize">{channel}</span>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => togglePreference('promotions', channel as any)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Alerts */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    تنبيهات الأسعار
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(preferences.priceAlerts).map(([channel, enabled]) => (
                      <div key={channel} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel)}
                          <span className="text-sm capitalize">{channel}</span>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => togglePreference('priceAlerts', channel as any)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Alerts */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    تنبيهات توفر المنتجات
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(preferences.stockAlerts).map(([channel, enabled]) => (
                      <div key={channel} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          {getChannelIcon(channel)}
                          <span className="text-sm capitalize">{channel}</span>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={() => togglePreference('stockAlerts', channel as any)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6">
                <Check className="h-4 w-4 ml-2" />
                حفظ التفضيلات
              </Button>
            </EnhancedCardContent>
          </EnhancedCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SmartNotifications;
