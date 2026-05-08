// column identifiers
export type ColumnId = "todo" | "inProgress" | "done";

// represents a single task item
export interface Task {
  id: number;           // GitHub issue number
  nodeId: string;       // required for deletion via GraphQL
  content: string;      // GitHub issue title
  description: string;  // GitHub issue description
}

// represents a column structure
export interface Column {
  name: string;         // display name of the column
  items: Task[];        // list of tasks inside the column
}

// object that maps column IDs to their data
export type Columns = Record<ColumnId, Column>;

// represents a task currently being dragged
export interface DraggedItem {
  columnId: ColumnId;   // source column
  item: Task;           // task being dragged
}