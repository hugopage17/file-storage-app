import React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import { Box, useTheme, Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Dropzone from 'react-dropzone';

const DropBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.text.secondary}`,
    padding: theme.spacing(4),
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const ActionButton = styled(Button)(() => ({
    textTransform: 'none',
    '&:focus': {
        outline: 'none',
        boxShadow: 'none',
    }
}))

interface IProps {
    onDrop: (acceptedFiles: File[]) => Promise<void>;
    onConfirm: () => void;
}

const UploadFileContent: React.FC<DialogProps<IProps>> = ({ payload, open, onClose }) => {
    const { onDrop, onConfirm } = payload;
    const theme = useTheme();

    return (
        <BootstrapDialog maxWidth='xl' open={open} onClose={() => onClose}>
            <DialogTitle sx={{ m: 0, p: 2 }}>Upload a new File</DialogTitle>
            <DialogContent sx={{ width: 800 }} dividers>
                <>
                    <Dropzone onDrop={(files) => {
                        onDrop(files).then(() => {
                            onConfirm();
                            onClose();
                        });
                    }}>
                        {({ getRootProps, getInputProps }) => (
                            <DropBox {...getRootProps()}>
                                <input {...getInputProps()} />
                                <p>Drag 'n' drop some files here, or click to select files</p>
                                <FileUploadIcon sx={{ fontSize: 66, color: theme.palette.text.secondary }} />
                            </DropBox>
                        )}
                    </Dropzone>
                </>
            </DialogContent>
            <DialogActions>
                <ActionButton color='error' onClick={() => onClose()}>Cancel</ActionButton>
            </DialogActions>
        </BootstrapDialog>
    )
}

export default UploadFileContent;
