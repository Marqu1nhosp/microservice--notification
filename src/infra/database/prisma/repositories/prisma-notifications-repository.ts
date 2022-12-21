import { Notification } from "@application/entities/notification";
import { Injectable } from '@nestjs/common';
import { notContains } from "class-validator";
import { NotificationsRepository } from "../../../../application/repositories/notifications-repository";
import { PrismaNotificationsMapper } from "../mappers/prisma-notification-mapper";
import { PrismaService } from "../prisma.service";


@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
   constructor(private prisma: PrismaService){}

   async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
       const notifications = await this.prisma.notification.findMany({
        where: {
            recipientId,
        },
       })

       return notifications.map(PrismaNotificationsMapper.toDomain)
    }

    async findById(notificationId: string): Promise<Notification | null> {
       const notification = await this.prisma.notification.findUnique({
        where: {
            id: notificationId,
        }
       })

       if(!notification){
        return null;
       }

       return PrismaNotificationsMapper.toDomain(notification);
    }
    
   async countManyByRecipientId(recipientId: string): Promise<number> {
        const count = await this.prisma.notification.count({
            where: {
                recipientId,
            },
        });

        return count;   
    }

   async create(notification: Notification): Promise<void> {
        const raw = PrismaNotificationsMapper.toPrisma(notification)

        await this.prisma.notification.create({
            data: raw,
        })
    }

    async save(notification: Notification): Promise<void> {
        const raw = PrismaNotificationsMapper.toPrisma(notification)

        await this.prisma.notification.update({
            where:{
                id: raw.id
            },
            data: raw
        })
    }
}