import styled from 'styled-components';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export const Button = styled.button<{
    size?: ButtonSize;
    variant?: ButtonVariant;
    fullWidth?: boolean;
    elevation?: boolean;
}>`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  box-shadow: ${({ elevation, theme }) => elevation ? theme.shadows.sm : 'none'};
  
  /* Size variants */
  padding: ${({ size }) =>
    size === 'sm' ? '0.5rem 1rem' :
        size === 'lg' ? '1rem 2rem' :
            '0.75rem 1.5rem'};
  
  font-size: ${({ size }) =>
    size === 'sm' ? '0.875rem' :
        size === 'lg' ? '1.125rem' :
            '1rem'};
  
  /* Color variants */
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary :
        variant === 'secondary' ? theme.colors.secondary :
            variant === 'danger' ? theme.colors.error :
                'transparent'};
  
  color: ${({ theme, variant }) =>
    variant === 'primary' || variant === 'secondary' || variant === 'danger' ?
        'white' :
        variant === 'outline' ?
            theme.colors.primary :
            theme.colors.textPrimary};
  
  border: ${({ theme, variant }) =>
    variant === 'outline' ? `1px solid ${theme.colors.primary}` :
        variant === 'ghost' ? '1px solid transparent' :
            'none'};
  
  /* Hover effects */
  &:hover {
    background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primaryDark :
        variant === 'secondary' ? '#596577' :
            variant === 'danger' ? '#DC2626' :
                variant === 'outline' ? theme.colors.primaryLight :
                    variant === 'ghost' ? 'rgba(0,0,0,0.05)' :
                        'transparent'};
    
    transform: ${({ elevation }) => elevation ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ elevation, theme }) => elevation ? theme.shadows.md : 'none'};
  }
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`;

Button.defaultProps = {
    size: 'md',
    variant: 'primary',
    fullWidth: false,
    elevation: true,
};