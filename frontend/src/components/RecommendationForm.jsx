// components/RecommendationForm.jsx
import React, { useState } from 'react';
import Axios from 'axios';
import {
  Box,
  Button,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AppCard } from '../components/shared/SharedComponents';

export default function RecommendationForm({ API_BASE_URL, setResults, setLoading }) {
  const [model, setModel] = useState('DeepFM');
  const [userId, setUserId] = useState('');
  const k = 100;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const modelUrl = `${model}_recommendations`;
      const response = await Axios.post(
        `${API_BASE_URL}/${modelUrl}`,
        { user_id: userId, k }
      );
      const { data } = response;

      if (data.recommendations?.length) {
        const businessIds = data.recommendations.map((item) => item[0]);
        const businessIdQuery = businessIds.join(',');

        const businessResponse = await Axios.post(
          `${API_BASE_URL}/business_info`,
          { business_ids: businessIdQuery }
        );
        const businessData = businessResponse.data;

        setResults({
          user: data.users ? data.users[userId] : null,
          recommendations: data.recommendations,
          businesses: businessData,
          model,
        });
      } else {
        setResults({
          user: data.users ? data.users[userId] : null,
          recommendations: [],
          businesses: {},
          model,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppCard>
        <CardContent sx={{ p: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: 'wrap',
              gap: 2,
              alignItems: 'flex-end',
            }}
          >
            <FormControl size="small" sx={{ minWidth: 250 }}>
              <InputLabel id="model-select-label">
                Recommendation Model
              </InputLabel>
              <Select
                labelId="model-select-label"
                id="model-select"
                value={model}
                label="Recommendation Model"
                onChange={(e) => setModel(e.target.value)}
                required
              >
                <MenuItem value="ItemCF">
                  ItemCF
                </MenuItem>
                <MenuItem value="UserCF">
                  UserCF
                </MenuItem>
                <MenuItem value="DSSM">
                  DSSM
                </MenuItem>
                <MenuItem value="DeepFM">
                  DeepFM (Final Model)
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="user-id"
              label="User ID"
              variant="outlined"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              sx={{ flexGrow: 1 }}
            />

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: { xs: 1, md: 0 },
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                Get Recommendations
              </Button>
            </Box>
          </Box>
        </CardContent>
      </AppCard>
    </Box>
  );
}
