import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.ts';
import styled from 'styled-components';
import Confetti from 'react-confetti';

import {
    Grid,
    Skeleton,
    Snackbar,
    Alert,
    Button as MUIButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Fade,
    Tooltip,
    Avatar,
    Badge,
    Divider,
    FormControl,
    InputLabel,
    Select,
    Button,
} from '@mui/material';
import {
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    AccessTime as AccessTimeIcon,
    FilterList as FilterListIcon,
    Search as SearchI,
    Star as StarIcon,
    StarBorder as StarBorderIcon,
    Assignment as AssignmentIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Column { id: string; name: string; order: number;}
interface Task {
    id: string;
    title: string;
    description?: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    deadline?: string;
    columnId: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assigneeIds: string[]
}

// ─────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 1440px;
  margin: 0 auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;


// Updated Header with softer appearance
const BoardHeader = styled.div`
  padding: 1rem 2rem;
  top: 0;
  z-index: 100;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary || '#fff'};
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;


const BoardTitle = styled.div`
  display: flex;
  align-items: center;
`;

const BoardHeading = styled.h1`
  font-size: 1.75rem;  /* было 2rem */
  font-weight: 600;
  margin: 0;
  color: ${({ theme }) => theme.colors.textOnPrimary || '#fff'};
  display: flex;
  align-items: center;
  gap: 0.75rem;        /* совпадает с LogoContainer gap */
`;

const BoardActions = styled.div`
  display: flex;
  gap: 1rem; /* Increased spacing between action items */
  align-items: center;
`;

// Enhanced search with better visual cues
const SearchBox = styled.div`
  position: relative;
  width: 280px;
  transition: all 0.3s;
  &:focus-within {
    width: 320px;
  }
`;

const SearchIcon = styled(SearchI)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none; /* Ensure clicks pass through to input */
`;

const SearchInput = styled.input`
  border: none;
  border-radius: 24px;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s;
  background: ${({ theme }) => theme.colors.background};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    background: white;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const BackButton = styled(MUIButton)`
  text-transform: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.textOnPrimary || '#fff'} !important;
  background: rgba(255, 255, 255, 0.15);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);

  .MuiSvgIcon-root {
    font-size: 1.25rem;
    filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.2));
  }

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background: rgba(255, 255, 255, 0.35);
  }
`;


const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
`;

const BoardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
`;

const ColumnsWrapper = styled.div`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 0.5rem;
  flex: 1;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const ColumnContainer = styled.div`
  background: white;
  border-radius: 12px;
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
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

const TaskList = styled.div<{ isDraggingOver: boolean }>`
  flex: 1;
  padding: 0.75rem;
  overflow-y: auto;
  background: ${({ isDraggingOver }) => (isDraggingOver ? '#f1f5f9' : 'white')};
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

const TaskCard = styled.div<{ isDragging: boolean; priority?: string }>`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: grab;
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
  overflow: hidden;

  box-shadow: ${({ isDragging }) =>
          isDragging
                  ? '0 12px 24px rgba(0,0,0,0.1)'
                  : '0 1px 2px rgba(0,0,0,0.05)'};

  transform: ${({ isDragging }) => (isDragging ? 'scale(1.02)' : 'scale(1)')};

  border-left: 4px solid ${({ priority }) =>
          priority === 'HIGH' ? '#ef4444' :
                  priority === 'MEDIUM' ? '#f59e0b' :
                          priority === 'LOW' ? '#10b981' : '#e2e8f0'};

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ priority }) =>
            priority === 'HIGH' ? '#ef4444' :
                    priority === 'MEDIUM' ? '#f59e0b' :
                            priority === 'LOW' ? '#10b981' : 'transparent'};
  }
`;


const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
`;

const TaskTitle = styled.h3`
  font-weight: 500;
  margin: 0;
  color: #1e293b;
  font-size: 0.95rem;
  word-break: break-word;
`;

const TaskDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0;
  line-height: 1.4;
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
`;

const TaskDueDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  font-size: 0.75rem;
`;

const PriorityChip = styled(Chip)<{ priority: string }>`
  height: 24px;
  font-size: 0.7rem;
  font-weight: 500;
  background: ${({ priority }) =>
    priority === 'HIGH' ? '#fee2e2' :
        priority === 'MEDIUM' ? '#fef3c7' :
            '#d1fae5'};
  color: ${({ priority }) =>
    priority === 'HIGH' ? '#b91c1c' :
        priority === 'MEDIUM' ? '#b45309' :
            '#047857'};
  border: none;
`;

const AddTaskBtn = styled(MUIButton)`
  text-transform: none;
  justify-content: center;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundLight};
    color: ${({ theme }) => theme.colors.primary};
  }
`;


const AddColumnBtn = styled(MUIButton)`
  text-transform: none;
  border-radius: 8px;
  height: 100%;
  border: 2px dashed #e2e8f0;
  color: #64748b;
  padding: 1rem;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #3b82f6;
  }
`;

const ErrorState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc2626;
  background: #fee2e2;
  border-radius: 12px;
  margin: 1rem;
`;

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 16px;
    overflow: hidden;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.5rem;
  position: relative;

  h2 {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  svg {
    font-size: 1.5rem;
  }
`;

const DialogCloseButton = styled(IconButton)`
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: white;
`;

const DialogDivider = styled(Divider)`
  margin: 0.5rem 0 1.5rem;
`;

const TaskStatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  min-height: 200px;
  border-radius: 8px;
  background: #f8fafc;
  margin: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 2.5rem;
    opacity: 0.5;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }

  button {
    margin-top: 1rem;
  }
`;

interface StatusButtonProps {
    $isActive: boolean;
    $status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export const StatusButton = styled(Button).withConfig({
    shouldForwardProp: (prop) => !['$isActive', '$status'].includes(prop)
})<StatusButtonProps>`
  background-color: ${({ $isActive, $status }) =>
          $isActive
                  ? ($status === 'TODO'
                          ? '#dbeafe !important'
                          : $status === 'IN_PROGRESS'
                                  ? '#fef08a !important'
                                  : '#bbf7d0 !important')
                  : 'transparent !important'};
  color: ${({ $isActive }) => ($isActive ? '#000 !important' : '#3b82f6 !important')};
  border: 1px solid #e2e8f0;
  font-weight: 600;
  text-transform: none;
  box-shadow: none;

  &:hover {
    background-color: ${({ $status }) =>
            $status === 'TODO'
                    ? '#93c5fd !important'
                    : $status === 'IN_PROGRESS'
                            ? '#fde047 !important'
                            : '#4ade80 !important'};
    color: #000 !important;
  }
`;

const PriorityButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
`;

interface PriorityButtonProps {
    $isActive: boolean;
    $priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const PriorityButton = styled(Button).withConfig({
    shouldForwardProp: (prop) => !['$isActive', '$priority'].includes(prop)
})<PriorityButtonProps>`
  background-color: ${({ $isActive, $priority }) =>
          $isActive
                  ? ($priority === 'LOW'
                          ? '#86efac !important'
                          : $priority === 'MEDIUM'
                                  ? '#facc15 !important'
                                  : '#f87171 !important')
                  : 'transparent !important'};
  color: ${({ $isActive }) => ($isActive ? '#000 !important' : '#3b82f6 !important')};
  border: 1px solid #e2e8f0;
  font-weight: 600;
  text-transform: none;
  box-shadow: none;

  &:hover {
    background-color: ${({ $priority }) =>
            $priority === 'LOW'
                    ? '#4ade80 !important'
                    : $priority === 'MEDIUM'
                            ? '#eab308 !important'
                            : '#ef4444 !important'};
    color: #000 !important;
  }
`;

const ColumnSkeleton = styled(Skeleton)`
  border-radius: 12px;
  height: 100%;
  min-height: 400px;
  transform: none;
`;

const TaskSkeleton = styled(Skeleton)`
  border-radius: 8px;
  height: 120px;
  margin-bottom: 0.75rem;
  transform: none;
`;



// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────
const BoardPage: React.FC = () => {
    const { projectId, boardId } = useParams<{ projectId: string; boardId: string }>();
    const navigate = useNavigate();

    const [columns, setColumns] = useState<Column[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userRole, setUserRole] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Task-form state
    const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>();
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('TODO');

    // Column-form state
    const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
    const [currentColumn, setCurrentColumn] = useState<Column | null>(null);
    const [newColumnName, setNewColumnName] = useState('');

    // Column menu state
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [selectedAssigneeIds, setSelectedAssigneeIds] = useState<string[]>([]);

    const [previewTask, setPreviewTask] = useState<Task | null>(null);

    const notify = (message: string, severity: 'success' | 'error' = 'success') => {
        setSnackbar({ open: true, message, severity });
    };
    const [boardName, setBoardName] = useState<string>('Project Board');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/user/me");
                setUserRole(res.data.role);
            } catch (err) {
                console.error("Ошибка при получении пользователя", err);
            }
        };
        fetchUser();
    }, []);
    // ─── Load columns + tasks ─────────────────────────────
    useEffect(() => {
        if (!boardId || !projectId) return;
        setLoading(true);
        (async () => {
            try {
                // 🆕 Fetch all boards of the project
                const boardsRes = await axiosInstance.get(`/boards/project/${projectId}`);
                const foundBoard = boardsRes.data.find((b: any) => b.id === boardId);

                if (foundBoard) {
                    setBoardName(foundBoard.name);
                } else {
                    setBoardName('Unknown Board');
                }

                // Fetch columns
                const colsRes = await axiosInstance.get<Column[]>(`/columns/by-board/${boardId}`);
                const sorted = colsRes.data.sort((a, b) => a.order - b.order);
                setColumns(sorted);

                // Fetch tasks
                const lists = await Promise.all(
                    sorted.map(col => axiosInstance.get<Task[]>(`/tasks/column/${col.id}`).then(r => r.data))
                );
                setTasks(lists.flat());

                // Fetch members
                const membersRes = await axiosInstance.get(`/projects/${projectId}/members`);
                setProjectMembers(membersRes.data);

                setError('');
            } catch (e) {
                console.error(e);
                setError('Failed to load board data');
                notify('Error loading board', 'error');
            } finally {
                setLoading(false);
            }
        })();
    }, [boardId]);



    // Filter tasks based on search term
    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // ─── Drag & drop handler ─────────────────────────────
    const onDragEnd = (res: DropResult) => {
        const { source, destination, draggableId } = res;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index) return;

        const updated = Array.from(tasks);
        const idx = updated.findIndex(t => t.id === draggableId);
        if (idx === -1) return;

        const movedTask = { ...updated[idx], columnId: destination.droppableId };
        updated[idx] = movedTask;
        setTasks(updated);

        axiosInstance
            .put(`/tasks/${draggableId}`, {
                title: movedTask.title,
                description: movedTask.description,
                priority: movedTask.priority,
                status: movedTask.status,
                deadline: movedTask.deadline,
                columnId: movedTask.columnId,
                assigneeIds: movedTask.assigneeIds || [] // ✅ исправлено
            })
            .catch(err => {
                console.error(err);
                notify('Failed to move task', 'error');
                setTasks(tasks); // вернуть старое состояние
            });
    };



    const tasksByColumn = filteredTasks.reduce<Record<string, Task[]>>(
        (acc, t) => {
            (acc[t.columnId] ||= []).push(t);
            return acc;
        },
        {}
    );

    // ─── Task dialog handlers ────────────────────────────
    const resetTaskForm = () => {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskPriority('LOW');
        setNewTaskDueDate('');
        setNewTaskStatus('TODO');
        setSelectedAssigneeIds([]);
        setCurrentTask({ columnId: ''} as Task);
    };

    const openAddTaskModal = (colId: string) => {
        resetTaskForm();
        setCurrentTask({} as Task);
        setCurrentTask(prev => ({ ...(prev || {}), columnId: colId } as Task));
        setNewTaskPriority('LOW');
        setSelectedAssigneeIds([])
        setIsTaskDialogOpen(true);
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return ''; // If undefined or empty
        const parsed = new Date(dateString);
        if (isNaN(parsed.getTime())) return ''; // If invalid date
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const day = String(parsed.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const openEditTaskModal = (task: Task) => {
        setCurrentTask(task);
        setNewTaskTitle(task.title || '');
        setNewTaskDescription(task.description || '');
        setNewTaskPriority(task.priority || 'LOW');
        setNewTaskDueDate(task.deadline ? formatDateForInput(task.deadline) : '');
        setNewTaskStatus(task.status || 'TODO');
        setSelectedAssigneeIds(task.assigneeIds ?? []);
        setIsTaskDialogOpen(true);
    };


    const [projectMembers, setProjectMembers] = useState<{ userId: string; username?: string; email: string; avatarUrl?: string; }[]>([]);


    const handleAddOrUpdateTask = () => {
        if (!newTaskTitle.trim() || !currentTask) return;
        const payload = {
            title: newTaskTitle,
            description: newTaskDescription,
            priority: newTaskPriority,
            deadline: newTaskDueDate || null,
            columnId: currentTask.columnId,
            status: newTaskStatus,
            assigneeIds: selectedAssigneeIds
        };

        const call = currentTask.id
            ? axiosInstance.put<Task>(`/tasks/${currentTask.id}`, payload)
            : axiosInstance.post<Task>(`/tasks`, payload);

        call
            .then(r => {
                setTasks(prev =>
                    currentTask.id
                        ? prev.map(t => t.id === r.data.id ? r.data : t)
                        : [...prev, r.data]
                );
                notify(currentTask.id ? 'Task updated' : 'Task added');
                setIsTaskDialogOpen(false);
                resetTaskForm();
            })
            .catch(err => {
                console.error(err);
                console.error("Error payload:", payload);
                notify(`Failed to ${currentTask.id ? 'update' : 'add'} task`, 'error');
            });
    };

    // ─── Delete task ─────────────────────────────────────
    const handleDeleteTask = (id: string) => {
        if (!window.confirm('Delete this task?')) return;
        axiosInstance
            .delete(`/tasks/${id}`)
            .then(() => {
                setTasks(prev => prev.filter(t => t.id !== id));
                notify('Task deleted');
            })
            .catch(err => {
                console.error(err);
                notify('Failed to delete task', 'error');
            });
    };

    // ─── Column dialog handlers ──────────────────────────
    const openAddColumnModal = () => {
        resetTaskForm();
        setCurrentColumn(null);
        setNewColumnName('');
        setIsColumnDialogOpen(true);
    };

    const openEditColumnModal = (col: Column) => {
        setCurrentColumn(col);
        setNewColumnName(col.name);
        setIsColumnDialogOpen(true);
    };

    const handleAddOrUpdateColumn = () => {
        if (!newColumnName.trim()) return;
        const body = { name: newColumnName, boardId, order: currentColumn ? currentColumn.order : columns.length };
        const call = currentColumn
            ? axiosInstance.put<Column>(`/columns/${currentColumn.id}`, { name: newColumnName })
            : axiosInstance.post<Column>(`/columns`, body);

        call
            .then(r => {
                setColumns(prev =>
                    currentColumn
                        ? prev.map(c => c.id === r.data.id ? r.data : c)
                        : [...prev, r.data]
                );
                notify(currentColumn ? 'Column updated' : 'Column added');
                setIsColumnDialogOpen(false);
                setNewColumnName('');
            })
            .catch(err => {
                console.error(err);
                notify(`Failed to ${currentColumn ? 'update' : 'add'} column`, 'error');
            });
    };

    const handleDeleteColumn = (colId: string) => {
        if (!window.confirm('Delete this column and its tasks?')) return;
        axiosInstance
            .delete(`/columns/${colId}`)
            .then(() => {
                setColumns(prev => prev.filter(c => c.id !== colId));
                setTasks(prev => prev.filter(t => t.columnId !== colId));
                notify('Column deleted');
            })
            .catch(err => {
                console.error(err);
                notify('Failed to delete column', 'error');
            });
    };

    // Column menu handlers
    const handleOpenColumnMenu = (event: React.MouseEvent<HTMLElement>, columnId: string) => {
        setAnchorEl(event.currentTarget);
        setSelectedColumnId(columnId);
    };

    const handleCloseColumnMenu = () => {
        setAnchorEl(null);
        setSelectedColumnId(null);
    };

    const handleEditColumnFromMenu = () => {
        if (!selectedColumnId) return;
        const column = columns.find(c => c.id === selectedColumnId);
        if (column) {
            openEditColumnModal(column);
        }
        handleCloseColumnMenu();
    };

    const handleDeleteColumnFromMenu = () => {
        if (!selectedColumnId) return;
        handleDeleteColumn(selectedColumnId);
        handleCloseColumnMenu();
    };

    const getDeadlineColor = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);

        // Calculate difference in days
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return '#ef4444'; // 🔴 Overdue (Red)
        if (diffDays <= 3) return '#f59e0b'; // 🟠 Close (Orange)
        return '#3b82f6'; // 🔵 Normal (Blue)
    };
    const isOverdue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        return due < today && today.toDateString() !== due.toDateString();
        // Not today itself, but really passed
    };
    const [showConfetti, setShowConfetti] = useState(false);

// Add this effect
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

// Add this to your task completion logic
    const handleTaskStatusChange = (status: Task['status']) => {
        if (status === 'DONE' && newTaskStatus !== 'DONE') {
            setShowConfetti(true);
        }
        setNewTaskStatus(status);
    };
    const TaskPreviewModal = ({ task, onClose }: { task: Task; onClose: () => void }) => {
        if (!task) return null;

        const getPriorityColor = (priority: string) => {
            if (priority === 'HIGH') return '#ef4444';    // Red
            if (priority === 'MEDIUM') return '#f59e0b';   // Orange
            return '#10b981';                              // Green
        };

        return (
            <StyledDialog open={!!task} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        background: '#818cf8',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1.25rem',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AssignmentIcon fontSize="medium" />
                        Description
                    </div>
                    <IconButton onClick={onClose} sx={{ color: '#818cf8' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 4 }}>
                    {task.description && (
                        <>
                            <div style={{ marginTop: '2rem' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {task.description}
                                </Typography>
                            </div>

                            <Divider sx={{ my: 3 }} />
                        </>
                    )}

                    {/* Task Details */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Status
                            </Typography>
                            <Typography fontWeight={500}>
                                {task.status === 'TODO' ? 'To Do' :
                                    task.status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Priority
                            </Typography>
                            <Chip
                                label={task.priority?.charAt(0) + task.priority?.slice(1).toLowerCase()}
                                size="small"
                                sx={{
                                    backgroundColor: getPriorityColor(task.priority || ''),
                                    color: 'white',
                                    fontWeight: 600,
                                }}
                            />
                        </Grid>

                        {task.deadline && (
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Due Date
                                </Typography>
                                <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <AccessTimeIcon fontSize="small" />

                                    {/* Deadline dynamic text */}
                                    {(() => {
                                        const today = new Date();
                                        const due = new Date(task.deadline!);

                                        const diffTime = due.getTime() - today.getTime();
                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                        if (diffDays === 0) return "Today";
                                        if (diffDays === 1) return "1 day left";
                                        if (diffDays > 1) return `${diffDays} days left`;
                                        if (diffDays === -1) return "Overdue by 1 day";
                                        return `Overdue by ${Math.abs(diffDays)} days`;
                                    })()}
                                </Typography>

                            </Grid>
                        )}
                    </Grid>

                    {/* Assignees */}
                    {task.assigneeIds && task.assigneeIds.length > 0 && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Assignees
                            </Typography>
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>

                            {task.assigneeIds.map(assigneeId => {
                                    const user = projectMembers.find(u => u.userId === assigneeId);
                                    if (!user) return null;

                                    return (
                                        <Tooltip key={assigneeId} title={user.username || user.email}>
                                            <Avatar
                                                src={user.avatarUrl ? `${import.meta.env.VITE_WS_URL}${user.avatarUrl}`: undefined}
                                                alt={user.username || user.email}
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    fontSize: '0.75rem',
                                                    marginLeft: '-8px',
                                                    border: '2px solid white',
                                                    backgroundColor: '#cbd5e1',
                                                    color: '#334155',
                                                }}
                                            >
                                                {!user.avatarUrl &&
                                                    (user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?')}
                                            </Avatar>


                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={() => {
                            onClose();
                            openEditTaskModal(task);
                        }}
                        startIcon={<EditIcon />}
                    >
                        Edit Task
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onClose}
                        sx={{
                            backgroundColor: '#3b82f6',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: '#2563eb' }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </StyledDialog>
        );
    };




    // ─── RENDER ───────────────────────────────────────────
    if (loading) {
        return (
            <PageWrapper>
                <Container>
                    <Skeleton variant="rectangular" width="100%" height={80} sx={{ mb: 2, borderRadius: '12px' }} />
                    <div style={{ display: 'flex', gap: '1.25rem', height: '70vh' }}>
                        {[1, 2, 3].map((col) => (
                            <ColumnSkeleton key={col} variant="rectangular" width={320}>
                                <div style={{ padding: '1rem' }}>
                                    {[1, 2, 3].map((task) => (
                                        <TaskSkeleton key={task} variant="rectangular" />
                                    ))}
                                </div>
                            </ColumnSkeleton>
                        ))}
                    </div>
                </Container>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <Container>
                    <ErrorState>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                        <MUIButton variant="contained" color="error" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                            Retry
                        </MUIButton>
                    </ErrorState>
                </Container>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Container>
                <BoardHeader>
                    <BackButton startIcon={<ArrowBackIcon />} onClick={() => navigate(`/projects/${projectId}`)}>
                        Back to Project
                    </BackButton>
                    <BoardTitle>
                        <BoardHeading>{boardName}</BoardHeading>
                    </BoardTitle>
                    <BoardActions>
                        <SearchBox>
                            <SearchIcon />
                            <SearchInput
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchBox>
                        <Tooltip title="Filter tasks">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </BoardActions>
                </BoardHeader>

                <BoardContent>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <ColumnsWrapper>
                            {columns.map(col => (
                                <Droppable key={col.id} droppableId={col.id} isDropDisabled={false}>
                                    {(provided, snapshot) => (
                                        <ColumnContainer ref={provided.innerRef} {...provided.droppableProps}>
                                            <ColumnHeader>
                                                <ColumnTitle>
                                                    <ColumnName>{col.name}</ColumnName>
                                                    <TaskCount>{tasksByColumn[col.id]?.length || 0}</TaskCount>
                                                </ColumnTitle>
                                                <ColumnActions>
                                                    <IconButton size="small" onClick={(e) => handleOpenColumnMenu(e, col.id)}>
                                                        <MoreVertIcon fontSize="small" />
                                                    </IconButton>
                                                </ColumnActions>
                                            </ColumnHeader>

                                            <TaskList isDraggingOver={snapshot.isDraggingOver}>
                                                {(tasksByColumn[col.id] || []).map((task, idx) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={idx}>
                                                        {(prov2, snap2) => (
                                                            <TaskCard
                                                                ref={prov2.innerRef}
                                                                {...prov2.draggableProps}
                                                                {...prov2.dragHandleProps}
                                                                isDragging={snap2.isDragging}
                                                                priority={task.priority}
                                                                onClick={(e) => {
                                                                    // ✅ Only open preview if click is not on an IconButton
                                                                    if ((e.target as HTMLElement).closest('button')) {
                                                                        return; // Clicked on edit/delete button, so ignore
                                                                    }
                                                                    setPreviewTask(task); // Otherwise open preview
                                                                }}
                                                            >
                                                                <TaskHeader>
                                                                    <TaskTitle>{task.title}</TaskTitle>
                                                                    <div>
                                                                        <>
                                                                            <IconButton size="small" onClick={() => openEditTaskModal(task)}>
                                                                                <EditIcon fontSize="small" />
                                                                            </IconButton>
                                                                            <IconButton size="small" onClick={() => handleDeleteTask(task.id)}>
                                                                                <DeleteIcon fontSize="small" />
                                                                            </IconButton>
                                                                        </>


                                                                    </div>
                                                                </TaskHeader>

                                                                {task.description && (
                                                                    <TaskDescription>
                                                                        {task.description.length > 100
                                                                            ? `${task.description.substring(0, 100)}...`
                                                                            : task.description}
                                                                    </TaskDescription>
                                                                )}

                                                                <TaskMeta>
                                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                        {task.priority && (
                                                                            <PriorityChip
                                                                                label={task.priority.toUpperCase()}
                                                                                size="small"
                                                                                priority={task.priority.toUpperCase()}
                                                                            />
                                                                        )}

                                                                        {task.deadline && (
                                                                            <TaskDueDate
                                                                                style={{
                                                                                    color: getDeadlineColor(task.deadline),
                                                                                    fontWeight: 500,
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    gap: '0.5rem',
                                                                                }}
                                                                            >
                                                                                <AccessTimeIcon fontSize="small" />
                                                                                {new Date(task.deadline).toLocaleDateString()}

                                                                                {isOverdue(task.deadline) && (
                                                                                    <span
                                                                                        style={{
                                                                                            backgroundColor: '#ef4444',
                                                                                            color: 'white',
                                                                                            padding: '2px 6px',
                                                                                            borderRadius: '12px',
                                                                                            fontSize: '0.7rem',
                                                                                            fontWeight: 'bold',
                                                                                        }}
                                                                                    >
                                                                                        Overdue
                                                                                      </span>
                                                                                )}
                                                                            </TaskDueDate>
                                                                        )}


                                                                        {/* 👥 Assigned Users */}
                                                                        {task.assigneeIds && task.assigneeIds.length > 0 && (
                                                                            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                                                                {task.assigneeIds.map((assigneeId, index) => {
                                                                                    const user = projectMembers.find(u => u.userId === assigneeId);
                                                                                    if (!user) return null;

                                                                                    return (
                                                                                        <Tooltip key={assigneeId} title={user.username || user.email}>
                                                                                            <Avatar
                                                                                                src={user.avatarUrl ? `${import.meta.env.VITE_API_URL}${user.avatarUrl}` : undefined}
                                                                                                alt={user.username || user.email}
                                                                                                sx={{
                                                                                                    width: 24,
                                                                                                    height: 24,
                                                                                                    fontSize: '0.75rem',
                                                                                                    marginLeft: '-8px',
                                                                                                    border: '2px solid white',             // adds nice separation between avatars
                                                                                                    backgroundColor: '#cbd5e1',             // light gray background if empty
                                                                                                    color: '#334155',                       // dark text color
                                                                                                }}
                                                                                            >
                                                                                                {user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
                                                                                            </Avatar>
                                                                                        </Tooltip>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}




                                                                    </div>
                                                                </TaskMeta>


                                                            </TaskCard>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}

                                                {tasksByColumn[col.id]?.length === 0 && (
                                                    <div style={{
                                                        padding: '1.5rem 1rem',
                                                        textAlign: 'center',
                                                        color: '#94a3b8',
                                                        fontSize: '0.875rem',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <EmptyState>
                                                            <AssignmentIcon />
                                                            <p>No tasks in this column</p>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                startIcon={<AddIcon />}
                                                                onClick={() => openAddTaskModal(col.id)}
                                                            >
                                                                Add First Task
                                                            </Button>
                                                        </EmptyState>
                                                    </div>
                                                )}
                                            </TaskList>

                                                <AddTaskBtn
                                                    startIcon={<AddIcon />}
                                                    fullWidth
                                                    onClick={() => openAddTaskModal(col.id)}
                                                >
                                                    Add Task
                                                </AddTaskBtn>

                                        </ColumnContainer>

                                    )}
                                </Droppable>
                            ))}

                            <div style={{ flex: '0 0 320px', display: 'flex', alignItems: 'stretch', height: '100%' }}>
                                {userRole === "ADMIN" && (
                                    <AddColumnBtn
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        fullWidth
                                        onClick={openAddColumnModal}
                                    >
                                        Add Column
                                    </AddColumnBtn>
                                )}

                            </div>
                        </ColumnsWrapper>
                    </DragDropContext>
                </BoardContent>

                {/* Task Dialog */}
                <StyledDialog open={isTaskDialogOpen} onClose={() => setIsTaskDialogOpen(false)} fullWidth maxWidth="sm">
                    <StyledDialogTitle>
                        {currentTask && currentTask.id ? 'Edit Task' : 'Add New Task'}
                    </StyledDialogTitle>
                    <DialogContent>
                        <TextField
                            label="Task Title"
                            fullWidth
                            margin="normal"
                            value={newTaskTitle}
                            onChange={e => setNewTaskTitle(e.target.value)}
                            placeholder="Enter task title"
                            variant="outlined"
                            InputProps={{
                                style: { borderRadius: '8px' }
                            }}
                        />

                        <TextField
                            label="Description"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                            value={newTaskDescription}
                            onChange={e => setNewTaskDescription(e.target.value)}
                            placeholder="Add more details to this task..."
                            variant="outlined"
                            InputProps={{
                                style: { borderRadius: '8px' }
                            }}
                        />

                        <Typography variant="subtitle2" color="#475569" sx={{ mt: 2, mb: 1 }}>
                            Priority
                        </Typography>

                        <PriorityButtons>
                            {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                                <PriorityButton
                                    key={p}
                                    $isActive={newTaskPriority === p}
                                    $priority={p}
                                    size="small"
                                    onClick={() => {
                                        setNewTaskPriority(p as Task['priority']);
                                        setTimeout(() => {
                                        }, 100); // Wait a little for React state update
                                    }}
                                >
                                    {p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()}
                                </PriorityButton>
                            ))}
                        </PriorityButtons>

                        <Typography variant="subtitle2" color="#475569" sx={{ mt: 2, mb: 1 }}>
                            Status
                        </Typography>

                        <TaskStatusButtons>
                            {['TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
                                <StatusButton
                                    key={s}
                                    $isActive={newTaskStatus === s}
                                    $status={s}
                                    size="small"
                                    onClick={() => setNewTaskStatus(s as Task['status'])}
                                >
                                    {s === 'TODO' ? 'To Do' : s === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                                </StatusButton>
                            ))}
                        </TaskStatusButtons>

                        <TextField
                            label="Due Date"
                            type="date"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={newTaskDueDate}
                            onChange={e => setNewTaskDueDate(e.target.value)}
                            variant="outlined"
                            inputProps={{
                                min: new Date().toISOString().split("T")[0], // ❗ Ограничение: только сегодня и позже
                            }}
                            InputProps={{
                                style: { borderRadius: '8px' }
                            }}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel id="assignee-select-label">Assignee(s)</InputLabel>
                            <Select
                                labelId="assignee-select-label"
                                id="assignee-select"
                                multiple  // <-- VERY IMPORTANT
                                value={selectedAssigneeIds}
                                onChange={(e) => {
                                    const { value } = e.target;
                                    setSelectedAssigneeIds(typeof value === 'string' ? value.split(',') : value);
                                }}
                                renderValue={(selected) =>
                                    (selected as string[])
                                        .map(id => projectMembers.find(u => u.userId === id)?.username || '')
                                        .join(', ')
                                }
                                sx={{ borderRadius: '8px' }}
                            >
                                {projectMembers.map((user) => (
                                    <MenuItem key={user.userId} value={user.userId}>
                                        {user.username || user.email}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>


                    </DialogContent>
                    <DialogActions sx={{ padding: '1rem' }}>
                        <MUIButton
                            onClick={() => setIsTaskDialogOpen(false)}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                color: '#64748b'
                            }}
                        >
                            Cancel
                        </MUIButton>
                        <MUIButton
                            variant="contained"
                            onClick={handleAddOrUpdateTask}
                            disabled={!newTaskTitle.trim()}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                backgroundColor: '#3b82f6',
                                '&:hover': {
                                    backgroundColor: '#2563eb'
                                }
                            }}
                        >
                            {currentTask && currentTask.id ? 'Update Task' : 'Add Task'}
                        </MUIButton>
                    </DialogActions>
                </StyledDialog>

                {/* Column Dialog */}
                <StyledDialog open={isColumnDialogOpen} onClose={() => setIsColumnDialogOpen(false)} fullWidth maxWidth="sm">
                    <StyledDialogTitle>
                        {currentColumn ? 'Edit Column' : 'Add New Column'}
                    </StyledDialogTitle>
                    <DialogContent>
                        <TextField
                            label="Column Name"
                            fullWidth
                            margin="normal"
                            value={newColumnName}
                            onChange={e => setNewColumnName(e.target.value)}
                            placeholder="Enter column name"
                            variant="outlined"
                            InputProps={{
                                style: { borderRadius: '8px' }
                            }}
                        />
                    </DialogContent>
                    <DialogActions sx={{ padding: '1rem' }}>
                        <MUIButton
                            onClick={() => setIsColumnDialogOpen(false)}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                color: '#64748b'
                            }}
                        >
                            Cancel
                        </MUIButton>
                        <MUIButton
                            variant="contained"
                            onClick={handleAddOrUpdateColumn}
                            disabled={!newColumnName.trim()}
                            sx={{
                                borderRadius: '8px',
                                textTransform: 'none',
                                backgroundColor: '#3b82f6',
                                '&:hover': {
                                    backgroundColor: '#2563eb'
                                }
                            }}
                        >
                            {currentColumn ? 'Update Column' : 'Add Column'}
                        </MUIButton>
                    </DialogActions>
                </StyledDialog>

                {/* Column Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseColumnMenu}
                    TransitionComponent={Fade}
                    PaperProps={{
                        style: {
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                    }}
                >
                    <MenuItem onClick={handleEditColumnFromMenu} sx={{ fontSize: '0.875rem' }}>
                        <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit Column
                    </MenuItem>
                    {userRole === "ADMIN" && (
                        <MenuItem onClick={handleDeleteColumnFromMenu} sx={{ fontSize: '0.875rem', color: '#ef4444' }}>
                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete Column
                        </MenuItem>
                    )}

                </Menu>

                <TaskPreviewModal
                    task={previewTask}
                    onClose={() => setPreviewTask(null)}
                />

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity={snackbar.severity}
                        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                        sx={{
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            width: '100%'
                        }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Container>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={500}
                    style={{ position: 'fixed' }}
                />
            )}
        </PageWrapper>
    );
};

export default BoardPage;
