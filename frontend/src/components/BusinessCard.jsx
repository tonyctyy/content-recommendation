// components/BusinessCard.jsx
import React from 'react';
import {
  Box,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { AppCard } from '../components/shared/SharedComponents';

export default function BusinessCard({ business, score, model, isTest }) {
  return (
    <AppCard sx={{ minHeight: 250, height: '100%' }}>
      <CardContent>
        <Box sx={{ position: 'relative' }}>
          <Typography variant="h6" gutterBottom>
            {business.name}
          </Typography>

          {isTest && (
            <>
            <Typography variant="body2" color="text.secondary">
              {business.business_id}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>
                {model === 'ItemCF' ? 'Interest' : 'Similarity'} Score:
              </strong>{' '}
              {score.toFixed(4)}
            </Typography>
            </>
            )}

          <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
            {[...Array(5)].map((_, i) =>
              i < Math.floor(business.stars) ? (
                <StarIcon key={i} color="warning" fontSize="small" />
              ) : (
                <StarBorderIcon key={i} color="warning" fontSize="small" />
              )
            )}
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({business.review_count} reviews)
            </Typography>
          </Box>

          <Box sx={{ mt: 1 }}>
            {business.categories
              ?.slice(0, 5)
              .map((category, idx) => (
                <Chip
                  key={idx}
                  label={category}
                  size="small"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}

            {business.categories.length > 5 && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                +{business.categories.length - 5} more
              </Typography>
            )}
          </Box>
          
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Location:</strong> {business.city}, {business.state}
          </Typography>
        </Box>
      </CardContent>
    </AppCard>
  );
}