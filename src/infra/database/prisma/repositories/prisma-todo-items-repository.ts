import { TodoItemRepository } from '@/domain/to-do/repositories/todo-item-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TodoItem } from '@/domain/to-do/entities/todo-item';
import { PrismaTodoItemMapper } from '../mappers/prisma-todo-item-mapper';

@Injectable()
export class PrismaTodoItemsRepository implements TodoItemRepository {
  constructor(private prisma: PrismaService) {}

  async save(todoItem: TodoItem): Promise<void> {
    const data = PrismaTodoItemMapper.toPrisma(todoItem);

    await this.prisma.todoItem.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  async fetchItemsByTodoId(todoId: string): Promise<TodoItem[]> {
    const todoItems = await this.prisma.todoItem.findMany({
      where: {
        todoId,
      },
    });

    return todoItems.map(PrismaTodoItemMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.todoItem.delete({
      where: {
        id,
      },
    });
  }

  async findById(id: string): Promise<TodoItem | null> {
    const todoItem = await this.prisma.todoItem.findUnique({
      where: {
        id,
      },
    });

    if (!todoItem) {
      return null;
    }

    return PrismaTodoItemMapper.toDomain(todoItem);
  }

  async create(todoItem: TodoItem): Promise<void> {
    const data = PrismaTodoItemMapper.toPrisma(todoItem);

    await this.prisma.todoItem.create({ data });
  }
}
