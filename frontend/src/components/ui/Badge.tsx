import styled from 'styled-components';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

export const Badge = styled.span<{
    variant?: BadgeVariant;
    size?: BadgeSize;
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  font-weight: 500;
  
  /* Size variants */
  padding: ${({ size }) =>
    size === 'sm' ? '0.15rem 0.5rem' :
        size === 'lg' ? '0.35rem 1rem' :
            '0.25rem 0.75rem'};
  
  font-size: ${({ size }) =>
    size === 'sm' ? '0.75rem' :
        size === 'lg' ? '0.95rem' :
            '0.85rem'};
  
  /* Color variants */
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primaryLight :
        variant === 'secondary' ? theme.colors.secondaryLight :
            variant === 'success' ? theme.colors.successLight :
                variant === 'warning' ? theme.colors.warningLight :
                    variant === 'error' ? theme.colors.errorLight :
                        theme.colors.primaryLight};
  
  color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary :
        variant === 'secondary' ? theme.colors.secondary :
            variant === 'success' ? theme.colors.success :
                variant === 'warning' ? theme.colors.warning :
                    variant === 'error' ? theme.colors.error :
                        theme.colors.primary};
`;

Badge.defaultProps = {
    variant: 'primary',
    size: 'md',
};