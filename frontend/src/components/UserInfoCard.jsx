// components/UserInfoCard.jsx
import React from 'react';
import {
  Box,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import { AppCard } from '../components/shared/SharedComponents';

// Helper to compute membership duration
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
    <AppCard sx={{ width: '100%', textAlign: 'center' }}>
      <CardContent sx={{ p: 2 }}>
        {/* Name & ID */}
        <Typography variant="h5" fontWeight="bold">
          {user.name || 'N/A'}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
        >
          {user.user_id || 'N/A'}
        </Typography>

        {/* Ratings, Join Date, Fans */}
        <Grid container spacing={2} sx={{ mt: 2, textAlign: 'left' }}>
          {/* Average Rating */}
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2">
                <strong>Average Rating:</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography variant="body2">
                  {user.average_stars != null
                    ? `${user.average_stars.toFixed(2)} ★`
                    : 'N/A'}
                </Typography>
                {user.review_count != null && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    ({user.review_count} reviews)
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Member Since */}
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2">
                <strong>Member Since:</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Typography variant="body2">
                  {user.yelping_since
                    ? new Date(user.yelping_since).toLocaleDateString()
                    : 'N/A'}
                </Typography>
                {user.yelping_since && (
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    ({getMembershipDuration(user.yelping_since)})
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Fans */}
          <Grid container item xs={12} spacing={1} alignItems="center">
            <Grid item xs={5}>
              <Typography variant="body2">
                <strong>Fans:</strong>
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body2">
                {user.fans != null ? user.fans : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Interested Categories */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Interested Categories:</strong>
        </Typography>
        {user.categories?.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {user.categories.map((category, idx) => (
              <Chip
                key={idx}
                label={category}
                size="small"
                sx={{ backgroundColor: 'theme.palette.action.hover' }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center', mt: 1 }}>
            No categories available.
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Votes */}
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

        {/* Compliments */}
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
                    sx={{ backgroundColor: 'theme.palette.action.hover' }}
                  />
                ) : null
              )}
            </Box>
          </>
        )}
      </CardContent>
    </AppCard>
  );
}
