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
    const todos = await this.prisma.$queryRaw<
      PrismaTodoDetails[]
    >`SELECT T.id, T.title, T.description, T.user_id,
    COALESCE(selection_amount.amount, 0) as amount,
    COALESCE(selection_completed.completed, 0) as completed
    FROM todos as T
    LEFT JOIN 
    (
      SELECT todo_items.todo_id,
      CAST(COUNT(*) as INT) AS amount
      FROM todo_items
      GROUP BY todo_items.todo_id
    )
    AS selection_amount
    ON T.id = selection_amount.todo_id
    LEFT JOIN
    (
      SELECT todo_items.todo_id,
      CAST(COUNT(*) as INT) AS completed
      FROM todo_items
      WHERE todo_items.check = true
      GROUP BY todo_items.todo_id
    ) as selection_completed
    ON T.id = selection_completed.todo_id
    WHERE T.user_id = ${userId}`;

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
