import { Todo } from '@/domain/to-do/entities/todo';
import { TodoRepository } from '@/domain/to-do/repositories/todo-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTodoMapper } from '../mappers/prisma-todo-mapper';

@Injectable()
export class PrismaTodoRepository implements TodoRepository {
  constructor(private prisma: PrismaService) {}

  async getTodosByUserId(userId: string): Promise<Todo[]> {
    const todos = await this.prisma.todo.findMany({
      where: {
        userId,
      },
    });

    return todos.map(PrismaTodoMapper.toDomain);
  }

  async delete(todo: Todo): Promise<void> {
    const data = PrismaTodoMapper.toPrisma(todo);

    await this.prisma.todo.delete({
      where: {
        id: data.id,
      },
    });
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = await this.prisma.todo.findUnique({
      where: {
        id,
      },
    });

    if (!todo) {
      return null;
    }

    return PrismaTodoMapper.toDomain(todo);
  }

  async create(todo: Todo): Promise<void> {
    const data = PrismaTodoMapper.toPrisma(todo);

    await this.prisma.todo.create({ data });
  }
}
