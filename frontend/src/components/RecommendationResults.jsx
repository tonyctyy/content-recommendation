// RecommendationResults.jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { styled } from '@mui/material/styles';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  height: '100%',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  }
}));

const UserCard = styled(Card)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: theme.shadows[2],
  marginBottom: theme.spacing(4),
}));

function BusinessCard({ business, score, model }) {
  const [expanded, setExpanded] = React.useState(false);
  
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  return (
    <StyledCard variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" gutterBottom>{business.name}</Typography>
            <Typography variant="body2" color="text.secondary">ID: {business.business_id}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>{model === 'ItemCF' ? 'Interest' : 'Similarity'} Score:</strong> {score.toFixed(4)}
            </Typography>
            <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
              {[...Array(5)].map((_, i) => (
                i < Math.floor(business.stars) ? 
                  <StarIcon key={i} color="warning" fontSize="small" /> : 
                  <StarBorderIcon key={i} color="warning" fontSize="small" />
              ))}
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({business.review_count} reviews)
              </Typography>
            </Box>
            <Box sx={{ mt: 1 }}>
              {business.categories && business.categories.map((category, index) => (
                <Chip 
                  key={index} 
                  label={category} 
                  size="small" 
                  sx={{ mr: 0.5, mb: 0.5 }} 
                />
              ))}
            </Box>
          </Box>
        </Box>
        
        {expanded && (
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2">
              <strong>Address:</strong> {business.address}, {business.city}, {business.state}, {business.postal_code}
            </Typography>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Hours:</strong>
            </Typography>
            {business.hours && formatHours(business.hours).map((hour, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                {hour}
              </Typography>
            ))}
            
            {business.reviews && business.reviews.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                  <strong>Reviews:</strong>
                </Typography>
                {business.reviews.slice(0, 3).map((review, index) => (
                  <Box key={index} sx={{ ml: 2, mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(review.stars) ? 
                          <StarIcon key={i} color="warning" fontSize="small" sx={{ width: 16, height: 16 }} /> : 
                          <StarBorderIcon key={i} color="warning" fontSize="small" sx={{ width: 16, height: 16 }} />
                      ))}
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {review.text.length > 150 ? `${review.text.substring(0, 150)}...` : review.text}
                    </Typography>
                  </Box>
                ))}
                {business.reviews.length > 3 && (
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right' }}>
                    +{business.reviews.length - 3} more reviews
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}
      </CardContent>
    </StyledCard>
  );
}

export default function RecommendationResults({ results, loading }) {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!results) return null;
  
  const { user, recommendations, businesses, model } = results;
  
  return (
    <Box sx={{ width: '100%' }}>
      <UserInfoCard user={user} />
      
      <Typography variant="h4" gutterBottom>
        Recommended Businesses
      </Typography>
      
      {recommendations.length > 0 ? (
        <>
          <Typography variant="body2" sx={{ mb: 4 }}>
            Total recommendations: {recommendations.length}
          </Typography>
          
          <Grid container spacing={3}>
            {recommendations.map((item, index) => {
              const businessId = item[0];
              const score = item[1];
              const business = businesses[businessId];
              
              return (
                <Grid item xs={12} md={6} lg={4} key={businessId}>
                  <BusinessCard business={business} score={score} model={model} />
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <Typography variant="body1">No recommendations found.</Typography>
      )}
    </Box>
  );
}

// Helper function to format hours for display
function formatHours(hours) {
  try {
    if (typeof hours === 'string') {
      hours = JSON.parse(hours.replace(/'/g, '"'));
    }
    
    return Object.entries(hours).map(([day, time]) => `${day}: ${time}`);
  } catch (e) {
    return ['Hours not available'];
  }
}

export { BusinessCard };