// HomePage.jsx - Main component
import React, { useState, useEffect } from 'react';
import { CssBaseline, Container, Typography } from '@mui/material';

import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import ClusterRecommendations from './components/ClusterRecommendations';
import FinalRecommendation from './components/FinalRecommendation';
import Footer from './components/Footer';

export default function HomePage() {
  const [userData, setUserData] = useState(null);
  const k = 100;
  const personalThreshold = 25; // Minimum reviews to show personal recommendations
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (raw) {
      try {
        setUserData(JSON.parse(raw));
      } catch {}
    }
  }, []);

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        component="main"
        disableGutters
        maxWidth={false}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          my: 10,
          px: '7.5%',
          gap: 4,
        }}
      >
        {userData && (
          <Typography variant="h3" sx={{ mt: 4, mb: -1 }} color="text.primary">
            Hello, {userData.name}!
          </Typography>
        )}

        {/* Section 1: Personal Recommendation */}
        {userData && !userData.visitor && userData.review_count >= personalThreshold &&(
          <>
          <Typography variant="h4" sx={{ mb: -4 }} color="text.primary">
            Your Personal Recommendations
          </Typography>
          <FinalRecommendation
            userData={userData}
            API_BASE_URL={API_BASE_URL}
            model = "DeepFM"
            k={k}
          />
          </>

        )}

        {/* Section 2: Cluster Popular */}
        {userData && (
          <ClusterRecommendations
            userData={userData}
            API_BASE_URL={API_BASE_URL}
            k={k}
          />
        )}

        {/* Section 3: Recently Popular */}
        {userData && (
          <>
          <Typography variant="h4" sx={{ mb: -4 }} color="text.primary">
            What's Popular Now
          </Typography>
          <FinalRecommendation
            userData={userData}
            API_BASE_URL={API_BASE_URL}
            model = "Popular"
            k={k}
          />
          </>
        )}
      </Container>
      <Footer />
    </AppTheme>
  );
}
