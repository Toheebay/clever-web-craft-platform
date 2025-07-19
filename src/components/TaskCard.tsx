import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Flag, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: Date;
  tags: string[];
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete, onEdit }: TaskCardProps) {
  const priorityColors = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning text-warning-foreground",
    high: "bg-destructive text-destructive-foreground"
  };

  const statusColors = {
    todo: "bg-muted text-muted-foreground",
    'in-progress': "bg-accent text-accent-foreground",
    completed: "bg-success text-success-foreground"
  };

  const isOverdue = new Date() > task.dueDate && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  return (
    <Card className={`group transition-all duration-300 hover:shadow-glow hover:scale-[1.02] ${
      isCompleted ? 'opacity-75' : ''
    } ${isOverdue ? 'border-destructive/50' : 'border-border/50'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`font-semibold text-base leading-tight ${
                isCompleted ? 'line-through text-muted-foreground' : ''
              }`}>
                {task.title}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem onClick={() => onEdit(task.id)}>
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className={`text-sm mb-3 text-muted-foreground ${
                isCompleted ? 'line-through' : ''
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={priorityColors[task.priority]} variant="secondary">
                <Flag className="w-3 h-3 mr-1" />
                {task.priority}
              </Badge>
              
              <Badge className={statusColors[task.status]} variant="secondary">
                {task.status.replace('-', ' ')}
              </Badge>

              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                  {task.dueDate.toLocaleDateString()}
                </span>
              </div>
              
              {isOverdue && (
                <div className="flex items-center gap-1 text-destructive">
                  <Clock className="w-3 h-3" />
                  <span className="font-medium">Overdue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}