import React from 'react';
import { Avatar, ButtonGroup, CssBaseline, styled, LinearProgress, Divider, Link, Toolbar, Typography, Breadcrumbs, Button, Box, AppBar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { useLocation } from 'react-router-dom';
import StorageObjectDisplay from './storage-object/StorageObjectDisplay';

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

const ToolbarButton = styled(Button)(() => ({
    textTransform: 'none',
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
        color: theme.palette.info.light,
    },
}));

const AppFrame: React.FC = () => {
    const [filePaths, setFilePaths] = React.useState<string[]>([]);

    const location = useLocation();

    React.useEffect(() => setFilePaths(location.pathname.split('/').filter((path) => path !== '')), [location]);

    const navigateBreadCrums = (index: number) => filePaths.slice(0, index + 1).join('/');

    return (
        <Box>
            <CssBaseline />
            <AppBar component="nav" sx={{ p: 0 }}>
                <Toolbar variant="dense">
                    <img src="/logo/logo.png" alt="app-logo" width={32} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Avatar />
                    </Box>
                </Toolbar>
            </AppBar>
            <FileListPanel>
                <Toolbar />
                <PanelToolbar>
                    <Breadcrumbs aria-label="breadcrumb">
                        <BreadcrumbLink underline="hover" color="inherit" href="/">
                            <HomeIcon sx={{ mr: 0.5, fontSize: '20px' }} fontSize="inherit" />
                        </BreadcrumbLink>
                        {filePaths.map((path, index) => (
                            <BreadcrumbLink underline="none" color="info" href={`/${navigateBreadCrums(index)}`} key={`breadcrumb-path-${index}`}>
                                {path}
                            </BreadcrumbLink>
                        ))}
                    </Breadcrumbs>
                    <ButtonGroup variant="contained">
                        <ToolbarButton startIcon={<FileUploadIcon />}>Upload File</ToolbarButton>
                        <ToolbarButton startIcon={<CreateNewFolderIcon />}>Create Folder</ToolbarButton>
                    </ButtonGroup>
                </PanelToolbar>
                <Divider />
                <React.Suspense fallback={<LinearProgress color="secondary" />}>
                    <StorageObjectDisplay path={location.pathname} />
                </React.Suspense>
            </FileListPanel>
        </Box>
    );
};

export default AppFrame;
