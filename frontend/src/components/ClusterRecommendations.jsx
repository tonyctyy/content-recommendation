// components/ClusterRecommendations.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';
import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  FormGroup,
  FormHelperText,
  Stack,
  Typography,
  TextField 
} from '@mui/material';

import BusinessCardCarousel from './BusinessCardCarousel';

const ClusterRecommendations = ({ userData, API_BASE_URL, k = 100 }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [clusterRec, setClusterRec] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [otherCategory, setOtherCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize categories and set defaults from userData
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories.json');
        const records = await response.json();

        records.sort((a, b) => b.frequency - a.frequency);

        setAllCategories(records.map((record) => record.category));
        setTopCategories(records.slice(0, 20).map((record) => record.category));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();

    if (userData?.categories?.length) {
      setSelectedCategories(userData.categories.slice(0, 5));
    }
  }, [userData]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      }

      if (prev.length < 5) {
        return [...prev, category];
      }

      return prev;
    });
  };

  const handleDropdownChange = (event) => {
    const { value: category } = event.target;

    if (
      category &&
      !selectedCategories.includes(category) &&
      selectedCategories.length < 5
    ) {
      setSelectedCategories((prev) => [...prev, category]);
    }

    setOtherCategory('');
  };

  const fetchClusterRecommendations = useCallback(async () => {
    if (!selectedCategories.length) return;

    setIsLoading(true);
    try {
      const response = await Axios.post(
        `${API_BASE_URL}/cluster_recommendations`,
        {
          categories: selectedCategories,
          user_id: userData?.user_id || 'visitor',
          k,
        }
      );

      const { recommendations } = response.data;

      if (recommendations?.length) {
        const businessIds = recommendations.map((item) => item[0]);
        const businessIdQuery = businessIds.join(',');

        const businessResponse = await Axios.post(
          `${API_BASE_URL}/business_info`,
          { business_ids: businessIdQuery }
        );

        setClusterRec({
          recommendations,
          businesses: businessResponse.data,
          model: 'Cluster',
        });
      } else {
        setClusterRec({
          recommendations: [],
          businesses: {},
          model: 'Cluster',
        });
      }
    } catch (error) {
      console.error('Error fetching cluster recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategories, userData, API_BASE_URL, k]);

  useEffect(() => {
    let timerId;

    if (selectedCategories.length >= 4) {
      timerId = setTimeout(fetchClusterRecommendations, 2000);
    }

    return () => clearTimeout(timerId);
  }, [selectedCategories, fetchClusterRecommendations]);

  const dropdownCategories = allCategories.filter(
    (cat) => !topCategories.includes(cat) && !selectedCategories.includes(cat)
  );

  return (
    <>
      <Typography variant="h4" sx={{ mb: -4 }} color="text.primary">
        Users Similar to You are Interested in
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: -3 }}>
        Select up to 5 categories you're interested in:
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: '80%' },
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormGroup>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} 
                sx={{ 
                  '& .MuiChip-root': {
                    margin: '0 4px 8px 0', // Use consistent margins instead
                  }
                }}
              >
                {selectedCategories.map((category) => (
                  <Chip
                    key={`selected-${category}`}
                    label={category}
                    onClick={() => handleCategoryToggle(category)}
                    color="primary"
                    variant="filled"
                    sx={{ mb: 1 }}
                  />
                ))}
                  {topCategories.filter((cat) => !selectedCategories.includes(cat)).map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      onClick={() => handleCategoryToggle(category)}
                      color="default"
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
              </Stack>
            </FormGroup>
            <FormHelperText>
              {5 - selectedCategories.length} more categories can be selected
            </FormHelperText>
          </FormControl>
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '20%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          {dropdownCategories.length > 0 && (
            <Autocomplete
              id="other-category-autocomplete"
              options={dropdownCategories}
              value={otherCategory}
              disabled={selectedCategories.length >= 5}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleDropdownChange({ target: { value: newValue } });
                }
              }}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Other Categories" 
                  variant="outlined"
                />
              )}
              sx={{ minWidth: 200, mt: 1 }}
            />
          )}
        </Box>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {clusterRec?.recommendations?.length > 0 && (
        <BusinessCardCarousel
          recommendations={clusterRec.recommendations}
          businesses={clusterRec.businesses}
          model={clusterRec.model}
        />
      )}
    </>
  );
};

export default ClusterRecommendations;
