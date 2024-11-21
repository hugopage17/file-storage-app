import React from 'react';
import { styled, LinearProgress, Divider, Link, Toolbar, Breadcrumbs, Button, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useDialogs } from '@toolpad/core/useDialogs';
import ReplayIcon from '@mui/icons-material/Replay';
import { useOutletContext } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import StorageObjectDisplay from './storage-object/StorageObjectDisplay';
import UploadFileContent from './dialogs/UploadFileDialog';
import StorageObjectService from '../services/storage-object.service';

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
    const { filePaths } = useOutletContext<{ filePaths: string[], setFilePaths: any }>();
    const dialogs = useDialogs();

    const navigateBreadCrums = (index: number) => filePaths.slice(0, index + 1).join('/');

    const openFileUpload = async () => {
        await dialogs.open(UploadFileContent, {
            onConfirm: () => null,
            onDrop: async (files: File[]) => await StorageObjectService.processFileOnDrop(files, filePaths),
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
