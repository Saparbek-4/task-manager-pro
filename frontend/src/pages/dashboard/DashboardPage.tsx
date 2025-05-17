import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    Divider,
    Chip,
    useTheme,
    useMediaQuery,
    CardHeader,
    Tabs,
    Tab,
    alpha,
    CircularProgress,
    Skeleton,
    IconButton,
    Button,
    LinearProgress,
    Avatar
} from "@mui/material";
import { PageWrapper } from "../Board/Board.styles";
import Header from "../../components/Header";
import axiosInstance from "../../api/axiosInstance";
import { fetchTaskSummary } from "../../services/taskService";
import { fetchWeeklyStats } from "../../services/taskService";
import {
    AccessTime as AccessTimeIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    PlayArrow as PlayArrowIcon,
    MoreVert as MoreVertIcon,
    Add as AddIcon,
    TrendingUp as TrendingUpIcon,
    CalendarToday as CalendarTodayIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Tooltip, LineChart, Line, Area, AreaChart } from "recharts";

// Helper functions
const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Доброе утро";
    if (hour < 18) return "Добрый день";
    return "Добрый вечер";
};

const DashboardPage = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [todayTasks, setTodayTasks] = useState([]);

    const [userId, setUserId] = useState<string>("");
    const [summary, setSummary] = useState(null);
    const [currentTab, setCurrentTab] = useState(0);
    const [graphView, setGraphView] = useState('pie');
    const [weeklyProgressData, setWeeklyProgressData] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const loadUserAndStats = async () => {
            try {
                // 🔹 Получаем пользователя
                const userRes = await axiosInstance.get("/user/me");
                const id = userRes.data.id;
                setUserId(id);
                setUserName(userRes.data.name);

                // 🔹 Получаем сегодняшние задачи
                const res = await axiosInstance.get('/tasks/today');
                setTodayTasks(res.data);

                // 🔹 Получаем сводку только для текущего пользователя
                const summaryData = await fetchTaskSummary(id);
                setSummary(summaryData);

                // 🔹 Получаем еженедельную статистику
                const weeklyStats = await fetchWeeklyStats(id);
                setWeeklyProgressData(weeklyStats);

            } catch (err) {
                console.error("Ошибка при загрузке данных:", err);
                // Мок-данные на случай ошибки
                setTodayTasks([
                    { id: 1, title: "Доработать дизайн дашборда", status: "IN_PROGRESS", priority: "HIGH", deadline: new Date().toISOString(), assignee: "Alex K." },
                    { id: 2, title: "Провести встречу с командой", status: "TODO", priority: "MEDIUM", deadline: new Date().toISOString(), assignee: "Maria S." },
                    { id: 3, title: "Отправить отчет клиенту", status: "DONE", priority: "HIGH", deadline: new Date().toISOString(), assignee: "Ivan P." },
                    { id: 4, title: "Обновить документацию", status: "TODO", priority: "LOW", deadline: new Date().toISOString(), assignee: "Saparbek" }
                ]);
                setSummary({
                    total: 25,
                    done: 8,
                    inProgress: 5,
                    todo: 12
                });
            } finally {
                setLoading(false);
            }
        };

        loadUserAndStats();
    }, []);

    useEffect(() => {
        const loadUserTasks = async () => {
            try {
                const res = await axiosInstance.get('/tasks/my');
                setAllTasks(res.data);
            } catch (err) {
                console.error("Ошибка при загрузке задач пользователя:", err);
            }
        };

        if (userId) {
            loadUserTasks();
        }
    }, [userId]);

    // Demo data
    const completionPercentage = summary ? Math.round((summary.done / summary.total) * 100) : 0;

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return theme.palette.error.main;
            case 'medium': return theme.palette.warning.main;
            case 'low': return theme.palette.success.main;
            default: return theme.palette.grey[500];
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority.toUpperCase()) {
            case 'HIGH': return "Высокий";
            case 'MEDIUM': return "Средний";
            case 'LOW': return "Низкий";
            default: return "Не указан";
        }
    };

    useEffect(() => {
        const load = async () => {
            try {
                const userRes = await axiosInstance.get("/user/me"); // ✅ Тот же, как и в ProfilePage
                const res = await axiosInstance.get('/tasks/today');
                const summaryData = await fetchTaskSummary();

                setUserName(userRes.data.name);
                setTodayTasks(res.data);
                setSummary(summaryData);
            } catch (err) {
                console.error(err);
                // Use mock data if API fails
                setTodayTasks([
                    { id: 1, title: "Доработать дизайн дашборда", status: "IN_PROGRESS", priority: "HIGH", deadline: new Date().toISOString(), assignee: "Alex K." },
                    { id: 2, title: "Провести встречу с командой", status: "TODO", priority: "MEDIUM", deadline: new Date().toISOString(), assignee: "Maria S." },
                    { id: 3, title: "Отправить отчет клиенту", status: "DONE", priority: "HIGH", deadline: new Date().toISOString(), assignee: "Ivan P." },
                    { id: 4, title: "Обновить документацию", status: "TODO", priority: "LOW", deadline: new Date().toISOString(), assignee: "Saparbek" }
                ]);
                setSummary({
                    total: 25,
                    done: 8,
                    inProgress: 5,
                    todo: 12
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const statusData = summary ? [
        { name: "Выполнено", value: summary.done, color: "#4caf50" },
        { name: "В процессе", value: summary.inProgress, color: "#ff9800" },
        { name: "К выполнению", value: summary.todo, color: "#2196f3" },
    ] : [];


    const PRIORITIES = ['HIGH', 'MEDIUM', 'LOW'];

    const priorityData = allTasks.length > 0
        ? PRIORITIES.map(priority => {
            const count = allTasks.filter(task => task.priority === priority).length;
            return {
                name: getPriorityLabel(priority.toLowerCase()),
                value: count,
                color: getPriorityColor(priority.toLowerCase())
            };
        })
        : [];



    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const statusIcons = {
        TODO: <RadioButtonUncheckedIcon fontSize="small" sx={{ color: theme.palette.info.main }} />,
        IN_PROGRESS: <PlayArrowIcon fontSize="small" sx={{ color: theme.palette.warning.main }} />,
        DONE: <CheckCircleOutlineIcon fontSize="small" sx={{ color: theme.palette.success.main }} />,
    };

    const formatTodayTime = (dateStr) => {
        const d = new Date(dateStr);
        return `Сегодня, ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    };

    // Enhanced Task Statistics Card
    const TaskStatisticsCard = () => (
        <Card elevation={0} sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)'
            }
        }}>
            <CardHeader
                title="Статистика задач"
                titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                action={
                    <Box display="flex" alignItems="center">
                        <Button
                            size="small"
                            variant={graphView === 'pie' ? "contained" : "outlined"}
                            onClick={() => setGraphView('pie')}
                            sx={{ minWidth: 'auto', p: '4px 8px', mr: 1 }}
                        >
                            Круговой
                        </Button>
                        <Button
                            size="small"
                            variant={graphView === 'bar' ? "contained" : "outlined"}
                            onClick={() => setGraphView('bar')}
                            sx={{ minWidth: 'auto', p: '4px 8px' }}
                        >
                            Столбцы
                        </Button>

                    </Box>
                }
                sx={{ pb: 0 }}
            />
            <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                    px: 2,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                        minHeight: 48
                    }
                }}
            >
                <Tab label="По статусу" />
                <Tab label="По приоритету" />
                <Tab label="Еженедельно" />
            </Tabs>

            <Box height={250} sx={{ px: 2, pt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {currentTab === 0 ? (
                        graphView === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value, entry) => {
                                        const item = statusData.find(d => d.name === value);
                                        return <span style={{ color: theme.palette.text.primary }}>{value} ({item.value})</span>;
                                    }}
                                />
                                <RechartsTooltip
                                    formatter={(value, name) => [`${value} задач`, name]}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: theme.shadows[3],
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                />
                            </PieChart>
                        ) : (
                            <BarChart
                                data={statusData}
                                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: theme.palette.divider }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: theme.palette.divider }}
                                />
                                <RechartsTooltip
                                    formatter={(value) => [`${value} задач`]}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: theme.shadows[3],
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                />
                                <Bar dataKey="value" name="Задачи" radius={[4, 4, 0, 0]}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )
                    ) : currentTab === 1 ? (
                        graphView === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={priorityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value, entry) => {
                                        const item = priorityData.find(d => d.name === value);
                                        return <span style={{ color: theme.palette.text.primary }}>{value} ({item.value})</span>;
                                    }}
                                />
                                <RechartsTooltip
                                    formatter={(value, name) => [`${value} задач`, name]}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: theme.shadows[3],
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                />
                            </PieChart>
                        ) : (
                            <BarChart
                                data={priorityData}
                                margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: theme.palette.divider }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    axisLine={{ stroke: theme.palette.divider }}
                                />
                                <RechartsTooltip
                                    formatter={(value) => [`${value} задач`]}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: theme.shadows[3],
                                        backgroundColor: theme.palette.background.paper
                                    }}
                                />
                                <Bar dataKey="value" name="Задачи" radius={[4, 4, 0, 0]}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )
                    ) : (
                        <AreaChart
                            data={weeklyProgressData}
                            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: theme.palette.divider }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                axisLine={{ stroke: theme.palette.divider }}
                            />
                            <Tooltip
                                formatter={(value, name) => [
                                    `${value} задач`,
                                    name === "completed" ? "Выполнено" : "В ожидании"
                                ]}
                                contentStyle={{
                                    borderRadius: 8,
                                    border: 'none',
                                    boxShadow: theme.shadows[3],
                                    backgroundColor: theme.palette.background.paper
                                }}
                            />
                            <Legend
                                formatter={(value) => {
                                    return value === "completed" ? "Выполнено" : "В ожидании";
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="completed"
                                stackId="1"
                                stroke={theme.palette.success.main}
                                fill={alpha(theme.palette.success.main, 0.6)}
                            />
                            <Area
                                type="monotone"
                                dataKey="pending"
                                stackId="1"
                                stroke={theme.palette.warning.main}
                                fill={alpha(theme.palette.warning.main, 0.6)}
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </Box>

            <Box sx={{ p: 2, pt: 0 }}>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={500}>
                        Общий прогресс выполнения
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {summary?.done || 0} из {summary?.total || 0} задач
                    </Typography>
                </Box>
                <Box mt={1}>
                    <LinearProgress
                        variant="determinate"
                        value={completionPercentage}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(theme.palette.success.main, 0.15),
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: theme.palette.success.main
                            }
                        }}
                    />
                </Box>
                <Box display="flex" justifyContent="space-between" mt={2}>
                    <Box display="flex" alignItems="center">
                        <Box width={12} height={12} bgcolor={theme.palette.success.main} borderRadius="50%" mr={1} />
                        <Typography variant="caption" fontWeight={500}>Выполнено: {summary?.done || 0}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box width={12} height={12} bgcolor={theme.palette.warning.main} borderRadius="50%" mr={1} />
                        <Typography variant="caption" fontWeight={500}>В процессе: {summary?.inProgress || 0}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box width={12} height={12} bgcolor={theme.palette.info.main} borderRadius="50%" mr={1} />
                        <Typography variant="caption" fontWeight={500}>К выполнению: {summary?.todo || 0}</Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );

    // Enhanced Today's Tasks Card
    const TodayTasksCard = () => (
        <Card elevation={0} sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            border: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.background.paper,
            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
            '&:hover': {
                boxShadow: theme.shadows[4],
                transform: 'translateY(-2px)'
            }
        }}>
            <CardHeader
                title={
                    <Box display="flex" alignItems="center">
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" fontWeight={600}>Сегодняшние задачи</Typography>
                    </Box>
                }
                subheader={
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
                        <Typography variant="body2" color="text.secondary">
                            {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </Typography>

                    </Box>
                }
            />
            <Divider />
            <CardContent sx={{ p: 0, flexGrow: 1, overflow: 'auto' }}>
                {loading ? (
                    <Box p={2}>
                        {[0, 1, 2].map((item) => (
                            <Box key={item} sx={{ mb: 2 }}>
                                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                            </Box>
                        ))}
                    </Box>
                ) : todayTasks.length === 0 ? (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">Нет задач на сегодня</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {todayTasks.map((task, index) => (
                            <React.Fragment key={task.id}>
                                <ListItem
                                    sx={{
                                        px: 2,
                                        py: 1.5,
                                        transition: 'background-color 0.2s',
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover
                                        }
                                    }}
                                >
                                    <Box display="flex" alignItems="flex-start" width="100%">
                                        <Box mr={1.5} mt={0.5}>{statusIcons[task.status]}</Box>
                                        <Box flexGrow={1}>
                                            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                                <Typography variant="body1" fontWeight={500} sx={{ mb: 0.5 }}>{task.title}</Typography>
                                                <Chip
                                                    label={getPriorityLabel(task.priority)}
                                                    size="small"
                                                    sx={{
                                                        color: getPriorityColor(task.priority),
                                                        backgroundColor: alpha(getPriorityColor(task.priority), 0.1),
                                                        fontWeight: 500,
                                                        fontSize: '0.75rem'
                                                    }}
                                                />
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                                    {formatTodayTime(task.deadline)}
                                                </Typography>
                                                {task.assignee && (
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                width: 20,
                                                                height: 20,
                                                                fontSize: '0.75rem',
                                                                backgroundColor: getAvatarColor(task.assignee),
                                                                mr: 0.5
                                                            }}
                                                        >
                                                            {task.assignee.charAt(0)}
                                                        </Avatar>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {task.assignee}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </ListItem>
                                {index < todayTasks.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </CardContent>
            <Divider />
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                    {todayTasks.length} задач на сегодня
                </Typography>
                <Button
                    size="small"
                    variant="text"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                >
                    Смотреть все
                </Button>
            </Box>
        </Card>
    );

    // Helper function to generate consistent avatar colors
    function getAvatarColor(name) {
        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.error.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.palette.success.main,
        ];

        // Simple hash function
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        return colors[Math.abs(hash) % colors.length];
    }

    return (
        <PageWrapper>
            <Header />
            <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
                {/* Welcome card with gradient background */}
                <Card
                    elevation={0}
                    sx={{
                        mb: 3,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                        color: '#fff',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                        }
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-10%',
                            width: '35%',
                            height: '200%',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${alpha('#fff', 0.15)} 0%, ${alpha('#fff', 0)} 70%)`,
                            transform: 'rotate(-20deg)'
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '-30%',
                            left: '10%',
                            width: '40%',
                            height: '200%',
                            borderRadius: '50%',
                            background: `radial-gradient(circle, ${alpha('#fff', 0.08)} 0%, ${alpha('#fff', 0)} 70%)`,
                            transform: 'rotate(25deg)'
                        }}
                    />

                    <Box p={3} position="relative">
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    {loading ? "Загрузка..." : `${getTimeBasedGreeting()}, ${userName}!`}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                                    Вот ваша сводка задач на сегодня. Удачного дня!
                                </Typography>
                                <Box display="flex" flexWrap="wrap" gap={1}>
                                    <Chip
                                        icon={<CheckCircleOutlineIcon sx={{ color: '#fff !important', fontSize: '1rem' }} />}
                                        label={`Выполнено: ${summary?.done || 0}`}
                                        sx={{
                                            bgcolor: alpha('#ffffff', 0.2),
                                            color: '#fff',
                                            fontWeight: 500,
                                            '& .MuiChip-icon': {
                                                color: '#fff',
                                                ml: '4px'
                                            }
                                        }}
                                    />
                                    <Chip
                                        icon={<PlayArrowIcon sx={{ color: '#fff !important', fontSize: '1rem' }} />}
                                        label={`В процессе: ${summary?.inProgress || 0}`}
                                        sx={{
                                            bgcolor: alpha('#ffffff', 0.2),
                                            color: '#fff',
                                            fontWeight: 500,
                                            '& .MuiChip-icon': {
                                                color: '#fff',
                                                ml: '4px'
                                            }
                                        }}
                                    />
                                    <Chip
                                        icon={<RadioButtonUncheckedIcon sx={{ color: '#fff !important', fontSize: '1rem' }} />}
                                        label={`К выполнению: ${summary?.todo || 0}`}
                                        sx={{
                                            bgcolor: alpha('#ffffff', 0.2),
                                            color: '#fff',
                                            fontWeight: 500,
                                            '& .MuiChip-icon': {
                                                color: '#fff',
                                                ml: '4px'
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={4} sx={{ display: { xs: 'none', sm: 'block' } }}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 140,
                                            height: 140,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <CircularProgress
                                            variant="determinate"
                                            value={100}
                                            size={140}
                                            thickness={2}
                                            sx={{
                                                color: alpha('#ffffff', 0.2),
                                                position: 'absolute',
                                            }}
                                        />
                                        <CircularProgress
                                            variant="determinate"
                                            value={completionPercentage}
                                            size={140}
                                            thickness={2}
                                            sx={{
                                                color: '#ffffff',
                                                position: 'absolute',
                                                '& .MuiCircularProgress-circle': {
                                                    strokeLinecap: 'round',
                                                }
                                            }}
                                        />
                                        <Box
                                            position="absolute"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            flexDirection="column"
                                        >
                                            <Typography variant="h3" component="div" color="#fff" fontWeight={700}>
                                                {completionPercentage ? `${completionPercentage}%` : '0%'}
                                            </Typography>
                                            <Typography variant="caption" component="div" color="#fff" sx={{ opacity: 0.8 }}>
                                                Общий прогресс
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>

                <Grid container spacing={3} alignItems="stretch">
                    {/* Task Statistics */}
                    <Grid item xs={12} md={6}>
                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                        ) : (
                            <TaskStatisticsCard />
                        )}
                    </Grid>

                    {/* Today's Tasks */}
                    <Grid item xs={12} md={6}>
                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                        ) : (
                            <TodayTasksCard />
                        )}
                    </Grid>

                    {/* Task Progression */}
                    <Grid item xs={12}>
                        <Card elevation={0} sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                            backgroundColor: theme.palette.background.paper,
                            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                            '&:hover': {
                                boxShadow: theme.shadows[4],
                                transform: 'translateY(-2px)'
                            }
                        }}>
                            <CardHeader
                                title={
                                    <Box display="flex" alignItems="center">
                                        <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                                        <Typography variant="h6" fontWeight={600}>Динамика выполнения задач</Typography>
                                    </Box>
                                }
                            />
                            <Divider />
                            <CardContent>
                                <Box height={300}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart
                                            data={weeklyProgressData}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                                            <XAxis
                                                dataKey="day"
                                                axisLine={{ stroke: theme.palette.divider }}
                                                tick={{ fill: theme.palette.text.secondary }}
                                            />
                                            <YAxis
                                                axisLine={{ stroke: theme.palette.divider }}
                                                tick={{ fill: theme.palette.text.secondary }}
                                            />
                                            <Tooltip
                                                formatter={(value, name) => [
                                                    `${value} задач`,
                                                    name === "completed" ? "Выполнено" : "В ожидании"
                                                ]}
                                                contentStyle={{
                                                    borderRadius: 8,
                                                    border: 'none',
                                                    boxShadow: theme.shadows[3],
                                                    backgroundColor: theme.palette.background.paper
                                                }}
                                            />
                                            <Legend
                                                formatter={(value) => {
                                                    return value === "completed" ? "Выполнено" : "В ожидании";
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="completed"
                                                stroke={theme.palette.success.main}
                                                strokeWidth={2}
                                                dot={{ stroke: theme.palette.success.main, fill: theme.palette.success.main, r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="pending"
                                                stroke={theme.palette.warning.main}
                                                strokeWidth={2}
                                                dot={{ stroke: theme.palette.warning.main, fill: theme.palette.warning.main, r: 4 }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                            </CardContent>
                            <Divider />
                            <Box p={2} display="flex" justifyContent="space-between">
                                <Box display="flex" alignItems="center">
                                    <Box width={12} height={12} bgcolor={theme.palette.success.main} borderRadius="50%" mr={1} />
                                    <Typography variant="body2">Всего выполнено за неделю: {
                                        weeklyProgressData.reduce((sum, item) => sum + item.completed, 0)
                                    } задач</Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Box width={12} height={12} bgcolor={theme.palette.warning.main} borderRadius="50%" mr={1} />
                                    <Typography variant="body2">В ожидании: {
                                        weeklyProgressData.reduce((sum, item) => sum + item.pending, 0)
                                    } задач</Typography>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </PageWrapper>
    );
};

export default DashboardPage;