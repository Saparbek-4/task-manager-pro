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
// Responsive breakpoints
const breakpoints = {
    xs: '480px',
    sm: '768px',
    md: '992px',
    lg: '1200px'
};

// Media query helper
const media = {
    xs: `@media (max-width: ${breakpoints.xs})`,
    sm: `@media (max-width: ${breakpoints.sm})`,
    md: `@media (max-width: ${breakpoints.md})`,
    lg: `@media (max-width: ${breakpoints.lg})`,
};

// Styled Components
const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 1.5rem 2rem;

  ${media.md} {
    padding: 1.25rem 1.5rem;
  }

  ${media.sm} {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;

  ${media.sm} {
    margin-bottom: 1rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TitleArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  font-weight: 700;

  ${media.xs} {
    font-size: 1.25rem;
  }
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

  ${media.sm} {
    width: 100%;
    justify-content: flex-end;
  }

  ${media.xs} {
    flex-direction: column;
    width: 100%;
  }
`;

const SearchFilterRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;

  ${media.md} {
    flex-wrap: wrap;
  }

  ${media.sm} {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  position: relative;
  min-width: 200px;
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

  ${media.xs} {
    font-size: 0.875rem;
    padding: 0.5rem 1rem 0.5rem 2.25rem;
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
  flex-wrap: wrap;

  ${media.xs} {
    width: 100%;
    justify-content: center;
  }
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
  white-space: nowrap;

  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.backgroundLight};
  }

  ${media.xs} {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    flex: 1;
    text-align: center;
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
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }

  ${media.xs} {
    width: 100%;
    justify-content: center;
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
  flex-wrap: wrap;

  ${media.xs} {
    font-size: 0.875rem;
    padding: 0.875rem;
  }
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

  ${media.xs} {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    margin-top: 0.5rem;
    margin-left: 0;
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

  ${media.sm} {
    padding: 2rem 1rem;
    margin: 1.5rem auto;
  }

  ${media.xs} {
    padding: 1.5rem 1rem;
    margin: 1rem auto;
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.5rem;
  opacity: 0.7;

  ${media.xs} {
    font-size: 2.5rem;
  }
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};

  ${media.xs} {
    font-size: 1.25rem;
  }
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  margin: 0;
  max-width: 500px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textSecondary};

  ${media.xs} {
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const EmptyStateButton = styled(NewProjectButton)`
  margin-top: 0.75rem;
  padding: 0.5rem 1.25rem;

  ${media.xs} {
    padding: 0.5rem 1rem;
  }
`;

const ProjectList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;

  ${media.lg} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  ${media.md} {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }

  ${media.sm} {
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  }
  
  ${media.xs} {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  
  ${media.xs} {
    padding: 1.5rem;
    font-size: 0.875rem;
  }
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