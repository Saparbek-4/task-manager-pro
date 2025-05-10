import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AssignmentIcon from '@mui/icons-material/Assignment';
import styled from 'styled-components';

// Стили компонента колонки
const Container = styled.div`
  background: white;
  border-radius: 12px;
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const ColumnHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColumnName = styled.span`
  font-size: 0.95rem;
  color: #334155;
`;

const TaskCount = styled.span`
  background: #e2e8f0;
  color: #475569;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
`;

const ColumnActions = styled.div`
  display: flex;
  gap: 0.25rem;
`;

// transient prop $isDraggingOver to avoid forwarding to DOM
const TaskList = styled.div<{ $isDraggingOver: boolean }>`
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
  background: ${({ $isDraggingOver }) => ($isDraggingOver ? '#f1f5f9' : 'white')};
  transition: background 0.2s;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const AddTaskBtn = styled(IconButton)`
  text-transform: none;
  justify-content: center;
  border-radius: 0;
  padding: 0.75rem;
  color: #64748b;
  border-top: 1px solid #e2e8f0;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #3b82f6;
  }
`;

// Пропсы компонента
interface ColumnContainerProps {
    column: { id: string; name: string };
    tasks: { id: string; title: string }[];
    onOpenColumnMenu: (e: React.MouseEvent<HTMLElement>, columnId: string) => void;
    onAddTask: (columnId: string) => void;
}

const ColumnContainer: React.FC<ColumnContainerProps> = ({
                                                             column,
                                                             tasks,
                                                             onOpenColumnMenu,
                                                             onAddTask,
                                                         }) => (
    <Droppable droppableId={column.id} isDropDisabled={false}>
        {(provided, snapshot) => (
            <Container ref={provided.innerRef} {...provided.droppableProps}>
                <ColumnHeader>
                    <ColumnTitle>
                        <ColumnName>{column.name}</ColumnName>
                        <TaskCount>{tasks.length}</TaskCount>
                    </ColumnTitle>
                    <ColumnActions>
                        <IconButton size="small" onClick={(e) => onOpenColumnMenu(e, column.id)}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </ColumnActions>
                </ColumnHeader>

                <TaskList $isDraggingOver={snapshot.isDraggingOver}>
                    {tasks.map((task, idx) => (
                        <div key={task.id}>{task.title}</div>
                    ))}
                    {provided.placeholder}
                    {tasks.length === 0 && (
                        <div
                            style={{
                                padding: '1.5rem 1rem',
                                textAlign: 'center',
                                color: '#94a3b8',
                                fontSize: '0.875rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <AssignmentIcon sx={{ fontSize: '2rem', opacity: 0.4 }} />
                            No tasks yet
                        </div>
                    )}
                </TaskList>

                <AddTaskBtn size="small" onClick={() => onAddTask(column.id)}>
                    <AddIcon />
                </AddTaskBtn>
            </Container>
        )}
    </Droppable>
);

export default ColumnContainer;
