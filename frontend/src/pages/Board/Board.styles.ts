import styled from 'styled-components';
import { Button as MUIButton, IconButton } from '@mui/material';
import { Search } from '@mui/icons-material';

export const PageWrapper = styled.div`
  background-color: #f8fafc;
  min-height: 100vh;
  padding: 1.5rem;
`;

export const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const BoardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const BoardHeading = styled.h1`
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0;
  font-weight: 600;
`;

export const BoardFavorite = styled(IconButton)`
  color: #f59e0b;
  padding: 4px;
`;

export const BoardActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const SearchBox = styled.div`
  position: relative;
  width: 240px;
`;

export const SearchIconStyled = styled(Search)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

export const SearchInput = styled.input`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: white;
  }
`;

export const BackButton = styled(MUIButton)`
  text-transform: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #475569;
  border: 1px solid #e2e8f0;
  background: white;

  &:hover {
    background: #f1f5f9;
  }
`;

export const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
`;

export const BoardContent = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 140px);
`;

export const ColumnsWrapper = styled.div`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 0.5rem;
  flex: 1;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const AddColumnBtn = styled(MUIButton)`
  text-transform: none;
  border-radius: 12px;
  height: 100%;
  border: 2px dashed #e2e8f0;
  color: #64748b;
  padding: 2rem 1rem;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #3b82f6;
  }
`;
