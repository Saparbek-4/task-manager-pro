import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MUIButton, Divider } from '@mui/material';
import styled from 'styled-components';

// Стили для диалога колонки
const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    border-radius: 12px;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  background: #f8fafc;
  padding: 1.25rem;
`;

const DialogDivider = styled(Divider)`
  margin: 0.5rem 0 1.5rem;
`;

// Интерфейс пропсов для диалога колонок
interface ColumnDialogProps {
    open: boolean;
    title: string;
    columnName: string;
    onClose: () => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    disableSubmit?: boolean;
}

const ColumnDialog: React.FC<ColumnDialogProps> = ({
                                                       open,
                                                       title,
                                                       columnName,
                                                       onClose,
                                                       onChange,
                                                       onSubmit,
                                                       disableSubmit = false,
                                                   }) => (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <StyledDialogTitle>{title}</StyledDialogTitle>
        <DialogContent>
            <TextField
                label="Column Name"
                fullWidth
                margin="normal"
                value={columnName}
                onChange={onChange}
                placeholder="Enter column name"
                variant="outlined"
                InputProps={{ style: { borderRadius: '8px' } }}
            />
            <DialogDivider />
        </DialogContent>
        <DialogActions sx={{ padding: '1rem' }}>
            <MUIButton
                onClick={onClose}
                sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    color: '#64748b',
                }}
            >
                Cancel
            </MUIButton>
            <MUIButton
                variant="contained"
                onClick={onSubmit}
                disabled={disableSubmit}
                sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    backgroundColor: '#3b82f6',
                    '&:hover': { backgroundColor: '#2563eb' },
                }}
            >
                {title.includes('Edit') ? 'Update Column' : 'Add Column'}
            </MUIButton>
        </DialogActions>
    </StyledDialog>
);

export default ColumnDialog;
