import styled from 'styled-components';

export const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const BaseInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  
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
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 120px;
  resize: vertical;
  
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
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

export const InputHint = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 0.5rem;
`;

export const InputError = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.error};
  margin-top: 0.5rem;
`;