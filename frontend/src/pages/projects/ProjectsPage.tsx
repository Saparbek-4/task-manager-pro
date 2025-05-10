import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import CreateProjectModal from "../../components/project/CreateProjectModal";
import ProjectCard from "../../components/project/ProjectCard";
import Header from "../../components/Header";
// Types
type Project = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    status: 'active' | 'archived' | 'completed';
};

type FilterStatus = 'all' | 'active' | 'archived' | 'completed';

// Styled Components
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.5rem 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  font-weight: 700;
`;

const ProjectCount = styled.span`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SearchFilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1rem;
  background-color: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const FilterTabs = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterTab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.textSecondary};

  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.backgroundLight};
  }
`;

const NewProjectButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
`;

const ButtonIcon = styled.span`
  font-size: 1rem;
  font-weight: bold;
`;

const ContentArea = styled.div`
  position: relative;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.primary};

  &::after {
    content: "";
    width: 30px;
    height: 30px;
    border: 3px solid ${({ theme }) => theme.colors.primaryLight};
    border-radius: 50%;
    border-top-color: ${({ theme }) => theme.colors.primary};
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorText = styled.div`
  text-align: center;
  color: white;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: 8px;
  margin: 1.5rem auto;
  max-width: 800px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1rem;
`;

const ErrorIcon = styled.span`
  font-size: 1.25rem;
`;

const RetryButton = styled.button`
  background: white;
  color: ${({ theme }) => theme.colors.error};
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.75rem;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin: 2rem auto;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.5rem;
  opacity: 0.7;
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin: 0;
  max-width: 500px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyStateButton = styled(NewProjectButton)`
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;
`;

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
`;

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get<Project[]>('/projects');
            setProjects(response.data);
            setError("");
        } catch (err: any) {
            setError("Не удалось загрузить проекты");
            console.error("Ошибка при получении проектов:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get("/user/me");
                setUserRole(res.data.role); // ← убедись, что поле `role` есть в ответе
            } catch (err) {
                console.error("Ошибка при получении пользователя", err);
            }
        };
        fetchUser();
    }, []);
    // Filter projects based on search query and status filter
    useEffect(() => {
        let result = [...projects];

        // Apply status filter
        if (activeFilter !== "all") {
            result = result.filter(project => project.status === activeFilter);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                project =>
                    project.name.toLowerCase().includes(query) ||
                    project.description.toLowerCase().includes(query)
            );
        }

        setFilteredProjects(result);
    }, [projects, searchQuery, activeFilter]);

    const handleCreate = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);
    const handleProjectCreated = () => {
        fetchProjects();
        handleModalClose();
    };
    return (
        <PageWrapper>
            <Header/>

            <Container>
                <PageHeader>
                    <TopBar>
                        <TitleArea>
                            <Title>Мои проекты</Title>
                            {!isLoading && !error && (
                                <ProjectCount>{projects.length}</ProjectCount>
                            )}
                        </TitleArea>

                        {userRole === "ADMIN" && (
                            <ActionButtons>
                                <NewProjectButton onClick={handleCreate}>
                                    <ButtonIcon>+</ButtonIcon>
                                    Новый проект
                                </NewProjectButton>
                            </ActionButtons>
                        )}
                    </TopBar>

                    {!isLoading && !error && projects.length > 0 && (
                        <SearchFilterRow>
                            <SearchBar>
                                <SearchIcon>🔍</SearchIcon>
                                <SearchInput
                                    placeholder="Поиск проектов..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </SearchBar>

                            <FilterTabs>
                                <FilterTab
                                    active={activeFilter === "all"}
                                    onClick={() => setActiveFilter("all")}
                                >
                                    Все
                                </FilterTab>
                                <FilterTab
                                    active={activeFilter === "active"}
                                    onClick={() => setActiveFilter("active")}
                                >
                                    Активные
                                </FilterTab>
                                <FilterTab
                                    active={activeFilter === "completed"}
                                    onClick={() => setActiveFilter("completed")}
                                >
                                    Завершённые
                                </FilterTab>
                                <FilterTab
                                    active={activeFilter === "archived"}
                                    onClick={() => setActiveFilter("archived")}
                                >
                                    Архив
                                </FilterTab>
                            </FilterTabs>
                        </SearchFilterRow>
                    )}
                </PageHeader>

                <ContentArea>
                    {isLoading && <Loader/>}

                    {error && (
                        <ErrorText>
                            <ErrorIcon>⚠️</ErrorIcon>
                            {error}
                            <RetryButton onClick={fetchProjects}>Повторить</RetryButton>
                        </ErrorText>
                    )}

                    {!isLoading && !error && projects.length === 0 && (
                        <EmptyState>
                            <EmptyStateIcon>📁</EmptyStateIcon>
                            <EmptyStateTitle>Проектов пока нет</EmptyStateTitle>

                            {userRole === "ADMIN" ? (
                                <EmptyStateText>
                                    У вас пока нет проектов. Создайте новый проект, чтобы начать работу.
                                </EmptyStateText>,
                                <EmptyStateButton onClick={handleCreate}>
                                    <ButtonIcon>+</ButtonIcon>
                                    Создать первый проект
                                </EmptyStateButton>
                            ) : (
                                <EmptyStateText>
                                У вас пока нет проектов.
                                </EmptyStateText>
                                )}

                        </EmptyState>
                    )}

                    {!isLoading && !error && projects.length > 0 && filteredProjects.length === 0 && (
                        <NoResultsMessage>
                            По вашему запросу ничего не найдено. Попробуйте изменить параметры поиска.
                        </NoResultsMessage>
                    )}

                    {!isLoading && !error && filteredProjects.length > 0 && (
                        <ProjectList>
                            {filteredProjects.map(project => (
                                <div
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <ProjectCard
                                        project={{
                                            ...project,
                                            createdAt: new Date(project.createdAt).toLocaleDateString('ru-RU', {
                                                day: '2-digit', month: 'long', year: 'numeric'
                                            })
                                        }}
                                    />
                                </div>
                            ))}
                        </ProjectList>
                    )}
                </ContentArea>

                {isModalOpen && (
                    <CreateProjectModal
                        onClose={handleModalClose}
                        onSuccess={handleProjectCreated}
                    />
                )}
            </Container>
        </PageWrapper>
    );
}

export default ProjectsPage;