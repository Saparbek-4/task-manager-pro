import React, { useEffect, useState, useCallback } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    CircularProgress,
    Box,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider,
    useTheme,
    alpha,
    Avatar,
    Skeleton,
    Tooltip
} from "@mui/material";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import { fetchTaskSummary } from "../../services/taskService";
import {
    AccessTime as AccessTimeIcon,
    AssignmentLate as AssignmentLateIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    Schedule as ScheduleIcon,
    Flag as FlagIcon
} from "@mui/icons-material";

interface Task {
    id: string;
    title: string;
    deadline: string;
    priority?: 'low' | 'medium' | 'high';
    assignee?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

interface TaskSummaryData {
    todo: number;
    inProgress: number;
    done: number;
    overdue: Task[];
    nearest: Task[];
}

interface StatusData {
    name: string;
    value: number;
    color: string;
    icon: React.ReactNode;
}

const TaskSummary: React.FC = () => {
    const theme = useTheme();
    const [summary, setSummary] = useState<TaskSummaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
    ];

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchTaskSummary();
            setSummary(data);
            setError(null);
        } catch (err) {
            setError("Failed to load data. Please try again later.");
            console.error("Error fetching task summary:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const getPriorityColor = useCallback((priority?: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.success.main;
            default: return theme.palette.grey[500];
        }
    }, [theme]);

    const formatDate = useCallback((dateString: string): string => {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

        return date.toLocaleDateString("en-US", {
            day: 'numeric',
            month: 'short'
        });
    }, []);

    const statusData: StatusData[] = [
        {
            name: "To Do",
            value: summary?.todo || 0,
            color: COLORS[0],
            icon: <ScheduleIcon fontSize="small" />
        },
        {
            name: "In Progress",
            value: summary?.inProgress || 0,
            color: COLORS[1],
            icon: <AccessTimeIcon fontSize="small" />
        },
        {
            name: "Done",
            value: summary?.done || 0,
            color: COLORS[2],
            icon: <CheckCircleOutlineIcon fontSize="small" />
        },
    ];

    const totalTasks = statusData.reduce((sum, item) => sum + item.value, 0);

    const renderCustomizedLegend = useCallback(({ payload }: { payload: any[] }) => (
        <Box display="flex" flexDirection="column" sx={{ mt: 2 }}>
            {payload.map((entry, index) => (
                <Box key={`legend-${index}`} display="flex" alignItems="center" mb={1}>
                    <Box
                        component="span"
                        sx={{
                            width: 12,
                            height: 12,
                            backgroundColor: entry.color,
                            borderRadius: '50%',
                            mr: 1
                        }}
                    />
                    <Box display="flex" alignItems="center">
                        <Box component="span" sx={{ mr: 0.5 }}>
                            {statusData[index].icon}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            {entry.value}: {entry.name}
                        </Typography>
                    </Box>
                </Box>
            ))}
        </Box>
    ), [statusData]);

    if (loading) {
        return (
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Task Status</Typography>
                            <Box display="flex" justifyContent="center" alignItems="center" height={250}>
                                <Skeleton variant="circular" width={160} height={160} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Overdue Tasks</Typography>
                            <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" height={20} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" height={20} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

    if (error) {
        return (
            <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), p: 2 }}>
                <Typography color="error">{error}</Typography>
            </Card>
        );
    }

    if (!summary) return null;

    return (
        <Grid container spacing={2}>
            {/* Status Chart */}
            <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <CheckCircleOutlineIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="h6">Task Status</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ position: 'relative' }}>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        dataKey="value"
                                        paddingAngle={2}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                stroke={theme.palette.background.paper}
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        formatter={(value: number, name: string) => [
                                            `${value} (${Math.round((value / totalTasks) * 100)}%)`,
                                            name
                                        ]}
                                    />
                                    <Legend content={renderCustomizedLegend} />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h4" color="primary" fontWeight="bold">
                                    {totalTasks}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Total Tasks
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Overdue Tasks */}
            <Grid item xs={12} md={6}>
                <Card elevation={1} sx={{ height: '100%', bgcolor: summary.overdue.length > 0 ? alpha(theme.palette.error.light, 0.05) : 'inherit' }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <AssignmentLateIcon color="error" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Overdue Tasks
                                {summary.overdue.length > 0 && (
                                    <Chip
                                        label={summary.overdue.length}
                                        size="small"
                                        color="error"
                                        sx={{ ml: 1, height: 20 }}
                                    />
                                )}
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {summary.overdue.length > 0 ? (
                            <List dense disablePadding>
                                {summary.overdue.map((task) => (
                                    <ListItem
                                        key={task.id}
                                        disablePadding
                                        sx={{
                                            mb: 1,
                                            p: 1,
                                            borderRadius: 1,
                                            bgcolor: alpha(theme.palette.error.main, 0.08),
                                            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.12) }
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                                    <Typography variant="body2">{task.title}</Typography>
                                                    {task.priority && (
                                                        <Tooltip title={`Priority: ${task.priority}`}>
                                                            <Chip
                                                                icon={<FlagIcon fontSize="small" />}
                                                                label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                                    color: getPriorityColor(task.priority),
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Box display="flex" alignItems="center" mt={0.5}>
                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: theme.palette.error.main }} />
                                                    <Typography variant="caption" color="error">
                                                        Overdue: {formatDate(task.deadline)}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box py={3} textAlign="center" color="text.secondary">
                                <Typography variant="body2">No overdue tasks 👍</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>

            {/* Upcoming Deadlines */}
            <Grid item xs={12}>
                <Card elevation={1}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={1}>
                            <ScheduleIcon color="warning" sx={{ mr: 1 }} />
                            <Typography variant="h6">
                                Upcoming Deadlines
                                {summary.nearest.length > 0 && (
                                    <Chip
                                        label={summary.nearest.length}
                                        size="small"
                                        color="primary"
                                        sx={{ ml: 1, height: 20 }}
                                    />
                                )}
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />

                        {summary.nearest.length > 0 ? (
                            <Grid container spacing={2}>
                                {summary.nearest.map((task) => (
                                    <Grid item xs={12} md={6} key={task.id}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 1,
                                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                                            }}
                                        >
                                            <Box display="flex" alignItems="flex-start" flex={1}>
                                                {task.assignee && (
                                                    <Tooltip title={task.assignee.name}>
                                                        <Avatar
                                                            src={task.assignee.avatar}
                                                            alt={task.assignee.name}
                                                            sx={{ width: 32, height: 32, mr: 1.5 }}
                                                        >
                                                            {task.assignee.name.charAt(0)}
                                                        </Avatar>
                                                    </Tooltip>
                                                )}
                                                <Box>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        {task.title}
                                                    </Typography>
                                                    <Box display="flex" alignItems="center" mt={0.5}>
                                                        <AccessTimeIcon fontSize="small" color="warning" sx={{ mr: 0.5 }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            {formatDate(task.deadline)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Box>

                                            {task.priority && (
                                                <Tooltip title={`Priority: ${task.priority}`}>
                                                    <Chip
                                                        icon={<FlagIcon fontSize="small" />}
                                                        label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                            color: getPriorityColor(task.priority),
                                                        }}
                                                    />
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Box py={3} textAlign="center" color="text.secondary">
                                <Typography variant="body2">No upcoming deadlines</Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default React.memo(TaskSummary);