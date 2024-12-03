import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Fade
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Vacation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { followVacation, unfollowVacation } from '../../store/slices/vacationSlice';

interface VacationCardProps {
  vacation: Vacation;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

const VacationCard: React.FC<VacationCardProps> = ({ vacation, isAdmin, onDelete }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(vacation.id);
    }
    setDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(price);
  };

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Fade in={true} timeout={500}>
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8]
            },
            position: 'relative'
          }}
        >
          <CardMedia
            component="img"
            height={isMobile ? 200 : 250}
            image={vacation.imageUrl}
            alt={vacation.destination}
            sx={{ 
              objectFit: 'cover',
              position: 'relative'
            }}
          />
          
          {isAdmin ? (
            <Box 
              sx={{ 
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '8px',
                padding: '4px'
              }}
            >
              <Tooltip title="ערוך חופשה">
                <IconButton 
                  size="small"
                  onClick={handleEditClick}
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.1)'
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="מחק חופשה">
                <IconButton 
                  size="small"
                  onClick={handleDeleteClick}
                  sx={{
                    color: theme.palette.error.main,
                    '&:hover': {
                      backgroundColor: 'rgba(211, 47, 47, 0.1)'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          ) : user && (
            <Tooltip title={vacation.isFollowing ? 'הסר מהמועדפים' : 'הוסף למועדפים'}>
              <IconButton
                onClick={handleFollowClick}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: vacation.isFollowing ? theme.palette.error.main : theme.palette.action.active,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {vacation.isFollowing ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>
          )}

          <CardContent sx={{ flexGrow: 1, p: isMobile ? 2 : 3 }}>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                mb: 2
              }}
            >
              {vacation.destination}
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              paragraph
              sx={{ 
                mb: 2,
                minHeight: isMobile ? 'auto' : '4.5em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {vacation.description}
            </Typography>

            <Box sx={{ mt: 'auto' }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mb: 2
                }}
              >
                <strong>תאריכים:</strong> {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`
              }}>
                <Typography 
                  variant="h6" 
                  component="p"
                  sx={{ 
                    fontWeight: 'bold',
                    color: theme.palette.primary.main
                  }}
                >
                  {formatPrice(vacation.price)}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Favorite fontSize="small" color="action" />
                  {vacation.followersCount} עוקבים
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 'bold',
          color: theme.palette.error.main,
          pb: 1
        }}>
          מחיקת חופשה
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            האם אתה בטוח שברצונך למחוק את החופשה ל{vacation.destination}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            פעולה זו אינה הפיכה.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="inherit"
          >
            ביטול
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
          >
            מחק
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default VacationCard; 