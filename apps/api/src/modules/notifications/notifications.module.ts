import { Controller, Get, Injectable, Module, Param, Patch, Query } from '@nestjs/common';
import { INotification } from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: DatabaseService) {}

  async getRecentNotifications(userId?: string): Promise<INotification[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        user_id: string;
        title: string;
        body: string;
        type: string;
        data: Record<string, unknown>;
        is_read: boolean;
        created_at: string;
      }>(
        userId
          ? `SELECT id, user_id, title, body, type, data, is_read, created_at FROM public.notifications WHERE user_id = $1::uuid ORDER BY created_at DESC LIMIT 50`
          : `SELECT id, user_id, title, body, type, data, is_read, created_at FROM public.notifications ORDER BY created_at DESC LIMIT 50`,
        userId ? [userId] : [],
      );
      return rows.map((r) => ({
        id: Number(r.id),
        userId: r.user_id,
        title: r.title,
        body: r.body,
        type: r.type,
        data: r.data,
        isRead: r.is_read,
        createdAt: r.created_at,
      }));
    }

    return [
      {
        id: 1,
        userId: userId ?? '11111111-1111-4111-8111-111111111111',
        title: 'Đối tác Hoàng Thị Mai đang di chuyển',
        body: 'Dự kiến đến nơi trong 10 phút.',
        type: 'order_status',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async markAsRead(notificationId: string) {
    if (this.db.isConnected) {
      await this.db.query(`UPDATE public.notifications SET is_read = true WHERE id = $1::bigint`, [
        notificationId,
      ]);
    }
    return { id: Number(notificationId), isRead: true };
  }
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.notificationsService.getRecentNotifications(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
