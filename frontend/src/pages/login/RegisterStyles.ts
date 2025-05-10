import styled from "styled-components";
import {
    Container,
    Card,
    CardHeader,
    Title,
    Subtitle,
    Form,
    FormGroup,
    Label,
    Input,
    ErrorMsg,
    Button,
    Spinner,
    Divider,
    DividerText,
    SocialButtonsContainer,
    SocialButton,
    ErrorAlert,
    FooterText,
    LinkText
} from "./LoginStyles";

// Export all components from LoginStyles for reuse
export {
    Container,
    Card,
    CardHeader,
    Title,
    Subtitle,
    Form,
    FormGroup,
    Label,
    Input,
    ErrorMsg,
    Button,
    Spinner,
    Divider,
    DividerText,
    SocialButtonsContainer,
    SocialButton,
    ErrorAlert,
    FooterText,
    LinkText
};

// Additional components specific to registration
export const PasswordStrengthContainer = styled.div`
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
`;

export const PasswordStrengthBar = styled.div`
  height: 0.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#f3f4f6'};
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.25rem;
`;

interface StrengthIndicatorProps {
    strength: 'weak' | 'medium' | 'strong';
}

export const StrengthIndicator = styled.div<StrengthIndicatorProps>`
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
  width: ${({ strength }) => {
    switch (strength) {
        case 'weak': return '33%';
        case 'medium': return '66%';
        case 'strong': return '100%';
        default: return '0%';
    }
}};
  background-color: ${({ strength, theme }) => {
    switch (strength) {
        case 'weak': return theme.colors.error || '#ef4444';
        case 'medium': return theme.colors.warning || '#f59e0b';
        case 'strong': return theme.colors.success || '#10b981';
        default: return theme.colors.gray300 || '#d1d5db';
    }
}};
`;

export const StrengthText = styled.div<StrengthIndicatorProps>`
  font-size: 0.75rem;
  color: ${({ strength, theme }) => {
    switch (strength) {
        case 'weak': return theme.colors.error || '#ef4444';
        case 'medium': return theme.colors.warning || '#f59e0b';
        case 'strong': return theme.colors.success || '#10b981';
        default: return theme.colors.gray500 || '#6b7280';
    }
}};
`;

export const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const TermsCheckbox = styled.input`
  margin-top: 0.25rem;
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  accent-color: ${({ theme }) => theme.colors.primary || '#3b82f6'};
`;

export const TermsText = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textLight || '#6b7280'};
  line-height: 1.5;
`;

export const FormHint = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textLight || '#6b7280'};
`;

export const GridForm = styled(Form)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const GridFullWidth = styled.div`
  grid-column: 1 / -1;
`;