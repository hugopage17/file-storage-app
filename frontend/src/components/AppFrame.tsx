import React from 'react';
import { Avatar, CssBaseline, Toolbar, Typography, Box, AppBar, Menu, MenuItem, IconButton, MenuList, Divider, useTheme } from '@mui/material';
import { signOut } from 'aws-amplify/auth';

interface IProps {
    children: React.ReactNode;
}

const AppFrame: React.FC<IProps> = ({ children }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const theme = useTheme()

    return (
        <Box>
            <CssBaseline />
            <AppBar component="nav" sx={{ p: 0 }} elevation={0} color='transparent'>
                <Toolbar variant="dense">
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
                        <img src="/logo/logo.png" alt="app-logo" width={32} />
                        <Typography fontWeight={theme.typography.fontWeightBold}>Cloud Storage</Typography>
                    </span>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}></Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}><Avatar sx={{ width: 24, height: 24 }} /></IconButton>
                    </Box>
                    <Menu
                        id="user-dropdown-menu"
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuList dense>
                            <MenuItem onClick={async () => await signOut()}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Toolbar>
                <Divider />
            </AppBar>

            {children}
        </Box>
    );
};

export default AppFrame;
