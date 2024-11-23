import React from 'react';
import { styled, Toolbar, Box, List, ListItemText, Drawer, Button, Menu, ListItem, ButtonGroup } from '@mui/material';
import { useDialogs } from '@toolpad/core/useDialogs';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import ListItemButton from '@mui/material/ListItemButton';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useNavigate } from 'react-router-dom';
import CreateFolder from './menus/CreateFolder';
import { IUploadParams } from '../types';
import { apiService } from '../services/api.service';
import UploadFileContent from './dialogs/UploadFileDialog';
import StorageObjectService from '../services/storage-object.service';
import AppContext from '../AppContext';

const DrawerListItem = styled(ListItemButton)(({ theme }) => ({
    borderRadius: 100,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}))

interface IProps {
    filePaths: string[];
};

const AppDrawer: React.FC<IProps> = ({ filePaths }) => {
    const navigate = useNavigate();
    const dialogs = useDialogs();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [createFolderAnchor, setCreateFolderAnchor] = React.useState<null | HTMLElement>(null);
    const [isUploading, toggleUploadState] = React.useState<boolean>(false);

    const { darkMode } = React.useContext(AppContext);

    const anchorRef = React.useRef<HTMLDivElement>(null);

    const drawerLinks = [
        {
            name: 'Home',
            path: 'storage',
            icon: <HomeOutlinedIcon />
        },
        {
            name: 'Starred',
            path: 'starred',
            icon: <StarOutlineOutlinedIcon />
        },
        {
            name: 'Shared with me',
            path: 'shared',
            icon: <FolderSharedOutlinedIcon />
        },
        {
            name: 'Trash',
            path: 'trash',
            icon: <DeleteOutlineOutlinedIcon />
        }
    ];

    const openCreateFolderMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCreateFolderAnchor(event.currentTarget)
    }

    const createStorageObject = async (uploadParams: IUploadParams) => {
        try {
            toggleUploadState(true);
            if (uploadParams.isFolder) {
                if (uploadParams.fileName.includes(' ')) {
                    throw new Error('Folders cannot contact spaces');
                }
            }
            await apiService.upload(uploadParams);
            window.location.reload();
        } finally {
            toggleUploadState(false);
        }
    };

    const openFileUpload = async () => {
        await dialogs.open(UploadFileContent, {
            onConfirm: () => null,
            onDrop: async (files: File[]) => await StorageObjectService.processFileOnDrop(files, filePaths),
        });
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <ButtonGroup variant={darkMode ? 'outlined' : 'contained'} ref={anchorRef}>
                        <Button
                            size="small"
                            onClick={openFileUpload}
                            startIcon={<FileUploadIcon />}
                        >
                            Upload File
                        </Button>
                        <Button
                            size="small"
                            onClick={(event) => setAnchorEl(event.currentTarget)}
                            aria-haspopup="menu"
                        >
                            <ArrowDropDownOutlinedIcon />
                        </Button>
                    </ButtonGroup>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <ListItem>
                            <Button variant="text" startIcon={<CreateNewFolderIcon />} onClick={openCreateFolderMenu}>
                                Create Folder
                            </Button>
                            <CreateFolder
                                onClose={() => setCreateFolderAnchor(null)}
                                anchorEl={createFolderAnchor}
                                currentDirectory={filePaths.join('/')}
                                handleCreateFolder={createStorageObject}
                                isUploading={isUploading}
                            />
                        </ListItem>
                    </Menu>
                </Box>
                <List component="nav" sx={{ padding: 2 }}>
                    {drawerLinks.map((linkItem) => (
                        <DrawerListItem
                            key={`drawer-link-item-${linkItem.name.toLowerCase()}`}
                            selected={linkItem.path === location.pathname.split('/')[1]}
                            onClick={() => navigate(`/${linkItem.path}`)}
                        >
                            <ListItemIcon>
                                {linkItem.icon}
                            </ListItemIcon>
                            <ListItemText primaryTypographyProps={{ fontSize: '14px' }} primary={linkItem.name} />
                        </DrawerListItem>
                    ))}

                </List>
            </Box>
        </Drawer>
    )
};

export default AppDrawer;
