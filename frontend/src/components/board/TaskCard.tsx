import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { IconButton, Avatar, Typography } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import styled from 'styled-components';

// Стили
const Card = styled.div<{ isDragging: boolean; priority?: string }>`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: ${({ isDragging }) =>
    isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)'};
  cursor: grab;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  border-left: 3px solid ${({ priority }) =>
    priority === 'HIGH' ? '#ef4444' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981'};

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const Title = styled.h3`
  font-weight: 500;
  margin: 0;
  color: #1e293b;
  font-size: 0.95rem;
  word-break: break-word;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
`;

const DueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
`;

const PriorityChip = styled.div<{ priority: string }>`
  height: 24px;
  padding: 0 6px;
  font-size: 0.7rem;
  font-weight: 500;
  border-radius: 12px;
  background: ${({ priority }) =>
          priority === 'HIGH' ? '#fee2e2' : priority === 'MEDIUM' ? '#fef3c7' : '#d1fae5'};
  color: ${({ priority }) =>
          priority === 'HIGH' ? '#b91c1c' : priority === 'MEDIUM' ? '#b45309' : '#047857'};
`;

// Интерфейсы
interface Task {
    id: string;
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    assigneeId?: string | null;
}
interface Member { id: string; name?: string; email: string }

interface TaskCardProps {
    task: Task;
    index: number;
    members: Member[];
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, members, onEdit, onDelete }) => {
    const assignee = members.find(m => m.id === task.assigneeId);
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    priority={task.priority}
                >
                    <Header>
                        <Title>{task.title}</Title>
                        <div>
                            <IconButton size="small" onClick={() => onEdit(task)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(task.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </div>
                    </Header>

                    {task.description && <Description>{task.description}</Description>}

                    <Meta>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {task.priority && (
                                <PriorityChip priority={task.priority}>{task.priority}</PriorityChip>
                            )}
                            {task.dueDate && (
                                <DueDate>
                                    <AccessTimeIcon fontSize="small" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </DueDate>
                            )}
                            {assignee && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                        {assignee.name?.[0]?.toUpperCase() || assignee.email[0].toUpperCase()}
                                    </Avatar>
                                    <Typography variant="caption" color="text.secondary">
                                        {assignee.name || assignee.email}
                                    </Typography>
                                </div>
                            )}
                        </div>
                    </Meta>
                </Card>
            )}
        </Draggable>
    );
};

export default TaskCard;
