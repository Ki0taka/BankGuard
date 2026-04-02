import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    console.log(`[NotificationService] Creating notification in DB for user: ${createNotificationDto.userId}`);
    const notification = this.notificationRepository.create(createNotificationDto);
    const saved = await this.notificationRepository.save(notification);
    console.log(`[NotificationService] Notification saved correctly. Emitting WebSocket event...`);
    
    // Emit real-time update
    this.notificationGateway.sendNotificationToUser(saved.userId, saved);
    
    return saved;
  }

  async findAllForUser(userId: string) {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string) {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepository.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }
}
