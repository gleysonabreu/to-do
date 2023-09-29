import { Todo } from '@/domain/to-do/entities/todo';
import { TodoRepository } from '@/domain/to-do/repositories/todo-repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { PrismaTodoMapper } from '../mappers/prisma-todo-mapper';
import { TodoDetails } from '@/domain/to-do/entities/value-objects/todo-details';
import {
  PrismaTodoDetails,
  PrismaTodoDetailsMapper,
} from '../mappers/prisma-todo-detail-mapper';

@Injectable()
export class PrismaTodoRepository implements TodoRepository {
  constructor(private prisma: PrismaService) {}

  async getTodosByUserId(userId: string): Promise<TodoDetails[]> {
    const todos = await this.prisma.$queryRaw<PrismaTodoDetails[]>`SELECT *, 
      (SELECT CAST(COUNT(*) as DECIMAL) FROM todos as T JOIN todo_items as TI ON T.id = TI.todo_id WHERE T.user_id = ${userId}) as amount,
      (SELECT CAST(COUNT(*) as DECIMAL) FROM todos as T JOIN todo_items as TI ON T.id = TI.todo_id WHERE T.user_id = ${userId} AND TI.check = true) as completed
      FROM todos WHERE user_id = ${userId}`;

    return todos.map(PrismaTodoDetailsMapper.toDomain);
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
