import type { Column, Task } from '@prisma/client';

export type DndColumnsEvent = CustomEvent<
	DndEvent<
		Column & {
			tasks: Task[];
		}
	>
>;

export type DndTasksEvent = CustomEvent<DndEvent<Task>>;
