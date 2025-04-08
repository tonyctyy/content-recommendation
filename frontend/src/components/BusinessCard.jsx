// BusinessCard.jsx
import * as React from 'react';
import { Card, CardContent, Box, Typography, Divider, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Grid from '@mui/material/Grid';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  minHeight: 250, // Set a reasonable minimum height
  transition: 'transform 0.3s ease, min-height 0.3s ease', // Animate height changes
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  }
}));

function groupHours(hours) {
    // hours: object with keys as days and values as time strings.
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const groups = [];
    let currentGroup = null;
    if (typeof hours === 'string') {
        hours = JSON.parse(hours.replace(/'/g, '"'));
    }
    dayOrder.forEach(day => {
      const timeRaw = hours[day];
      if (!timeRaw) return;
      
      // Format time to ensure two-digit minutes:
      const [start, end] = timeRaw.split('-').map(t => {
        const [h, m] = t.split(':');
        return `${h}:${m.padEnd(2, '0')}`; // e.g., 11:0 becomes 11:00
      });
      const formattedTime = `${start} - ${end}`;
      
      if (currentGroup && currentGroup.time === formattedTime) {
        currentGroup.days.push(day.slice(0,3)); // Use short form, e.g., Mon
      } else {
        if (currentGroup) groups.push(currentGroup);
        currentGroup = { days: [day.slice(0,3)], time: formattedTime };
      }
    });
    if (currentGroup) groups.push(currentGroup);
    return groups;
  }


export default function BusinessCard({ business, score, model }) {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = () => setExpanded(prev => !prev);
  const sortedReviews = business.reviews?.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <StyledCard variant="outlined">
      <CardContent>
        <Box sx={{ position: 'relative' }}>
          <Box>
          <Grid container spacing={1}>
                <Grid item xs={10}>
                    <Typography variant="h6" gutterBottom>
                    {business.name}
                    </Typography>
                </Grid>
                <Grid item xs={2} container justifyContent="flex-end" alignItems="flex-start">
                    <IconButton 
                    onClick={toggleExpanded} 
                    size="small"
                    aria-label={expanded ? "Collapse details" : "Expand details"}
                    >
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                </Grid>
            </Grid>

            <Typography variant="body2" color="text.secondary">
              {business.business_id}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>{model === 'ItemCF' ? 'Interest' : 'Similarity'} Score:</strong> {score.toFixed(4)}
            </Typography>
            <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
              {[...Array(5)].map((_, i) =>
                i < Math.floor(business.stars) ? 
                  <StarIcon key={i} color="warning" fontSize="small" /> : 
                  <StarBorderIcon key={i} color="warning" fontSize="small" />
              )}
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({business.review_count} reviews)
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
                {business.categories && business.categories.slice(0, expanded ? business.categories.length : 5).map((category, index) => (
                    <Chip 
                    key={index} 
                    label={category} 
                    size="small" 
                    sx={{ mr: 0.5, mb: 0.5 }} 
                    />
                ))}
                {!expanded && business.categories.length > 5 && (
                    <Typography variant="caption" sx={{ ml: 1 }}>
                    +{business.categories.length - 5} more
                    </Typography>
                )}
            </Box>
          </Box>
        </Box>
        
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ width: '100%' }} />

            <Typography variant="body2">
              <strong>Address:</strong> {business.address}, {business.city}, {business.state}, {business.postal_code}
            </Typography>

            {business.hours && (
            <>
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                <strong>Hours:</strong>
                </Typography>
                <Grid container spacing={1}>
                {groupHours(business.hours).map((group, index) => {
                    // If more than one day in the group, display e.g., "Mon to Wed"
                    const dayDisplay = group.days.length > 1 ? `${group.days[0]} to ${group.days[group.days.length - 1]}` : group.days[0];
                    return (
                    <React.Fragment key={index}>
                        <Grid item xs={6}>
                        <Typography variant="body2">{dayDisplay}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <Typography variant="body2">{group.time}</Typography>
                        </Grid>
                    </React.Fragment>
                    );
                })}
                </Grid>
            </>
            )}

            {sortedReviews && sortedReviews.length > 0 && (
            <>
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                <strong>Reviews:</strong>
                </Typography>
                {sortedReviews.slice(0, 3).map((review, index) => (
                <Box key={index} sx={{ ml: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) =>
                        i < Math.floor(review.stars) ? 
                          <StarIcon key={i} color="warning" fontSize="small" sx={{ width: 16, height: 16 }} /> : 
                          <StarBorderIcon key={i} color="warning" fontSize="small" sx={{ width: 16, height: 16 }} />
                      )}
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {review.text.length > 150 ? `${review.text.substring(0, 150)}...` : review.text}
                    </Typography>                </Box>
                ))}
                {sortedReviews.length > 3 && (
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                    +{sortedReviews.length - 3} more reviews
                </Typography>
                )}
            </>
            )}
            {/* {business.reviews && business.reviews.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                  <strong>Reviews:</strong>
                </Typography>
                {business.reviews.slice(0, 3).map((review, index) => (
                  <Box key={index} sx={{ ml: 2, mb: 1 }}>

                  </Box>
                ))}
                {business.reviews.length > 3 && (
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                    +{business.reviews.length - 3} more reviews
                  </Typography>
                )}
              </>
            )} */}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}
