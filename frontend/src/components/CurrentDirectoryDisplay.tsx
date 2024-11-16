import React from 'react';
import { styled, LinearProgress, Divider, Link, Toolbar, Breadcrumbs, Button, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useDialogs } from '@toolpad/core/useDialogs';
import { useLocation } from 'react-router-dom';
import StorageObjectDisplay from './storage-object/StorageObjectDisplay';
import AppFrame from './AppFrame';
import UploadFileContent from './dialogs/UploadFileDialog';
import { apiService } from '../services/api.service';
import CreateFolder from './menus/CreateFolder';

const FileListPanel = styled(Box)(({ theme }) => ({
    paddingLeft: theme.spacing(16),
    paddingRight: theme.spacing(16),
    paddingTop: theme.spacing(4),
}));

const PanelToolbar = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

const StyledButton = styled(Button)(() => ({
    textTransform: 'none',
    '&:focus': {
        outline: 'none',
        boxShadow: 'none',
    },
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        color: theme.palette.info.light,
    },
}));

const CurrentDirectory: React.FC = () => {
    const [filePaths, setFilePaths] = React.useState<string[]>([]);
    const [createFolderAnchor, setCreateFolderAnchor] = React.useState<null | HTMLElement>(null);

    const location = useLocation();
    const dialogs = useDialogs();

    React.useEffect(() => setFilePaths(location.pathname.replace(/%20/g, ' ').split('/').filter((path) => path !== '')), [location]);

    const navigateBreadCrums = (index: number) => filePaths.slice(0, index + 1).join('/');

    const [isUploading, toggleUploadState] = React.useState<boolean>(false);

    const createStorageObject = async (uploadParams: any) => {
        try {
            toggleUploadState(true);
            await apiService.upload(uploadParams);
        } catch (error) {
            console.error(error);
        } finally {
            toggleUploadState(false);
        }

    }

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            console.log(file)

            const reader = new FileReader();
            const fileType = file.type;
            let contentEncoding: string | undefined;

            await new Promise((resolve, reject) => {
                reader.onload = async () => {
                    try {
                        if (fileType.startsWith('image/') || fileType === 'application/pdf') {
                            contentEncoding = 'base64';
                        }

                        await createStorageObject({
                            fileData: reader.result,
                            fileName: location.pathname === '/' ? file.name : `${location.pathname.slice(1)}/${file.name}`,
                            contentType: fileType,
                            contentEncoding,
                        });

                        resolve('File uploaded successfully');
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = () => {
                    reject(new Error('Error reading the file.'));
                };

                if (fileType.startsWith('text/') || fileType.endsWith('json')) {
                    reader.readAsText(file);
                } else if (fileType.startsWith('image/') || fileType === 'application/pdf') {
                    reader.readAsDataURL(file);
                } else {
                    reject(new Error('Unsupported file type'));
                }
            });

            reader.onerror = () => {
                console.error('Failed to read file!');
            };
        }
    };

    const openFileUpload = async () => {
        await dialogs.open(UploadFileContent, {
            onConfirm: () => {
                window.location.reload()
            },
            onDrop
        });
    };

    return (
        <AppFrame>
            <FileListPanel>
                <Toolbar />
                <PanelToolbar>
                    <Breadcrumbs aria-label="breadcrumb">
                        <BreadcrumbLink underline="hover" color="inherit" href="/">
                            <HomeIcon sx={{ mr: 0.5, fontSize: '24px' }} fontSize="inherit" />
                        </BreadcrumbLink>
                        {filePaths.map((path, index) => (
                            <BreadcrumbLink underline="none" color="info" href={`/${navigateBreadCrums(index)}`} key={`breadcrumb-path-${index}`}>
                                {path}
                            </BreadcrumbLink>
                        ))}
                    </Breadcrumbs>
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                        <StyledButton size='small' variant="contained" startIcon={<FileUploadIcon />} onClick={openFileUpload}>Upload File</StyledButton>
                        <StyledButton variant="text" onClick={(event) => setCreateFolderAnchor(event.currentTarget)} startIcon={<CreateNewFolderIcon />}>Create Folder</StyledButton>
                        <CreateFolder onClose={() => setCreateFolderAnchor(null)} anchorEl={createFolderAnchor} currentDirectory={filePaths.join('/')} handleCreateFolder={createStorageObject} isUploading={isUploading} />
                    </Box>
                </PanelToolbar>
                <Divider />
                <React.Suspense fallback={<LinearProgress color="secondary" />}>
                    <StorageObjectDisplay upload={openFileUpload} path={location.pathname} />
                </React.Suspense>
            </FileListPanel>
        </AppFrame>
    );
};

export default CurrentDirectory;