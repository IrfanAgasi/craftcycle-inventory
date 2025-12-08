import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T>({ 
  data, 
  columns, 
  className,
  emptyMessage = "Tidak ada data"
}: DataTableProps<T>) {
  return (
    <div className={cn(
      "rounded-2xl border-2 border-border/50 overflow-hidden",
      "bg-card/80 backdrop-blur-sm shadow-card",
      className
    )}>
      <Table>
        <TableHeader>
          <TableRow className="border-b-2 border-border/50 bg-muted/30 hover:bg-muted/30">
            {columns.map((column) => (
              <TableHead 
                key={column.key} 
                className={cn(
                  "font-semibold text-foreground py-4",
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={columns.length} 
                className="h-32 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow 
                key={index}
                className="border-b border-border/30 hover:bg-accent/30 transition-colors"
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn("py-4", column.className)}>
                    {column.render 
                      ? column.render(item) 
                      : String((item as Record<string, unknown>)[column.key] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
