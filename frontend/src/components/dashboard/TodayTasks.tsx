import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import {
    Box,
    Typography,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Button,
    Chip,
    Divider,
    Paper,
    useTheme,
    alpha,
    Tooltip
} from '@mui/material';
import {
    AccessTime as AccessTimeIcon,
    ArrowForward as ArrowForwardIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Schedule as ScheduleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    Flag as FlagIcon,
    PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Task {
    id: string;
    title: string;
    deadline: string;
    columnId: string;
    boardId: string;
    projectId: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority?: 'low' | 'medium' | 'high';
}

const TodayTasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchTodayTasks = async () => {
            try {
                const res = await axiosInstance.get('/tasks/today');
                setTasks(res.data);
            } catch (err) {
                console.error('Failed to fetch today tasks:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodayTasks();
    }, []);

    const handleGoToTask = (task: Task) => {
        navigate(`/projects/${task.projectId}/boards/${task.boardId}`);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'TODO':
                return <RadioButtonUncheckedIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />;
            case 'IN_PROGRESS':
                return <PlayArrowIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />;
            case 'DONE':
                return <CheckCircleOutlineIcon fontSize="small" sx={{ color: theme.palette.success.main }} />;
            default:
                return <RadioButtonUncheckedIcon fontSize="small" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'TODO': return theme.palette.grey[500];
            case 'IN_PROGRESS': return theme.palette.warning.main;
            case 'DONE': return theme.palette.success.main;
            default: return theme.palette.grey[500];
        }
    };

    const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.success.main;
            default: return theme.palette.grey[500];
        }
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit'
        };

        const timeStr = date.toLocaleTimeString('ru-RU', options);

        return `Сегодня, ${timeStr}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Box>
            {tasks.length === 0 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height={200}
                    sx={{
                        color: theme.palette.text.secondary,
                        backgroundColor: alpha(theme.palette.background.paper, 0.5),
                        borderRadius: 2,
                        p: 3
                    }}
                >
                    <ScheduleIcon sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
                    <Typography variant="body1">Нет задач на сегодня</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Отличный день, чтобы отдохнуть!
                    </Typography>
                </Box>
            ) : (
                <List disablePadding>
                    {tasks.map((task, index) => (
                        <React.Fragment key={task.id}>
                            <ListItem
                                disablePadding
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    borderRadius: 1,
                                    mb: index !== tasks.length - 1 ? 1 : 0,
                                    bgcolor: alpha(getStatusColor(task.status), 0.05),
                                    '&:hover': {
                                        bgcolor: alpha(getStatusColor(task.status), 0.1),
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                <Box sx={{ mr: 1 }}>
                                    {getStatusIcon(task.status)}
                                </Box>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" fontWeight={500}>
                                            {task.title}
                                        </Typography>
                                    }
                                    secondary={
                                        <Box display="flex" alignItems="center" mt={0.5}>
                                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                                            <Typography variant="caption">
                                                {formatDate(task.deadline)}
                                            </Typography>
                                        </Box>
                                    }
                                    sx={{ mr: 2 }}
                                />
                                <Box display="flex" alignItems="center">
                                    {task.priority && (
                                        <Tooltip title={`Приоритет: ${task.priority}`}>
                                            <Chip
                                                icon={<FlagIcon fontSize="small" />}
                                                label={task.priority === 'high' ? 'Высокий' : task.priority === 'medium' ? 'Средний' : 'Низкий'}
                                                size="small"
                                                sx={{
                                                    mr: 1,
                                                    backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                    color: getPriorityColor(task.priority),
                                                    border: `1px solid ${alpha(getPriorityColor(task.priority), 0.2)}`,
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Перейти к задаче">
                                        <Button
                                            size="small"
                                            onClick={() => handleGoToTask(task)}
                                            endIcon={<ArrowForwardIcon />}
                                            variant="outlined"
                                            sx={{
                                                minWidth: 'auto',
                                                borderRadius: 1.5,
                                                borderColor: alpha(theme.palette.primary.main, 0.3)
                                            }}
                                        >
                                            Перейти
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default TodayTasks;