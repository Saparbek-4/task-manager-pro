import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import styled from "styled-components";
import { Skeleton, message, Modal, Input, Button as AntButton } from "antd";
import {
    QuestionCircleOutlined,
    UserOutlined,
    ClockCircleOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { Select } from 'antd';
import Header from "../../components/Header"; // Import the Header component

// --- Data Types ---
interface Project {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    status?: "active" | "archived" | "completed";
}

interface Member {
    id: string;
    email: string;
    name?: string;
    role?: string;
    avatarUrl?: string;
}

interface Activity {
    id: string;
    event: string;
    user: string;
    timestamp: string;
    type: "member" | "project" | "task";
}

interface Board {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
}

// --- Styled Components ---
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const PageContent = styled.div`
  padding: 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
`;

const BackButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  transition: 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const ProjectHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.2rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatusBadge = styled.span<{ status?: Project["status"] }>`
  background-color: ${({ theme, status }) =>
          status === "completed"
                  ? theme.colors.success
                  : status === "archived"
                          ? theme.colors.warning
                          : status === "active"
                                  ? theme.colors.success
                                  : theme.colors.primaryLight};

  color: ${({ theme, status }) =>
          status === "completed"
                  ? theme.colors.success
                  : status === "archived"
                          ? theme.colors.warning
                          : status === "active"
                                  ? theme.colors.success
                                  : theme.colors.primary};

  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
`;


const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const CreatedAt = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-top: 1rem;
`;

const TabsNav = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-bottom: 0.5rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: ${({ active, theme }) =>
          active ? theme.colors.primary : "transparent"};
  color: ${({ active, theme }) =>
          active ? "#fff" : theme.colors.textPrimary};
  font-weight: 500;
  transition: 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ active }) => (active ? "#fff" : "inherit")};
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const MemberInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const MemberDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const MemberName = styled.span`
  font-weight: 500;
`;

const MemberEmail = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MemberRole = styled.span`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
`;

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 2rem;
  border: 1px dashed ${({ theme }) => theme.colors.borderLight};
  border-radius: 8px;
`;

const ActivityEvent = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DangerButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  border: 1px solid ${({ theme }) => theme.colors.error};
  &:hover {
    background: ${({ theme }) => theme.colors.errorLight};
    color: #fff;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoardDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const BoardName = styled.span`
  font-weight: 500;
`;

const BoardDescription = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusSelect = styled(Select)<{ status?: string }>`
  min-width: 120px;
  background-color: ${({ status, theme }) =>
    status === 'active' ? theme.colors.successLight :
        status === 'archived' ? theme.colors.warningLight :
            theme.colors.primaryLight};
  color: ${({ status, theme }) =>
    status === 'active' ? theme.colors.success :
        status === 'archived' ? theme.colors.warning :
            theme.colors.primary};
  font-weight: 600;
  border: none;
  border-radius: 6px;
  .ant-select-selector {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
  .ant-select-arrow {
    display: none; /* убрать стрелку */
  }
  &:hover {
    cursor: pointer;
    opacity: 0.9;
  }
`;

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

const getInitials = (name?: string, email: string = "") => {
    if (name) {
        const parts = name.split(" ");
        return parts.length > 1
            ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
            : name.slice(0, 2).toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
};

// === Modal Components ===
interface AddMemberModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (email: string) => Promise<void>;
    loading: boolean;
    members: Member[];
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
                                                           visible,
                                                           onCancel,
                                                           onConfirm,
                                                           loading,
                                                           members
                                                       }) => {
    const [selectedEmail, setSelectedEmail] = useState<string>("");
    const [users, setUsers] = useState<Member[]>([]);

    useEffect(() => {
        if (visible) {
            axiosInstance.get<Member[]>("/auth/all").then((res) => {
                const filtered = res.data.filter(
                    (u) => !members.some((m) => m.email === u.email)
                );
                setUsers(filtered);
            });
        }
    }, [visible, members]);

    const handleSubmit = async () => {
        await onConfirm(selectedEmail);
        setSelectedEmail("");
    };

    return (
        <Modal
            title="Добавить участника"
            open={visible}
            onCancel={onCancel}
            footer={[
                <AntButton key="cancel" onClick={onCancel}>
                    Отмена
                </AntButton>,
                <AntButton
                    key="submit"
                    type="primary"
                    disabled={!selectedEmail}
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Добавить
                </AntButton>
            ]}
        >
            <Select
                style={{ width: "100%" }}
                showSearch
                placeholder="Выберите пользователя"
                optionFilterProp="children"
                value={selectedEmail}
                onChange={setSelectedEmail}
                filterOption={(input, option) =>
                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={users.map((user) => ({
                    value: user.email,
                    label: `${user.name || user.email} (${user.email})`
                }))}
            />
        </Modal>
    );
};

interface AddBoardModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: (name: string, description: string) => Promise<void>;
    loading: boolean;
}

const AddBoardModal: React.FC<AddBoardModalProps> = ({
                                                         visible,
                                                         onCancel,
                                                         onConfirm,
                                                         loading,
                                                     }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        await onConfirm(name, description);
        setName("");
        setDescription("");
    };

    return (
        <Modal
            title="Создать новую доску"
            open={visible}
            onCancel={onCancel}
            footer={[
                <AntButton key="back" onClick={onCancel}>
                    Отмена
                </AntButton>,
                <AntButton
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    disabled={!name.trim()}
                >
                    Создать
                </AntButton>,
            ]}
        >
            <Input
                placeholder="Название доски"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginBottom: "1rem" }}
            />
            <Input.TextArea
                placeholder="Описание (необязательно)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
            />
        </Modal>
    );
};

// === Component ===
const ProjectDetailsPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [messageApi, messageHolder] = message.useMessage();

    // Data states
    const [project, setProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [activity, setActivity] = useState<Activity[]>([]);
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // UI states
    const [activeTab, setActiveTab] = useState<
        "overview" | "members" | "activity" | "boards"
    >("overview");
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [showAddBoardModal, setShowAddBoardModal] = useState(false);
    const [processing, setProcessing] = useState<string | null>(null);

    const [userRole, setUserRole] = useState<string | null>(null);

    // Determine active tab from URL
    useEffect(() => {
        if (location.pathname.endsWith("/members")) setActiveTab("members");
        else if (location.pathname.endsWith("/activity")) setActiveTab("activity");
        else if (location.pathname.includes("/boards")) setActiveTab("boards");
        else setActiveTab("overview");
    }, [location]);

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

    // Fetch all data
    const fetchProjectData = useCallback(async () => {
        if (!projectId) return;

        setLoading(true);
        try {
            const [projectRes, membersRes, activityRes, boardsRes] = await Promise.all([
                axiosInstance.get<Project>(`/projects/${projectId}`),
                axiosInstance.get<Member[]>(`/projects/${projectId}/members`),
                axiosInstance.get<Activity[]>(`/projects/${projectId}/activity`),
                axiosInstance.get<Board[]>(`/boards/project/${projectId}`),
            ]);

            setProject(projectRes.data);
            setMembers(membersRes.data);
            setActivity(activityRes.data);
            setBoards(boardsRes.data);
            setError("");
        } catch (err) {
            console.error("Failed to fetch project data:", err);
            setError("Не удалось загрузить данные проекта");
            messageApi.error("Ошибка загрузки данных проекта");
        } finally {
            setLoading(false);
        }
    }, [projectId, messageApi]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    // Handlers
    const handleRemoveMember = async (memberId: string) => {
        if (!projectId) return;

        setProcessing(`remove-member-${memberId}`);
        try {
            await axiosInstance.delete(`/projects/${projectId}/members/${memberId}`);
            setMembers((prev) => prev.filter((m) => m.id !== memberId));
            messageApi.success("Участник удалён");
        } catch (err) {
            console.error("Failed to remove member:", err);
            messageApi.error("Не удалось удалить участника");
        } finally {
            setProcessing(null);
        }
    };

    const handleAddMember = async (email: string) => {
        if (!projectId) return;

        setProcessing("add-member");
        try {
            await axiosInstance.post(`/projects/${projectId}/members`, { email });
            await fetchProjectData(); // Refresh all data
            messageApi.success("Участник добавлен");
            setShowAddMemberModal(false);
        } catch (err) {
            console.error("Failed to add member:", err);
            messageApi.error("Не удалось добавить участника");
        } finally {
            setProcessing(null);
        }
    };

    const handleAddBoard = async (name: string, description: string) => {
        if (!projectId) return;

        setProcessing("add-board");
        try {
            await axiosInstance.post(`/boards`, {
                projectId,
                name,
                description,
            });
            await fetchProjectData(); // Refresh all data
            messageApi.success("Доска создана");
            setShowAddBoardModal(false);
        } catch (err) {
            console.error("Failed to create board:", err);
            messageApi.error("Не удалось создать доску");
        } finally {
            setProcessing(null);
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        setProcessing(`delete-board-${boardId}`);
        try {
            await axiosInstance.delete(`/boards/${boardId}`);
            setBoards((prev) => prev.filter((b) => b.id !== boardId));
            messageApi.success("Доска удалена");
        } catch (err) {
            console.error("Failed to delete board:", err);
            messageApi.error("Не удалось удалить доску");
        } finally {
            setProcessing(null);
        }
    };

    const handleStatusChange = async (newStatus: Project["status"]) => {
        if (!projectId) return;
        setProcessing("change-status");
        try {
            await axiosInstance.patch(`/projects/${projectId}`, { status: newStatus });
            setProject(prev => prev ? { ...prev, status: newStatus } : prev);
            messageApi.success('Статус проекта обновлён');
        } catch (err) {
            messageApi.error('Ошибка изменения статуса');
        } finally {
            setProcessing(null);
        }
    };



    // Render loading or error state
    if (loading && !project) {
        return (
            <PageWrapper>
                <Header />
                <PageContent>
                    <Container>
                        <BackButton onClick={() => navigate(-1)}>← Назад</BackButton>
                        <Skeleton active paragraph={{ rows: 8 }} />
                    </Container>
                </PageContent>
            </PageWrapper>
        );
    }

    if (error || !project) {
        return (
            <PageWrapper>
                <Header />
                <PageContent>
                    <Container>
                        <BackButton onClick={() => navigate(-1)}>← Назад</BackButton>
                        <EmptyState>{error || "Проект не найден"}</EmptyState>
                    </Container>
                </PageContent>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <Header />
            {messageHolder}
            <PageContent>
                <Container>
                    <BackButton onClick={() => navigate('/projects')}>← Назад к проектам</BackButton>

                    {/* Header */}
                    <ProjectHeader>
                        <Title>
                            {project.name}{" "}
                            {userRole === "ADMIN" && (
                                <StatusSelect
                                    value={project.status}
                                    status={project.status}
                                    onChange={handleStatusChange}
                                    bordered={false}
                                    options={[
                                        { value: 'active', label: 'Активный' },
                                        { value: 'archived', label: 'Архивный' },
                                        { value: 'completed', label: 'Завершён' },
                                    ]}
                                />
                            )}

                        </Title>

                        <MetaInfo>
                            <Badge>Проект</Badge>
                            <CreatedAt>
                                <ClockCircleOutlined /> Создан {formatDate(project.createdAt)}
                            </CreatedAt>
                        </MetaInfo>
                        <Description>
                            {project.description || <i>Описание проекта не указано.</i>}
                        </Description>
                    </ProjectHeader>
                    {/* Tabs */}
                    <TabsNav>
                        {(["overview", "members", "activity", "boards"] as const).map((key) => (
                            <TabButton
                                key={key}
                                active={activeTab === key}
                                onClick={() =>
                                    navigate(
                                        key === "overview"
                                            ? `/projects/${projectId}`
                                            : `/projects/${projectId}/${key}`
                                    )
                                }
                            >
                                {{
                                    overview: "Обзор",
                                    members: `Участники (${members.length})`,
                                    activity: `Активность (${activity.length})`,
                                    boards: `Доски (${boards.length})`,
                                }[key]}
                            </TabButton>
                        ))}
                    </TabsNav>

                    {/* Tab Content */}
                    {activeTab === "overview" && (
                        <Section>
                            <SectionHeader>
                                <SectionTitle>
                                    <ClockCircleOutlined /> Обзор проекта
                                </SectionTitle>
                            </SectionHeader>
                            <List>
                                <ListItem>
                                    <span>Статус</span>
                                    <span>
                      <StatusBadge status={project.status}>
                        {project.status === "active" && "Активный"}
                          {project.status === "archived" && "Архивный"}
                          {project.status === "completed" && "Завершён"}
                      </StatusBadge>
                    </span>
                                </ListItem>
                                <ListItem>
                                    <span>Участников</span>
                                    <strong>{members.length}</strong>
                                </ListItem>
                                <ListItem>
                                    <span>Последних событий</span>
                                    <strong>{activity.length}</strong>
                                </ListItem>
                                <ListItem>
                                    <span>Досок</span>
                                    <strong>{boards.length}</strong>
                                </ListItem>
                                <ListItem>
                                    <span>Дата создания</span>
                                    <strong>{formatDate(project.createdAt)}</strong>
                                </ListItem>
                            </List>
                        </Section>
                    )}

                    {activeTab === "members" && (
                        <Section>
                            <SectionHeader>
                                <SectionTitle>
                                    <UserOutlined /> Участники проекта
                                </SectionTitle>
                                {userRole === "ADMIN" && (
                                    <Button onClick={() => setShowAddMemberModal(true)}>
                                        <PlusOutlined /> Добавить участника
                                    </Button>
                                )}
                            </SectionHeader>

                            {members.length === 0 ? (
                                <EmptyState>
                                    <QuestionCircleOutlined style={{ fontSize: 24 }} />
                                    <div>Нет участников в проекте</div>
                                </EmptyState>
                            ) : (
                                <List>
                                    {members.map((member) => (
                                        <ListItem key={member.id}>
                                            <MemberInfo>
                                                {member.avatarUrl ? (
                                                    <img
                                                        src={`http://localhost:8080${member.avatarUrl}`}
                                                        alt={member.name || member.email}
                                                        style={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <Avatar>{getInitials(member.name, member.email)}</Avatar>
                                                )}

                                                <MemberDetails>
                                                    <MemberName>{member.name || member.email}</MemberName>
                                                    {member.name && <MemberEmail>{member.email}</MemberEmail>}
                                                </MemberDetails>
                                                {member.role && <MemberRole>{member.role === "ADMIN" ? "OWNER" : "MEMBER"}</MemberRole>}
                                            </MemberInfo>
                                            {userRole === "ADMIN" && (
                                                <ActionsContainer>
                                                    <DangerButton
                                                        onClick={() => handleRemoveMember(member.id)}
                                                        disabled={processing === `remove-member-${member.id}`}
                                                    >
                                                        <DeleteOutlined />
                                                        {processing === `remove-member-${member.id}`
                                                            ? "Удаление..."
                                                            : "Удалить"}
                                                    </DangerButton>
                                                </ActionsContainer>
                                            )}

                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            <AddMemberModal
                                visible={showAddMemberModal}
                                onCancel={() => setShowAddMemberModal(false)}
                                onConfirm={handleAddMember}
                                loading={processing === "add-member"}
                                members={members}
                            />
                        </Section>
                    )}

                    {activeTab === "activity" && (
                        <Section>
                            <SectionHeader>
                                <SectionTitle>
                                    <QuestionCircleOutlined /> История активности
                                </SectionTitle>
                            </SectionHeader>
                            {activity.length === 0 ? (
                                <EmptyState>Нет событий активности</EmptyState>
                            ) : (
                                <List>
                                    {activity.map((item) => (
                                        <ListItem key={item.id}>
                                            <div>
                                                <strong>{item.user}</strong> <em>{item.event}</em>
                                            </div>
                                            <CreatedAt>
                                                <ClockCircleOutlined /> {formatDate(item.timestamp)}
                                            </CreatedAt>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Section>
                    )}

                    {activeTab === "boards" && (
                        <Section>
                            <SectionHeader>
                                <SectionTitle>Доски проекта</SectionTitle>
                                {userRole === "ADMIN" && (
                                    <Button onClick={() => setShowAddBoardModal(true)}>
                                        <PlusOutlined /> Создать доску
                                    </Button>
                                )}
                            </SectionHeader>
                            {boards.length === 0 ? (
                                <EmptyState>В проекте пока нет досок</EmptyState>
                            ) : (
                                <List>
                                    {boards.map((board) => (
                                        <ListItem key={board.id}>
                                            <BoardDetails>
                                                <BoardName>{board.name}</BoardName>
                                                {board.description && (
                                                    <BoardDescription>{board.description}</BoardDescription>
                                                )}
                                                <CreatedAt>
                                                    Создана {formatDate(board.createdAt)}
                                                </CreatedAt>
                                            </BoardDetails>
                                            <ActionsContainer>
                                                <Button
                                                    onClick={() => {
                                                        navigate(`/projects/${projectId}/boards/${board.id}`);
                                                    }}
                                                >
                                                    Открыть
                                                </Button>
                                                {userRole === "ADMIN" && (
                                                    <DangerButton
                                                        onClick={() => handleDeleteBoard(board.id)}
                                                        disabled={processing === `delete-board-${board.id}`}
                                                    >
                                                        <DeleteOutlined />
                                                        {processing === `delete-board-${board.id}`
                                                            ? "Удаление..."
                                                            : "Удалить"}
                                                    </DangerButton>
                                                )}

                                            </ActionsContainer>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                            <AddBoardModal
                                visible={showAddBoardModal}
                                onCancel={() => setShowAddBoardModal(false)}
                                onConfirm={handleAddBoard}
                                loading={processing === "add-board"}
                            />
                        </Section>
                    )}
                    <Outlet />
                </Container>
            </PageContent>
        </PageWrapper>
    );
};

export default ProjectDetailsPage;