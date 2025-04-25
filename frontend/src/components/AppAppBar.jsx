// components/AppAppBar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Axios from 'axios';
import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import SitemarkIcon from './SitemarkIcon';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Styled Toolbar
const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  textTransform: 'none',
  margin: theme.spacing(0, 1),
  ...(active && {
    color: '#282f3d',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: alpha('#282f3d', theme.palette.action.hoverOpacity),
    },
  }),
}));

export default function AppAppBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const [userData, setUserData] = useState(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [inputUserId, setInputUserId] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (raw) {
      try {
        setUserData(JSON.parse(raw));
      } catch {}
    }
  }, []);

  const openSignIn = () => setSignInOpen(true);
  const closeSignIn = () => {
    setSignInOpen(false);
    setInputUserId('');
    setNotFound(false);
  };

  const submitSignIn = async () => {
    try {
      const response = await Axios.post(`${API_BASE_URL}/user_info`, {
        user_id: inputUserId,
      });
      const data = response.data;
      if (data?.[inputUserId]) {
        const user = { ...data[inputUserId], visitor: false };
        localStorage.setItem('userData', JSON.stringify(user));
        setUserData(user);
        closeSignIn();
        window.location.reload();
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleVisitor = () => {
    const visitorData = {
      user_id: 'visitor',
      visitor: true,
      name: 'Visitor',
      categories: [],
    };
    localStorage.setItem('userData', JSON.stringify(visitorData));
    setUserData(visitorData);
    window.location.reload();
  };

  return (
    <>
      <AppBar
        position="fixed"
        enableColorOnDark
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 'calc(var(--template-frame-height, 0px) + 28px)',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ px: '7.5%', py: 0 }}>
          <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <SitemarkIcon />
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <NavButton
                  component={Link}
                  to="/"
                  size="small"
                  color="info"
                  active={isActive('/')}
                >
                  Home
                </NavButton>
                <NavButton
                  component={Link}
                  to="/model_testing"
                  size="small"
                  color="info"
                  active={isActive('/model_testing')}
                >
                  Model Testing
                </NavButton>
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
              }}
            >
              {userData ? (
                <>
                  <Typography variant="body2" color="#282f3d">
                    {userData.name}
                  </Typography>
                  <Button variant="text" size="small" onClick={openSignIn}>
                    Switch Account
                  </Button>
                </>
              ) : (
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  onClick={openSignIn}
                >
                  Sign in
                </Button>
              )}

              <Button
                color="primary"
                variant="contained"
                size="small"
                onClick={handleVisitor}
              >
                Visitor
              </Button>

              <ColorModeIconDropdown />
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>

      <Dialog open={signInOpen} onClose={closeSignIn}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="User ID"
            fullWidth
            variant="standard"
            value={inputUserId}
            onChange={(e) => setInputUserId(e.target.value)}
          />
          {notFound && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              User ID not found. Please try again.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSignIn}>Cancel</Button>
          <Button onClick={submitSignIn} disabled={!inputUserId.trim()}>
            Sign-in
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
