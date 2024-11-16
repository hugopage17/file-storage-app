import React from 'react';
import { DialogProps } from '@toolpad/core/useDialogs';
import { Box, useTheme, Button, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import moment from 'moment-timezone';
import { StorageObject } from '../../types';
import { Close } from '@mui/icons-material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


interface IProps {
    storageObject: StorageObject;
    downloadObject: () => Promise<void>;
    deleteObject: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => Promise<void>;
}

const FileInfo: React.FC<DialogProps<IProps>> = ({ payload, open, onClose }) => {
    const { storageObject, downloadObject, deleteObject } = payload;
    const theme = useTheme();

    return (
        <BootstrapDialog maxWidth='xl' open={open} onClose={() => onClose()}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>{storageObject.Key}</Typography>
                <IconButton onClick={() => onClose()}><Close /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ width: 640 }} dividers>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '80%', }}>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Created At"
                                secondary={moment(storageObject.CreatedAt).tz('Pacific/Auckland').format('HH:mm DD/MM/YY')}
                                primaryTypographyProps={{
                                    variant: 'subtitle2',
                                    textTransform: 'none',
                                    fontWeight: theme.typography.fontWeightBold,
                                    color: theme.palette.text.secondary
                                }}
                                secondaryTypographyProps={{
                                    variant: 'overline',
                                    textTransform: 'none',
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Last Modified"
                                secondary={moment(storageObject.LastModified).tz('Pacific/Auckland').format('HH:mm DD/MM/YY')}
                                primaryTypographyProps={{
                                    variant: 'subtitle2',
                                    textTransform: 'none',
                                    fontWeight: theme.typography.fontWeightBold,
                                    color: theme.palette.text.secondary
                                }}
                                secondaryTypographyProps={{
                                    variant: 'overline',
                                    textTransform: 'none',
                                }}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Type"
                                secondary={storageObject.ContentType}
                                primaryTypographyProps={{
                                    variant: 'subtitle2',
                                    textTransform: 'none',
                                    fontWeight: theme.typography.fontWeightBold,
                                    color: theme.palette.text.secondary
                                }}
                                secondaryTypographyProps={{
                                    variant: 'overline',
                                    textTransform: 'none',
                                }}
                            />
                        </ListItem>
                    </List>
                    <img src={`/file-icons/${storageObject.ContentType.split('/').pop()}.png`} alt='file-icon' width={128} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button color='primary' onClick={downloadObject}>Download</Button>
                <Button color='error' onClick={deleteObject}>Delete</Button>
            </DialogActions>
        </BootstrapDialog >
    )
}

export default FileInfo;
