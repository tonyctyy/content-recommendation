// TestLayout.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RecommendationForm from './RecommendationForm';
import UserInfoCard from './UserInfoCard';
import SearchSummary from './SearchSummary';
import BusinessCardList from './BusinessCardList';

export default function TestLayout({ results, setResults, setLoading, loading }) {
  const { user, recommendations, businesses, model } = results || {};

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Left Column (Query Bar & User Profile) */}
        <Box
          sx={{
            width: '25%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
          }}
        >
          <RecommendationForm setResults={setResults} setLoading={setLoading} />
          {user && <UserInfoCard user={user} />}
        </Box>

        {/* Right Column (Search Summary & Recommended Businesses) */}
        <Box
          sx={{
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
          }}
        >
          <SearchSummary />
          {loading ? (
            <Typography variant="body1">Loading recommendations...</Typography>
          ) : recommendations && recommendations.length > 0 ? (
            <BusinessCardList 
              recommendations={recommendations} 
              businesses={businesses} 
              model={model} 
            />
          ) : (
            <Typography variant="body1">No recommendations found.</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
