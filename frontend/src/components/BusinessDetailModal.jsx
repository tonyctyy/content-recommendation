// components/BusinessDetailModal.jsx
import React from 'react';
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Paper,
  Chip,
  Grid,
  Divider,
  Button
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Close as CloseIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon
} from '@mui/icons-material';

function groupHours(hours) {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const groups = [];
  let currentGroup = null;

  if (typeof hours === 'string') {
    hours = JSON.parse(hours.replace(/'/g, '"'));
  }

  dayOrder.forEach((day) => {
    const timeRaw = hours[day];
    if (!timeRaw) return;

    const [start, end] = timeRaw.split('-').map((t) => {
      const [h, m] = t.split(':');
      return `${h}:${m.padEnd(2, '0')}`;
    });
    const formattedTime = `${start} - ${end}`;

    if (currentGroup && currentGroup.time === formattedTime) {
      currentGroup.days.push(day.slice(0, 3));
    } else {
      if (currentGroup) groups.push(currentGroup);
      currentGroup = { days: [day.slice(0, 3)], time: formattedTime };
    }
  });

  if (currentGroup) groups.push(currentGroup);
  return groups;
}

export default function BusinessDetailModal({ open, onClose, business, model }) {
  if (!business) return null;
  
  const sortedReviews = business.reviews
    ?.slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '80%', md: '70%', lg: '60%' },
    maxHeight: '90vh',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 0,
    overflow: 'hidden',
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="business-detail-modal"
      aria-describedby="detailed-information-about-business"
    >
      <Paper sx={modalStyle}>
        {/* Header with photo */}
        {/* <Box sx={{ position: 'relative', width: '100%', height: { xs: 200, md: 250 } }}>
          <Box
            component="img"
            src={business.photos?.[0] || 'https://via.placeholder.com/600x300?text=No+Image+Available'}
            alt={business.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box> */}

        {/* Content */}
        <Box sx={{ p: 3, maxHeight: 'calc(90vh - 250px)', overflow: 'auto' }}>
          {/* Business Name and Business ID */}
          <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
            {business.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {business.business_id}
          </Typography>

          {/* Rating Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
            {[...Array(5)].map((_, i) =>
              i < Math.floor(business.stars) ? (
                <StarIcon key={i} color="warning" />
              ) : (
                <StarBorderIcon key={i} color="warning" />
              )
            )}
            <Typography variant="body1" sx={{ ml: 1 }}>
              ({business.review_count} reviews)
            </Typography>
          </Box>

          {/* Model Score */}
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>
              {model === 'ItemCF' ? 'Interest' : 'Similarity'} Score:
            </strong>{' '}
            {business.score?.toFixed(4) || 'N/A'}
          </Typography>

          {/* Categories */}
          <Box sx={{ mb: 3 }}>
            {business.categories?.map((category, idx) => (
              <Chip
                key={idx}
                label={category}
                size="small"
                sx={{ mr: 0.5, mb: 0.5 }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Contact Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <LocationOnIcon color="primary" />
                <Typography>
                  {business.address}, {business.city}, {business.state}, {business.postal_code}
                </Typography>
              </Box>
            </Grid>
            
            {business.phone && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon color="primary" />
                  <Typography>{business.phone}</Typography>
                </Box>
              </Grid>
            )}
            
            {business.url && (
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon color="primary" />
                  <Typography component="a" href={business.url} target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                    Website
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Hours */}
          {business.hours && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Hours
              </Typography>
              <Grid container spacing={1}>
                {groupHours(business.hours).map((group, idx) => {
                  const dayDisplay =
                    group.days.length > 1
                      ? `${group.days[0]} to ${group.days[group.days.length - 1]}`
                      : group.days[0];
                  return (
                    <React.Fragment key={idx}>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {dayDisplay}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {group.time}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  );
                })}
              </Grid>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Reviews */}
          {sortedReviews && sortedReviews.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Reviews
              </Typography>
              {sortedReviews.map((review, idx) => (
                <Paper 
                  key={idx} 
                  elevation={1} 
                  sx={{ p: 2, mb: 2, bgcolor: 'background.paper' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) =>
                        i < Math.floor(review.stars) ? (
                          <StarIcon
                            key={i}
                            color="warning"
                            fontSize="small"
                            sx={{ width: 16, height: 16 }}
                          />
                        ) : (
                          <StarBorderIcon
                            key={i}
                            color="warning"
                            fontSize="small"
                            sx={{ width: 16, height: 16 }}
                          />
                        )
                      )}
                    </Box>
                    <Typography variant="caption">
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    {review.text}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onClose}>
              Close
            </Button>
            {business.url && (
              <Button 
                variant="contained" 
                component="a" 
                href={business.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Visit Website
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Modal>
  );
}