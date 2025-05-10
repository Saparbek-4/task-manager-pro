import styled from 'styled-components';

type CardElevation = 'none' | 'sm' | 'md' | 'lg';

export const Card = styled.div<{
    elevation?: CardElevation;
    interactive?: boolean;
    padding?: boolean;
    borderRadius?: string;
}>`
  background-color: white;
  border-radius: ${({ theme, borderRadius }) => borderRadius || theme.borderRadius.lg};
  overflow: hidden;
  transition: all 0.2s ease;
  padding: ${({ padding, theme }) => padding ? theme.spacing.lg : '0'};
  
  /* Elevation variants */
  box-shadow: ${({ theme, elevation }) =>
    elevation === 'none' ? 'none' :
        elevation === 'sm' ? theme.shadows.sm :
            elevation === 'lg' ? theme.shadows.lg :
                theme.shadows.md
};
  
  /* Interactive state */
  ${({ interactive }) => interactive && `
    cursor: pointer;
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  `}
`;

Card.defaultProps = {
    elevation: 'md',
    interactive: false,
    padding: false,
};

export const CardHeader = styled.div<{ withBorder?: boolean }>`
  padding: 1.5rem;
  border-bottom: ${({ withBorder, theme }) =>
    withBorder ? `1px solid ${theme.colors.border}` : 'none'};
`;

export const CardBody = styled.div`
  padding: 1.5rem;
`;

export const CardFooter = styled.div<{ withBorder?: boolean }>`
  padding: 1.5rem;
  border-top: ${({ withBorder, theme }) =>
    withBorder ? `1px solid ${theme.colors.border}` : 'none'};
`;