import styled from 'styled-components';

export const Heading1 = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Heading2 = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Heading3 = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0 0 0.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Heading4 = styled.h4`
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 0.75rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Text = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TextSmall = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0 0 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const TextLarge = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
`;