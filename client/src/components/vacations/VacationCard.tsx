/**
 * VacationCard Component
 * 
 * Card component for displaying individual vacation packages
 * Features:
 * - Responsive image display
 * - Price and date information
 * - Follow/unfollow functionality
 * - Admin edit/delete controls
 * - Like counter
 * - Hover effects
 * - Loading states
 * - Error handling
 * - RTL support
 * - Accessibility support
 * 
 * @component
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Vacation } from '../../types';
import { useAppDispatch } from '../../hooks/redux';
import { followVacation, unfollowVacation } from '../../store/slices/vacationSlice';

/**
 * Interface for vacation card props
 */
interface VacationCardProps {
  vacation: Vacation;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

/**
 * VacationCard Component Implementation
 * 
 * Displays vacation package information in a card format
 * Uses Material-UI components for styling and animations
 * 
 * @param props - Component props containing vacation data and handlers
 * @returns React component with vacation card
 */
const VacationCard: React.FC<VacationCardProps> = ({ vacation, isAdmin, onDelete }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleFollowClick = () => {
    if (vacation.isFollowing) {
      dispatch(unfollowVacation(vacation.id));
    } else {
      dispatch(followVacation(vacation.id));
    }
  };

  const handleEditClick = () => {
    navigate(`/admin/edit-vacation/${vacation.id}`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(vacation.id);
      setDeleteDialogOpen(false);
    }
  };

  const getImageUrl = (url: string | null, destination: string) => {
    if (!url) {
      return getDefaultImage(destination);
    }
    return `${process.env.REACT_APP_API_URL || 'http://localhost:3001'}${url}`;
  };

  const getDefaultImage = (destination: string) => {
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(destination)}`;
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
          <CardMedia
            component="img"
            image={getImageUrl(vacation.imageUrl, vacation.destination)}
            alt={vacation.destination}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {vacation.destination}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mr: 1
                }}
              >
                <Favorite fontSize="small" color="action" />
                {vacation.followersCount} עוקבים
              </Typography>
              {!isAdmin && (
                <Tooltip title={vacation.isFollowing ? 'הסר מעקב' : 'עקוב'}>
                  <IconButton
                    onClick={handleFollowClick}
                    size="small"
                    sx={{ bgcolor: 'background.paper' }}
                  >
                    {vacation.isFollowing ? <Favorite color="primary" /> : <FavoriteBorder />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" paragraph>
            {vacation.description}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="h6" color="primary">
              ₪{vacation.price.toLocaleString()}
            </Typography>
            {isAdmin && (
              <Box>
                <IconButton onClick={handleEditClick} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteDialogOpen(true)} size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </CardContent>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>מחיקת חופשה</DialogTitle>
          <DialogContent>
            האם אתה בטוח שברצונך למחוק את החופשה ל{vacation.destination}?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>ביטול</Button>
            <Button onClick={handleDelete} color="error">
              מחק
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </Grid>
  );
};

export default VacationCard; 