import * as React from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Reuse a card style similar to the business card but without forcing full height
const StyledUserCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  // Removed height: '100%' so that the card adjusts to its content.
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  }
}));

// Helper function to compute membership duration
const getMembershipDuration = (joinDate) => {
  if (!joinDate) return 'N/A';
  const join = new Date(joinDate);
  const now = new Date();
  let years = now.getFullYear() - join.getFullYear();
  let months = now.getMonth() - join.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return `${years} yrs ${months} mos`;
};

export default function UserInfoCard({ user }) {
  return (
    <StyledUserCard sx={{ width: '100%', textAlign: 'center', p: 2 }}>
      <CardContent>
        {/* Centered Name & User ID */}
        <Typography variant="h5" fontWeight="bold">
          {user.name || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'gray' }}>
          {user.user_id || 'N/A'}
        </Typography>

        {/* User Details: Each row as its own grid container */}
        <Grid container spacing={2} sx={{ mt: 2, textAlign: 'left' }}>
          {/* Row for Average Rating */}
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2">
                <strong>Average Rating:</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography variant="body2">
                    {user.average_stars !== null ? `${user.average_stars.toFixed(2)} ★` : 'N/A'}
                </Typography>
                {user.review_count && (
                    <Typography variant="caption" sx={{ ml: 1 }}>
                    ({user.review_count} reviews)
                    </Typography>
                )}
            </Box>
            </Grid>
          </Grid>
          {/* Row for Member Since */}
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2">
                <strong>Member Since:</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>

              <Typography variant="body2">
                {user.yelping_since ? new Date(user.yelping_since).toLocaleDateString() : 'N/A'}
              </Typography>
              {user.yelping_since && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  ({getMembershipDuration(user.yelping_since)})
                </Typography>
              )}
            </Box>

            </Grid>
          </Grid>
          {/* Row for Fans */}
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2">
                <strong>Fans:</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body2">
                {user.fans !== null ? user.fans : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Votes Section */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Votes:</strong>
        </Typography>
        <Grid container spacing={2} sx={{ textAlign: 'center' }}>
          <Grid item xs={4}>
            <Typography variant="body2">Useful</Typography>
            <Chip label={user.useful || 0} size="small" sx={{ mt: 0.5 }} />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">Funny</Typography>
            <Chip label={user.funny || 0} size="small" sx={{ mt: 0.5 }} />
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2">Cool</Typography>
            <Chip label={user.cool || 0} size="small" sx={{ mt: 0.5 }} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Compliments Section */}
        {user.compliments && Object.keys(user.compliments).length > 0 && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Compliments:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
              {Object.entries(user.compliments).map(([key, value]) => 
                value > 0 ? (
                  <Chip 
                    key={key} 
                    label={`${key}: ${value}`} 
                    size="small" 
                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} 
                  />
                ) : null
              )}
            </Box>
          </>
        )}
      </CardContent>
    </StyledUserCard>
  );
}
