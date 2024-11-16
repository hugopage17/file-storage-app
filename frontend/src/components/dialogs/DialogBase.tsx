import React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ActionButton = styled(Button)(() => ({
    textTransform: 'none'
}))

export interface IProps {
    title: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    showActions?: boolean;
}

const DialogBase: React.FC<DialogProps<IProps>> = ({ payload, open, onClose }) => {
    const { title, children, onConfirm, showActions } = payload;

    return (
        <BootstrapDialog maxWidth='xl' open={open} onClose={() => onClose}>
            <DialogTitle sx={{ m: 0, p: 2 }}>{title}</DialogTitle>
            <DialogContent sx={{ width: 800 }} dividers>{children}</DialogContent>
            {showActions && (
                <DialogActions>
                    <ActionButton color='error' onClick={() => onClose()}>Cancel</ActionButton>
                    {onConfirm && <ActionButton onClick={onConfirm}>Submit</ActionButton>}
                </DialogActions>
            )}
        </BootstrapDialog>
    );
};

export default DialogBase;
