import React from 'react';
import { styled, LinearProgress, Divider, Link, Toolbar, Breadcrumbs, Button, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useDialogs } from '@toolpad/core/useDialogs';
import ReplayIcon from '@mui/icons-material/Replay';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import StorageObjectDisplay from './storage-object/StorageObjectDisplay';
import UploadFileContent from './dialogs/UploadFileDialog';
import { apiService } from '../services/api.service';
import CreateFolder from './menus/CreateFolder';
import { IUploadParams } from '../types';

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

const BreadcrumbLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        color: theme.palette.info.light,
    },
}));

const ErrorDisplay = () => {
    return (
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '40px' }}>
            <img src="/error.png" alt="error-logo" width={256} />
            <Typography variant="subtitle1" sx={{ textTransform: 'none', marginTop: '12px' }}>
                Oops, something went wrong trying to access storage
            </Typography>
            <Button color="info" onClick={() => window.location.reload()} endIcon={<ReplayIcon />}>
                Reload
            </Button>
        </Box>
    );
};

const CurrentDirectory: React.FC = () => {
    const [filePaths, setFilePaths] = React.useState<string[]>([]);
    const [createFolderAnchor, setCreateFolderAnchor] = React.useState<null | HTMLElement>(null);

    const location = useLocation();
    const dialogs = useDialogs();

    React.useEffect(
        () =>
            setFilePaths(
                location.pathname
                    .replace(/%20/g, ' ')
                    .split('/')
                    .filter((path) => !['', 'storage'].includes(path))
            ),
        [location]
    );

    const navigateBreadCrums = (index: number) => filePaths.slice(0, index + 1).join('/');

    const [isUploading, toggleUploadState] = React.useState<boolean>(false);

    const createStorageObject = async (uploadParams: IUploadParams) => {
        console.log(uploadParams);
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

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];

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
                            fileName: location.pathname === '/' ? decodeURIComponent(file.name) : decodeURIComponent(`${filePaths.join('/')}/${file.name}`),
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
            onConfirm: () => null,
            onDrop,
        });
    };

    return (
        <FileListPanel>
            <Toolbar />
            <PanelToolbar>
                <Breadcrumbs aria-label="breadcrumb">
                    <BreadcrumbLink underline="hover" color="inherit" href="/storage">
                        <HomeIcon sx={{ mr: 0.5, fontSize: '24px' }} fontSize="inherit" />
                    </BreadcrumbLink>
                    {filePaths.map((path, index) => (
                        <BreadcrumbLink underline="none" color="info" href={`/storage/${navigateBreadCrums(index)}`} key={`breadcrumb-path-${index}`}>
                            {path}
                        </BreadcrumbLink>
                    ))}
                </Breadcrumbs>
                <Box sx={{ display: 'flex', gap: '8px' }}>
                    <Button size="small" variant="contained" startIcon={<FileUploadIcon />} onClick={openFileUpload}>
                        Upload File
                    </Button>
                    <Button variant="text" onClick={(event) => setCreateFolderAnchor(event.currentTarget)} startIcon={<CreateNewFolderIcon />}>
                        Create Folder
                    </Button>
                    <CreateFolder onClose={() => setCreateFolderAnchor(null)} anchorEl={createFolderAnchor} currentDirectory={filePaths.join('/')} handleCreateFolder={createStorageObject} isUploading={isUploading} />
                </Box>
            </PanelToolbar>
            <Divider />
            <React.Suspense fallback={<LinearProgress color="secondary" />}>
                <ErrorBoundary fallback={<ErrorDisplay />}>
                    <StorageObjectDisplay upload={openFileUpload} path={`/${filePaths.join('/')}`} />
                </ErrorBoundary>
            </React.Suspense>
        </FileListPanel>
    );
};

export default CurrentDirectory;
