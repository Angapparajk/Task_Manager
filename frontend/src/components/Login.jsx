import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Close
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });
  
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true });
  };

  // Hide notification helper
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Clear any previous login error
    setLoginError(null);
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      showNotification('Login successful! Welcome back! 🎉', 'success');
      // Small delay to show the notification before navigating
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1500);
    } else {
      // Set our own error state
      setLoginError(result.error || 'Login failed');
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
                  src="/src/assets/icons8-reminders-64.png" 
                  alt="Task Manager" 
                  style={{ 
                    width: 70, 
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
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  px: { xs: 1, sm: 0 }
                }}
              >
                Sign in to your account to continue
              </Typography>
            </Box>

            {loginError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                action={
                  <IconButton
                    size="small"
                    onClick={() => setLoginError(null)}
                    color="inherit"
                  >
                    <Close fontSize="small" />
                  </IconButton>
                }
              >
                {loginError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Box textAlign="center" mt={2}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    style={{ 
                      color: '#6366f1', 
                      textDecoration: 'none',
                      fontWeight: 500
                    }}
                  >
                    Create one here
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

export default Login;