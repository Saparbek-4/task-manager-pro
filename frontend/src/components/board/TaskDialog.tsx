import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button as MUIButton, Typography, Divider } from '@mui/material';
import styled from 'styled-components';

// Стили
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

const PriorityButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const PriorityButton = styled(MUIButton)<{ $isActive: boolean; $priority: string }>`
  text-transform: none;
  border-radius: 20px;
  background: ${({ $isActive, $priority }) =>
    $isActive
        ? $priority === 'HIGH'
            ? '#fee2e2'
            : $priority === 'MEDIUM'
                ? '#fef3c7'
                : '#d1fae5'
        : 'white'};
  color: ${({ $isActive, $priority }) =>
    $isActive
        ? $priority === 'HIGH'
            ? '#b91c1c'
            : $priority === 'MEDIUM'
                ? '#b45309'
                : '#047857'
        : '#64748b'};
  border: 1px solid ${({ $isActive, $priority }) =>
    $isActive
        ? $priority === 'HIGH'
            ? '#fecaca'
            : $priority === 'MEDIUM'
                ? '#fde68a'
                : '#a7f3d0'
        : '#e2e8f0'};
  font-weight: ${({ $isActive }) => ($isActive ? '500' : '400')};
  box-shadow: ${({ $isActive }) => ($isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none')};
  &:hover {
    background: ${({ $priority }) =>
    $priority === 'HIGH'
        ? '#fee2e2'
        : $priority === 'MEDIUM'
            ? '#fef3c7'
            : '#d1fae5'};
  }
`;

const TaskStatusButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const StatusButton = styled(MUIButton)<{ $isActive: boolean; $status: string }>`
  text-transform: none;
  border-radius: 20px;
  background: ${({ $isActive, $status }) =>
    $isActive
        ? $status === 'TODO'
            ? '#e0f2fe'
            : $status === 'IN_PROGRESS'
                ? '#fef3c7'
                : '#dcfce7'
        : 'white'};
  color: ${({ $isActive, $status }) =>
    $isActive
        ? $status === 'TODO'
            ? '#0284c7'
            : $status === 'IN_PROGRESS'
                ? '#d97706'
                : '#16a34a'
        : '#64748b'};
  border: 1px solid ${({ $isActive, $status }) =>
    $isActive
        ? $status === 'TODO'
            ? '#7dd3fc'
            : $status === 'IN_PROGRESS'
                ? '#fcd34d'
                : '#86efac'
        : '#e2e8f0'};
  font-weight: ${({ $isActive }) => ($isActive ? '500' : '400')};
  box-shadow: ${({ $isActive }) => ($isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none')};
  &:hover {
    background: ${({ $status }) =>
    $status === 'TODO'
        ? '#e0f2fe'
        : $status === 'IN_PROGRESS'
            ? '#fef3c7'
            : '#dcfce7'};
  }
`;

// Типы
interface Member { id: string; name?: string; email: string }
interface TaskDialogProps {
    open: boolean;
    dialogTitle: string;
    title: string;
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    description: string;
    onDescriptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    onPriorityChange: (p: 'LOW' | 'MEDIUM' | 'HIGH') => void;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    onStatusChange: (s: 'TODO' | 'IN_PROGRESS' | 'DONE') => void;
    dueDate: string;
    onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    assignees: Member[];
    selectedAssignee: string | null;
    onAssigneeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSubmit: () => void;
    disableSubmit?: boolean;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
                                                   open,
                                                   dialogTitle,
                                                   title,
                                                   onTitleChange,
                                                   description,
                                                   onDescriptionChange,
                                                   priority,
                                                   onPriorityChange,
                                                   status,
                                                   onStatusChange,
                                                   dueDate,
                                                   onDueDateChange,
                                                   assignees,
                                                   selectedAssignee,
                                                   onAssigneeChange,
                                                   onClose,
                                                   onSubmit,
                                                   disableSubmit = false,
                                               }) => (
    <StyledDialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <StyledDialogTitle>{dialogTitle}</StyledDialogTitle>
        <DialogContent>
            <TextField
                label="Task Title"
                fullWidth
                margin="normal"
                value={title}
                onChange={onTitleChange}
                placeholder="Enter task title"
                variant="outlined"
                InputProps={{ style: { borderRadius: '8px' } }}
            />
            <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={3}
                value={description}
                onChange={onDescriptionChange}
                placeholder="Add more details to this task..."
                variant="outlined"
                InputProps={{ style: { borderRadius: '8px' } }}
            />
            <Typography variant="subtitle2" color="#475569" sx={{ mt: 2, mb: 1 }}>
                Priority
            </Typography>
            <PriorityButtons>
                {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                    <PriorityButton
                        key={p}
                        $isActive={priority === p}
                        $priority={p}
                        size="small"
                        onClick={() => onPriorityChange(p as 'LOW' | 'MEDIUM' | 'HIGH')}
                    >
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                    </PriorityButton>
                ))}
            </PriorityButtons>
            <Typography variant="subtitle2" color="#475569" sx={{ mt: 2, mb: 1 }}>
                Status
            </Typography>
            <TaskStatusButtons>
                {['TODO', 'IN_PROGRESS', 'DONE'].map((s) => (
                    <StatusButton
                        key={s}
                        $isActive={status === s}
                        $status={s}
                        size="small"
                        onClick={() => onStatusChange(s as 'TODO' | 'IN_PROGRESS' | 'DONE')}
                    >
                        {s === 'TODO' ? 'To Do' : s === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                    </StatusButton>
                ))}
            </TaskStatusButtons>
            <TextField
                label="Due Date"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                value={dueDate}
                onChange={onDueDateChange}
                variant="outlined"
                InputProps={{ style: { borderRadius: '8px' } }}
            />
            <TextField
                select
                fullWidth
                label="Assignee"
                value={selectedAssignee || ''}
                onChange={onAssigneeChange}
                margin="normal"
                variant="outlined"
                InputProps={{ style: { borderRadius: '8px' } }}
            >
                <MenuItem value="">None</MenuItem>
                {assignees.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.name || user.email}
                    </MenuItem>
                ))}
            </TextField>
            <DialogDivider />
        </DialogContent>
        <DialogActions sx={{ padding: '1rem' }}>
            <MUIButton onClick={onClose} sx={{ borderRadius: '8px', textTransform: 'none', color: '#64748b' }}>
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
                {dialogTitle.includes('Edit') ? 'Update Task' : 'Add Task'}
            </MUIButton>
        </DialogActions>
    </StyledDialog>
);

export default TaskDialog;
