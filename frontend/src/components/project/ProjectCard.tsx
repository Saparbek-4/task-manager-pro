import React from "react";
import styled from "styled-components";

type Project = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    status: 'active' | 'archived' | 'completed';
    taskCount: number;
};

type Props = {
    project: Project;
};

const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const StatusIndicator = styled.div<{ status: 'active' | 'archived' | 'completed' }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${({ theme, status }) =>
          status === 'completed' ? theme.colors.success :
                  status === 'archived' ? theme.colors.warning :
                          theme.colors.primary};
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.25rem 0.75rem;
  position: relative;
`;

const ProjectName = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const ProjectDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBadge = styled.span<{ status: 'active' | 'archived' | 'completed' }>`
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 500;
  background-color: ${({ theme, status }) =>
          status === 'completed' ? theme.colors.successLight :
                  status === 'archived' ? theme.colors.warningLight :
                          theme.colors.primaryLight};
  color: ${({ theme, status }) =>
          status === 'completed' ? theme.colors.success :
                  status === 'archived' ? theme.colors.warning :
                          theme.colors.primary};
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  opacity: 0.5;
  margin: 0.4rem 0;
`;

const ProjectContent = styled.div`
  padding: 0.75rem 1.25rem 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ProjectDesc = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  flex-grow: 1;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProjectStats = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatIcon = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ViewButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &::after {
    content: "→";
    font-size: 1rem;
    transition: transform 0.2s ease;
  }

  &:hover::after {
    transform: translateX(2px);
  }
`;

// Function to get status in Russian
const getStatusText = (status: 'active' | 'archived' | 'completed'): string => {
    const statusMap = {
        active: 'Активный',
        archived: 'В архиве',
        completed: 'Завершён'
    };
    return statusMap[status];
};


const ProjectCard: React.FC<Props> = ({ project }) => {
    // Demo task count
    const taskCount = project.taskCount

    return (
        <Card>
            <StatusIndicator status={project.status} />
            <CardHeader>
                <ProjectName>{project.name}</ProjectName>
                <ProjectMeta>
                    <ProjectDate>
                        <span role="img" aria-label="calendar">📅</span> {project.createdAt}
                    </ProjectDate>
                    <StatusBadge status={project.status}>
                        {getStatusText(project.status)}
                    </StatusBadge>
                </ProjectMeta>
                <Divider />
            </CardHeader>

            <ProjectContent>
                <ProjectDesc>
                    {project.description || "Описание проекта отсутствует."}
                </ProjectDesc>
            </ProjectContent>

            <CardFooter>
                <ProjectStats>
                    <StatItem>
                        <StatIcon role="img" aria-label="tasks">📋</StatIcon>
                        {taskCount} задач{taskCount === 1 ? 'а' : (taskCount >= 2 && taskCount <= 4) ? 'и' : ''}
                    </StatItem>
                </ProjectStats>
                <ViewButton>Открыть</ViewButton>
            </CardFooter>
        </Card>
    );
};

export default ProjectCard;