import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  Container,
  Snackbar,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Close
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  
  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
  };

  // Hide notification helper
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

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
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    let label = '';
    let color = '';
    
    // Length check
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    if (strength <= 2) {
      label = 'Weak';
      color = 'error';
    } else if (strength <= 4) {
      label = 'Medium';
      color = 'warning';
    } else {
      label = 'Strong';
      color = 'success';
    }
    
    return { strength: (strength / 6) * 100, label, color };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const result = await register(formData.name.trim(), formData.email, formData.password);
    
    if (result.success) {
      showNotification('Registration successful! Welcome to TaskManager! 🎉', 'success');
      // Small delay to show the notification before navigating
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <Box className="auth-container">
      <Box className="auth-background">
        <Box className="floating-elements">
          <Box className="floating-element floating-element-1"></Box>
          <Box className="floating-element floating-element-2"></Box>
          <Box className="floating-element floating-element-3"></Box>
        </Box>
      </Box>
      
      <Box
        sx={{ 
          px: { xs: 0.5, sm: 1, md: 2 },
          py: { xs: 1, sm: 2 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Card sx={{ 
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: { xs: 3, sm: 4 },
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          p: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 1, sm: 2, md: 4 },
          mb: { xs: 1, sm: 2, md: 4 },
          width: { xs: '98%', sm: '95%', md: '600px' },
          maxWidth: { xs: 'none', sm: 'none', md: '600px' }
        }}>
          <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            <Box textAlign="center" mb={{ xs: 2, sm: 3, md: 4 }}>
              <Box mb={{ xs: 1, sm: 2 }}>
                <img 
                  src="src/assets/12166762.png" 
                  alt="Task Manager" 
                  style={{ 
                    width: 48, 
                    height: 48,
                    maxWidth: '100%'
                  }} 
                />
              </Box>
              <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' },
                  lineHeight: { xs: 1.2, sm: 1.3 }
                }}
              >
                Create Account
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                Join us and start managing your tasks efficiently
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                margin="normal"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                placeholder="Enter your full name"
              />

              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
                margin="normal"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                placeholder="Enter your email address"
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                margin="normal"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                placeholder="Create a password"
              />

              {formData.password && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={{ xs: 1, sm: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={passwordStrength.strength}
                      sx={{
                        flex: 1,
                        height: { xs: 4, sm: 6 },
                        borderRadius: 3,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: passwordStrength.color === 'error' ? 'error.main' : 
                                           passwordStrength.color === 'warning' ? 'warning.main' : 'success.main',
                          borderRadius: 3,
                        }
                      }}
                    />
                    <Chip 
                      label={passwordStrength.label}
                      size="small"
                      color={passwordStrength.color}
                      variant="outlined"
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        height: { xs: '20px', sm: '24px' }
                      }}
                    />
                  </Box>
                </Box>
              )}

              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
                margin="normal"
                size="medium"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
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
                placeholder="Confirm your password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ 
                  mt: { xs: 2, sm: 3 }, 
                  mb: 2,
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  minHeight: { xs: '44px', sm: '48px' }
                }}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Box textAlign="center" mt={2}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#6366f1', 
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Success Notification */}
      <Snackbar
        open={notification.isVisible}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ 
          vertical: 'top', 
          horizontal: 'right'
        }}
        sx={{
          '& .MuiSnackbar-root': {
            width: { xs: '90%', sm: 'auto' }
          }
        }}
      >
        <Alert 
          onClose={hideNotification} 
          severity={notification.type} 
          sx={{ 
            width: '100%',
            fontSize: { xs: '0.8rem', sm: '0.875rem' }
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;