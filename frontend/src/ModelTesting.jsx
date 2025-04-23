// ModelTesting.jsx - Main component
import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Container,
  CssBaseline,
  Typography,
  CircularProgress,
} from '@mui/material';

import AppTheme from './shared-theme/AppTheme';
import AppAppBar from './components/AppAppBar';
import RecommendationForm from './components/RecommendationForm';
import UserInfoCard from './components/UserInfoCard';
import BusinessCardList from './components/BusinessCardList';
import Footer from './components/Footer';

export default function ModelTesting() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!results) return;

    const categoryCounts = {};
    const recommendations = results.recommendations.slice(0, 100);
    const ignore = ['Restaurants', 'Food'];

    recommendations.forEach(([businessId]) => {
      const business = results.businesses[businessId];
      business.categories.forEach((cat) => {
        if (!ignore.includes(cat)) {
          categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        }
      });
    });

    const sorted = Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 25)
      .map(([category, count]) => ({ category, count }));

    setTopCategories(sorted);
  }, [results]);

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
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 3,
            }}
          >
            {/* Left Column: Query & Profile */}
            <Box
              sx={{
                width: { xs: '100%', md: '25%' },
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <RecommendationForm
                API_BASE_URL={API_BASE_URL}
                setResults={setResults}
                setLoading={setLoading}
              />

              {results?.user && <UserInfoCard user={results.user} />}
            </Box>

            {/* Right Column: Summary & Recommendations */}
            <Box
              sx={{
                width: { xs: '100%', md: '75%' },
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {topCategories.length > 0 && (
                <>
                  <Typography variant="h6" sx={{ mb: -1 }}>
                    Top Categories:
                  </Typography>
                  <Box sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        flexWrap: 'wrap',
                        overflowX: 'auto',
                        pb: 1,
                      }}
                    >
                      {topCategories.map(({ category, count }) => (
                        <Chip
                          key={category}
                          label={`${category} (${count})`}
                          variant="outlined"
                          size="medium"
                          sx={{ bgcolor: 'action.hover' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {loading ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : results?.recommendations?.length > 0 ? (
                <BusinessCardList
                  recommendations={results.recommendations}
                  businesses={results.businesses}
                  model="Model"
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography variant="body1">
                    No recommendations found.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>

      <Footer />
    </AppTheme>
  );
}
