import { TodoItemRepository } from '@/domain/to-do/repositories/todo-item-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TodoItem } from '@/domain/to-do/entities/todo-item';
import { PrismaTodoItemMapper } from '../mappers/prisma-todo-item-mapper';

@Injectable()
export class PrismaTodoItemsRepository implements TodoItemRepository {
  constructor(private prisma: PrismaService) {}

  async create(todoItem: TodoItem): Promise<void> {
    const data = PrismaTodoItemMapper.toPrisma(todoItem);

    await this.prisma.todoItem.create({ data });
  }
}
