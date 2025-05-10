import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#f3f4f6'};
  padding: 1rem;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 28rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
`;

export const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text || '#111827'};
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight || '#6b7280'};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || '#374151'};
  margin-bottom: 0.25rem;
`;

export const Input = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ hasError, theme }) =>
    hasError ? theme.colors.error || '#ef4444' : theme.colors.border || '#d1d5db'};
  border-radius: 0.5rem;
  font-size: 1rem;
  width: 100%;
  background-color: white;
  transition: all 0.2s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}25` || 'rgba(59, 130, 246, 0.25)'};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.placeholder || '#9ca3af'};
  }
`;

export const ErrorMsg = styled.span`
  color: ${({ theme }) => theme.colors.error || '#ef4444'};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  accent-color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LinkText = styled.a`
  color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.primaryDark || '#2563eb'};
  }
`;

export const Button = styled.button<{ $isLoading?: boolean }>`
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  opacity: ${({ $isLoading }) => ($isLoading ? '0.7' : '1')};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark || '#2563eb'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
    pointer-events: ${({ $isLoading }) => ($isLoading ? "none" : "auto")};
`;

export const Spinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border || '#d1d5db'};
  }
  
  &::before {
    margin-right: 0.5rem;
  }
  
  &::after {
    margin-left: 0.5rem;
  }
`;

export const DividerText = styled.span`
  color: ${({ theme }) => theme.colors.textLight || '#6b7280'};
  font-size: 0.75rem;
`;

export const SocialButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

export const SocialButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.625rem;
  border: 1px solid ${({ theme }) => theme.colors.border || '#d1d5db'};
  border-radius: 0.5rem;
  background-color: white;
  transition: background-color 0.2s ease-in-out;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundLight || '#f3f4f6'};
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${({ theme }) => theme.colors.textLight || '#6b7280'};
  }
`;

export const ErrorAlert = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => `${theme.colors.error}10` || 'rgba(239, 68, 68, 0.1)'};
  color: ${({ theme }) => theme.colors.error || '#ef4444'};
  border-radius: 0.5rem;
  border-left: 4px solid ${({ theme }) => theme.colors.error || '#ef4444'};
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

export const FooterText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight || '#6b7280'};
  text-align: center;
  margin-top: 1.5rem;
`;