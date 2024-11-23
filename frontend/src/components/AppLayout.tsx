import React from 'react';
import { fetchAuthSession, JWT } from 'aws-amplify/auth';
import { Avatar, CssBaseline, Toolbar, Typography, Box, AppBar, Menu, ListItem, List, IconButton, ListItemText, Divider, useTheme, Switch } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import { signOut } from 'aws-amplify/auth';
import { Outlet, useLocation } from 'react-router-dom';
import AppContext from '../AppContext';
import AppDrawer from './AppDrawer';

const AppLayout: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const theme = useTheme();
    const location = useLocation();

    const [user, setUser] = React.useState<JWT['payload'] | undefined>();

    const { darkMode, toggleDarkMode, toggleDisplayView, displayView } = React.useContext(AppContext);

    const [filePaths, setFilePaths] = React.useState<string[]>([]);

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

    React.useEffect(() => {
        fetchAuthSession().then((user) => {
            if (user.tokens?.idToken?.payload) {
                setUser(user.tokens?.idToken?.payload);
            }
        });
    }, []);

    const handleDisplayView = (_: React.MouseEvent<HTMLElement>, newAlignment: string) => {
        toggleDisplayView(newAlignment);
        localStorage.setItem('view_mode', newAlignment);
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem('dark_mode', `${event.target.checked}`);
        toggleDarkMode(event.target.checked);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, p: 0, backgroundColor: darkMode ? '#181A1B' : 'white' }} elevation={0}>
                <Toolbar variant="dense">
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                        <img src="/logo/logo.png" alt="app-logo" width={32} />
                        <Typography sx={{ color: darkMode ? 'white' : '#303030' }} fontWeight={theme.typography.fontWeightBold}>Cloud Storage</Typography>
                    </span>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                            <Avatar sx={{ width: 24, height: 24 }} />
                        </IconButton>
                    </Box>
                    <Menu id="user-dropdown-menu" anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="Account" secondary={user?.email?.toString()} />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText primary="Dark Mode" />
                                <Switch checked={darkMode} onChange={handleThemeChange} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Layout" />
                                <ToggleButtonGroup value={displayView} exclusive onChange={handleDisplayView} aria-label="handle-display-view" size="small">
                                    <ToggleButton color="primary" value="tile" aria-label="tile aligned">
                                        <GridViewIcon />
                                    </ToggleButton>
                                    <ToggleButton color="primary" value="list" aria-label="list aligned">
                                        <ListIcon />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </ListItem>
                            <Divider />
                            <ListItem
                                onClick={async () => await signOut()}
                                secondaryAction={
                                    <IconButton edge="end" aria-label="comments">
                                        <LogoutIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary="Logout" />
                            </ListItem>
                        </List>
                    </Menu>
                </Toolbar>
                <Divider />
            </AppBar>
            <AppDrawer filePaths={filePaths} />
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet context={{ filePaths }} />
            </Box>
        </Box>
    );
};

export default AppLayout;
