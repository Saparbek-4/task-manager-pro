import React, { useState } from "react";
import styled from "styled-components";
import axiosInstance from "../../api/axiosInstance";

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 500px;
  max-width: 95%;
  padding: 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease;
  overflow: hidden;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const ModalHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
`;

const Title = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.25rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  margin: 0.4rem 0 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.25rem;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 0.9rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const CharCounter = styled.span<{ isWarning: boolean }>`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 0.7rem;
  color: ${({ theme, isWarning }) =>
          isWarning ? theme.colors.warning : theme.colors.textSecondary};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const FormHint = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.4rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${({ theme, variant }) =>
          variant === "secondary" ? "transparent" : theme.colors.primary};

  color: ${({ theme, variant }) =>
          variant === "secondary" ? theme.colors.textPrimary : "#fff"};

  border: ${({ theme, variant }) =>
          variant === "secondary" ? `1px solid ${theme.colors.border}` : "none"};

  &:hover {
    background: ${({ theme, variant }) =>
            variant === "secondary" ? theme.colors.backgroundLight : theme.colors.primaryDark};
    transform: translateY(-1px);
    box-shadow: ${({ variant }) =>
            variant === "secondary" ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)"};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background-color: ${({ theme }) => theme.colors.errorLight};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-left: 3px solid ${({ theme }) => theme.colors.error};
`;

const ErrorIcon = styled.div`
  font-size: 1rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: 999px;
  overflow: hidden;
  margin: 0.75rem 0;

  &::after {
    content: "";
    display: block;
    height: 100%;
    width: ${({ progress }) => `${progress}%`};
    background-color: ${({ theme }) => theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

const CreateProjectModal: React.FC<Props> = ({ onClose, onSuccess }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // For field validation and UX
    const MAX_NAME_LENGTH = 100;
    const MAX_DESC_LENGTH = 500;

    // Calculate form progress
    const calculateProgress = () => {
        let points = 0;
        if (name.trim().length > 0) points += 50;
        if (description.trim().length > 0) points += 50;
        return points;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!name.trim()) {
            setError("Название проекта обязательно");
            return;
        }

        setIsSubmitting(true);
        try {
            await axiosInstance.post("/projects", {
                name,
                description,
                status: 'active'
            });
            onSuccess();
        } catch (err) {
            console.error(err);
            setError("Не удалось создать проект. Пожалуйста, попробуйте снова.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Overlay onClick={handleOverlayClick}>
            <Modal onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <Title>Создание нового проекта</Title>
                    <Subtitle>Заполните основную информацию о вашем проекте</Subtitle>
                    <CloseButton onClick={onClose} disabled={isSubmitting}>×</CloseButton>
                </ModalHeader>

                <ModalBody>
                    {error && (
                        <ErrorMsg>
                            <ErrorIcon>⚠️</ErrorIcon>
                            {error}
                        </ErrorMsg>
                    )}

                    <ProgressBar progress={calculateProgress()} />

                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label htmlFor="project-name">Название проекта *</Label>
                            <InputWrapper>
                                <Input
                                    id="project-name"
                                    type="text"
                                    placeholder="Введите название проекта"
                                    value={name}
                                    onChange={e => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
                                    disabled={isSubmitting}
                                    maxLength={MAX_NAME_LENGTH}
                                />
                                <CharCounter isWarning={name.length > MAX_NAME_LENGTH * 0.8}>
                                    {name.length}/{MAX_NAME_LENGTH}
                                </CharCounter>
                            </InputWrapper>
                            <FormHint>Удачное название поможет быстро идентифицировать проект</FormHint>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="project-description">Описание</Label>
                            <InputWrapper>
                                <TextArea
                                    id="project-description"
                                    placeholder="Добавьте описание проекта (опционально)"
                                    value={description}
                                    onChange={e => setDescription(e.target.value.slice(0, MAX_DESC_LENGTH))}
                                    disabled={isSubmitting}
                                    maxLength={MAX_DESC_LENGTH}
                                />
                                <CharCounter isWarning={description.length > MAX_DESC_LENGTH * 0.8}>
                                    {description.length}/{MAX_DESC_LENGTH}
                                </CharCounter>
                            </InputWrapper>
                            <FormHint>Краткое описание целей и задач проекта</FormHint>
                        </FormGroup>
                    </Form>
                </ModalBody>

                <ModalFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim()}
                    >
                        {isSubmitting ? "Создание..." : "Создать проект"}
                    </Button>
                </ModalFooter>
            </Modal>
        </Overlay>
    );
};

export default CreateProjectModal;