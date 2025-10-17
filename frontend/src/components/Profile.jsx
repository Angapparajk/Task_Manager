import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';

// Material-UI Components
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Paper,
  Stack,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Logout as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const Profile = () => {
  const { user, updateProfile, loading, error, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
    }
  }, [user]);

  // Clear notification after timeout
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, isVisible: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification.isVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent numbers in name field
    if (name === 'name' && /\d/.test(value)) {
      return; // Don't update state if numbers are detected in name
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters';
    } else if (/\d/.test(formData.name)) {
      newErrors.name = 'Name cannot contain numbers';
    }
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await updateProfile({
      name: formData.name.trim(),
      email: formData.email,
      profilePicture: formData.profilePicture
    });
    
    if (result.success) {
      setIsEditing(false);
      setNotification({
        message: 'Profile updated successfully! ✨',
        type: 'success',
        isVisible: true
      });
    } else {
      setNotification({
        message: result.error || 'Failed to update profile',
        type: 'error',
        isVisible: true
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        profilePicture: user.profilePicture || ''
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Layout title="Profile">
      <Container 
        maxWidth="lg"
        sx={{ 
          py: { xs: 2, sm: 4 }, 
          px: { xs: 0.5, sm: 2 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%'
        }}
      >
        {/* Profile Header */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3 },
            mb: { xs: 1, sm: 2 },
            borderRadius: { xs: 2, sm: 3 },
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            width: { xs: 'calc(100% - 8px)', sm: 'calc(100% - 16px)', md: '800px' },
            alignSelf: 'center',
            mx: { xs: 0.5, sm: 1 },
            maxWidth: { xs: 'none', sm: 'none', md: '800px' }
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                color: 'grey.700',
                '&:hover': { backgroundColor: 'grey.100' },
              }}
            >
              Back to Dashboard
            </Button>
            
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="text.primary"
              textAlign="center"
            >
              Profile Settings
            </Typography>
            
            <Button
              startIcon={<LogoutIcon />}
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              color="error"
              variant="contained"
              sx={{
                borderRadius: 2,
                '&:hover': { transform: 'translateY(-1px)' },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Logout
            </Button>
          </Stack>
        </Paper>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.isVisible}
          autoHideDuration={5000}
          onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
            severity={notification.type === 'success' ? 'success' : 'error'}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Profile Content */}
        <Card
          sx={{
            borderRadius: { xs: 2, sm: 3 },
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: isEditing ? '2px solid' : '1px solid rgba(255, 255, 255, 0.2)',
            borderColor: isEditing ? 'primary.light' : 'rgba(255, 255, 255, 0.2)',
            boxShadow: isEditing ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 3,
            position: 'relative',
            overflow: 'visible',
            mx: { xs: 0.5, sm: 1 },
            width: { xs: 'calc(100% - 8px)', sm: 'calc(100% - 16px)', md: '800px' },
            alignSelf: 'center',
            maxWidth: { xs: 'none', sm: 'none', md: '800px' },
            '&::before': isEditing ? {
              content: '"✏️ Edit Mode Active"',
              position: 'absolute',
              top: { xs: -16, sm: -20 },
              left: { xs: 12, sm: 16 },
              backgroundColor: 'primary.main',
              color: 'white',
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.5, sm: 0.75 },
              borderRadius: 2,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              zIndex: 1000,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              whiteSpace: 'nowrap',
              display: 'block'
            } : {},
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Profile Avatar Section */}
            <Box sx={{ 
              textAlign: 'center', 
              mb: { xs: 3, sm: 4 }, 
              pb: { xs: 2, sm: 3 }, 
              borderBottom: '1px solid', 
              borderColor: 'grey.200' 
            }}>
              <Avatar
                src={formData.profilePicture}
                sx={{
                  width: { xs: 80, sm: 100, md: 120 },
                  height: { xs: 80, sm: 100, md: 120 },
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                  color: 'white',
                  border: { xs: '3px solid', sm: '4px solid' },
                  borderColor: 'primary.light',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              
              {isEditing && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    type="url"
                    label="Profile Picture URL (Optional)"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/your-picture.jpg"
                    disabled={loading}
                    helperText="Leave empty to use initials"
                    size="medium"
                    InputProps={{
                      startAdornment: <ImageIcon sx={{ color: 'grey.400', mr: 1 }} />,
                    }}
                    sx={{ 
                      maxWidth: { xs: '100%', sm: 400 }, 
                      mx: 'auto',
                      '& .MuiInputBase-root': {
                        height: { xs: '48px', sm: '56px' },
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      },
                      '& .MuiFormHelperText-root': {
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Profile Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                {/* Name Field */}
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  error={!!errors.name}
                  helperText={errors.name}
                  size="medium"
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: <PersonIcon sx={{ color: 'grey.400', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: isEditing ? 'transparent' : 'grey.50',
                      cursor: isEditing ? 'text' : 'default',
                    },
                    '& .MuiInputBase-root': {
                      height: { xs: '48px', sm: '56px' },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }
                  }}
                />

                {/* Email Field */}
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  error={!!errors.email}
                  helperText={errors.email}
                  size="medium"
                  InputProps={{
                    readOnly: !isEditing,
                    startAdornment: <EmailIcon sx={{ color: 'grey.400', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: isEditing ? 'transparent' : 'grey.50',
                      cursor: isEditing ? 'text' : 'default',
                    },
                    '& .MuiInputBase-root': {
                      height: { xs: '48px', sm: '56px' },
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    },
                    '& .MuiFormHelperText-root': {
                      fontSize: { xs: '0.75rem', sm: '0.8rem' }
                    }
                  }}
                />

                {/* Account Information */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: 'grey.50',
                    borderRadius: 2,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="text.primary" 
                    sx={{ 
                      mb: 2,
                      fontSize: { xs: '1rem', sm: '1.25rem' }
                    }}
                  >
                    Account Information
                  </Typography>
                  <Stack spacing={2}>
                    <Stack 
                      direction="row"
                      justifyContent="space-between" 
                      alignItems="center"
                      spacing={1}
                      sx={{ flexWrap: 'wrap' }}
                    >
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        color="text.primary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Creation Date:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack 
                      direction="row"
                      justifyContent="space-between" 
                      alignItems="center"
                      spacing={1}
                      sx={{ flexWrap: 'wrap' }}
                    >
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        color="text.primary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Last Login:
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        {formatDate(user.lastLogin)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack 
                      direction="row"
                      justifyContent="space-between" 
                      alignItems="center"
                      spacing={1}
                      sx={{ flexWrap: 'wrap' }}
                    >
                      <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        color="text.primary"
                        sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                      >
                        Account Status:
                      </Typography>
                      <Chip
                        icon={<CheckCircleIcon />}
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                        sx={{
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          height: { xs: '20px', sm: '24px' }
                        }}
                      />
                    </Stack>
                  </Stack>
                </Paper>

                {/* Action Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2} 
                  justifyContent="center" 
                  sx={{ pt: 2 }}
                  alignItems="center"
                >
                  {isEditing ? (
                    <>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        disabled={loading}
                        size="medium"
                        sx={{
                          minWidth: { xs: '100%', sm: 140 },
                          maxWidth: { xs: '300px', sm: 'none' },
                          borderRadius: 2,
                          py: { xs: 1.2, sm: 1 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 4,
                          },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        type="button"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                        disabled={loading}
                        size="medium"
                        sx={{
                          minWidth: { xs: '100%', sm: 120 },
                          maxWidth: { xs: '300px', sm: 'none' },
                          borderRadius: 2,
                          py: { xs: 1.2, sm: 1 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          '&:hover': { transform: 'translateY(-1px)' },
                          transition: 'all 0.2s ease-in-out',
                        }}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                      size="medium"
                      sx={{
                        minWidth: { xs: '100%', sm: 140 },
                        maxWidth: { xs: '300px', sm: 'none' },
                        borderRadius: 2,
                        py: { xs: 1.2, sm: 1 },
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: 4,
                        },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default Profile;