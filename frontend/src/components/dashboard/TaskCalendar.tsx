import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import axiosInstance from '../../api/axiosInstance';
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Chip,
    Divider,
    Button,
    useTheme,
    alpha,
    Paper,
    Badge,
    Tooltip
} from '@mui/material';
import {
    Close as CloseIcon,
    Event as EventIcon,
    AccessTime as AccessTimeIcon,
    ArrowForward as ArrowForwardIcon,
    AssignmentLate as AssignmentLateIcon
} from '@mui/icons-material';
import { format, isSameDay, isAfter, isPast, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';


type Task = {
    id: string;
    title: string;
    deadline: string;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    projectId?: string;
    boardId?: string;
    priority?: 'low' | 'medium' | 'high';
};

const TaskCalendar = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/tasks/filter')
            .then((res) => setTasks(res.data.content))
            .catch((err) => console.error("Ошибка загрузки задач:", err));
    }, []);

    const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.success.main;
            default: return theme.palette.grey[500];
        }
    };

    const handleGoToTask = (task: Task) => {
        if (task.projectId && task.boardId) {
            navigate(`/projects/${task.projectId}/boards/${task.boardId}`);
            setOpen(false);
        }
    };

    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view !== 'month') return null;

        const tasksOnDate = tasks.filter(task =>
            task.deadline && isSameDay(new Date(task.deadline), date)
        );

        if (tasksOnDate.length === 0) return null;

        const hasOverdueTasks = tasksOnDate.some(task =>
            task.status !== 'DONE' && isPast(new Date(task.deadline)) && !isToday(new Date(task.deadline))
        );

        const priorityTasks = tasksOnDate.filter(task => task.priority === 'high');

        return (
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '2px'
                }}
            >
                {hasOverdueTasks && (
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.error.main
                        }}
                    />
                )}
                {priorityTasks.length > 0 && (
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.warning.main
                        }}
                    />
                )}
                {tasksOnDate.length > 0 && !(hasOverdueTasks || priorityTasks.length > 0) && (
                    <Box
                        sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: theme.palette.primary.main
                        }}
                    />
                )}
            </Box>
        );
    };

    const formatTaskDate = (dateString: string): string => {
        const taskDate = new Date(dateString);

        return format(taskDate, 'dd MMM, HH:mm', { locale: ru });
    };

    const isTaskOverdue = (task: Task): boolean => {
        return task.status !== 'DONE' && isPast(new Date(task.deadline)) && !isToday(new Date(task.deadline));
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setOpen(true);
    };

    const tasksForDate = selectedDate
        ? tasks.filter(task => task.deadline && isSameDay(new Date(task.deadline), selectedDate))
        : [];

    return (
        <Box>
            <Box
                className="custom-calendar-container"
                sx={{
                    '& .react-calendar': {
                        width: '100%',
                        border: 'none',
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        fontFamily: theme.typography.fontFamily,
                        padding: '16px',
                        backgroundColor: theme.palette.background.paper
                    },
                    '& .react-calendar__tile': {
                        position: 'relative',
                        aspectRatio: '1 / 1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '8px',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        color: theme.palette.text.primary,
                    },
                    '& .react-calendar__tile--now': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 'bold'
                    },
                    '& .react-calendar__tile--active': {
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText
                    },
                    '& .react-calendar__navigation': {
                        marginBottom: '16px'
                    },
                    '& .react-calendar__navigation button': {
                        minWidth: '44px',
                        backgroundColor: 'transparent',
                        border: 0,
                        borderRadius: theme.shape.borderRadius
                    },
                    '& .react-calendar__navigation button:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    },
                    '& .react-calendar__month-view__weekdays': {
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        color: theme.palette.text.secondary
                    },
                    '& .react-calendar__tile:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    }
                }}
            >
                <Calendar
                    onClickDay={handleDateClick}
                    tileContent={tileContent}
                    locale="ru-RU"
                    prevLabel={<span>‹</span>}
                    nextLabel={<span>›</span>}
                    prev2Label={<span>«</span>}
                    next2Label={<span>»</span>}
                />
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    py: 2
                }}>
                    <Box display="flex" alignItems="center">
                        <EventIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">
                            {selectedDate && format(selectedDate, 'd MMMM yyyy', { locale: ru })}
                        </Typography>
                    </Box>
                    <IconButton onClick={() => setOpen(false)} sx={{ color: 'inherit' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    {tasksForDate.length > 0 ? (
                        <List disablePadding>
                            {tasksForDate.map((task, index) => (
                                <React.Fragment key={task.id}>
                                    <ListItem
                                        sx={{
                                            px: 3,
                                            py: 2,
                                            backgroundColor: isTaskOverdue(task)
                                                ? alpha(theme.palette.error.main, 0.05)
                                                : 'inherit'
                                        }}
                                    >
                                        <Box display="flex" alignItems="flex-start" width="100%">
                                            <Box flex={1}>
                                                <Box display="flex" alignItems="center">
                                                    {isTaskOverdue(task) && (
                                                        <AssignmentLateIcon color="error" sx={{ mr: 1, fontSize: 20 }} />
                                                    )}
                                                    <Typography variant="body1" fontWeight={500}>
                                                        {task.title}
                                                    </Typography>
                                                    {task.priority && (
                                                        <Chip
                                                            size="small"
                                                            label={task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                                                            sx={{
                                                                ml: 1,
                                                                height: 20,
                                                                backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                                color: getPriorityColor(task.priority),
                                                                border: `1px solid ${alpha(getPriorityColor(task.priority), 0.2)}`,
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                                <Box display="flex" alignItems="center" mt={0.5}>
                                                    <AccessTimeIcon
                                                        fontSize="small"
                                                        sx={{
                                                            mr: 0.5,
                                                            fontSize: 14,
                                                            color: isTaskOverdue(task) ? theme.palette.error.main : theme.palette.text.secondary
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="caption"
                                                        color={isTaskOverdue(task) ? "error" : "text.secondary"}
                                                    >
                                                        {formatTaskDate(task.deadline)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            {task.projectId && task.boardId && (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => handleGoToTask(task)}
                                                    endIcon={<ArrowForwardIcon />}
                                                    sx={{
                                                        minWidth: 'auto',
                                                        ml: 2,
                                                        borderRadius: 1.5,
                                                        borderColor: alpha(theme.palette.primary.main, 0.3)
                                                    }}
                                                >
                                                    Перейти
                                                </Button>
                                            )}
                                        </Box>
                                    </ListItem>
                                    {index < tasksForDate.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Box
                            sx={{
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                color: theme.palette.text.secondary
                            }}
                        >
                            <EventIcon sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
                            <Typography variant="body1">Нет задач на этот день</Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TaskCalendar;