-- DropForeignKey
ALTER TABLE "todo_items" DROP CONSTRAINT "todo_items_todo_id_fkey";

-- AddForeignKey
ALTER TABLE "todo_items" ADD CONSTRAINT "todo_items_todo_id_fkey" FOREIGN KEY ("todo_id") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
