import { useNavigate } from 'react-router-dom';

// Material-UI Components
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Container
} from '@mui/material';
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      className="auth-container"
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #fef3c7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Background Animation Elements */}
      <Box className="floating-elements">
        <Box className="floating-element floating-element-1" />
        <Box className="floating-element floating-element-2" />
        <Box className="floating-element floating-element-3" />
      </Box>

      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: 'linear-gradient(90deg, #6366f1, #f59e0b, #10b981)',
            }
          }}
        >
          <Stack spacing={3} alignItems="center">
            {/* 404 Icon */}
            <Box
              sx={{
                fontSize: { xs: '4rem', sm: '5rem', md: '6rem' },
                background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)',
                animation: 'bounce 2s ease-in-out infinite',
              }}
            >
              404
            </Box>

            {/* Search Icon Animation */}
            <SearchIcon 
              sx={{ 
                fontSize: { xs: '3rem', sm: '4rem' },
                color: 'text.secondary',
                opacity: 0.3,
                animation: 'pulse 2s ease-in-out infinite',
              }} 
            />

            {/* Main Heading */}
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={600}
              color="text.primary"
              sx={{ 
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' },
                mb: 1
              }}
            >
              Page Not Found
            </Typography>

            {/* Description */}
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.6,
                maxWidth: '400px',
                mb: 2
              }}
            >
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </Typography>

            {/* Action Buttons */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              sx={{ width: '100%', maxWidth: '400px' }}
            >
              <Button
                variant="contained"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                size="large"
                sx={{
                  flex: 1,
                  py: { xs: 1.5, sm: 1.2 },
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6366f1 0%, #f59e0b 100%)',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Go to Dashboard
              </Button>

              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleGoBack}
                size="large"
                sx={{
                  flex: 1,
                  py: { xs: 1.5, sm: 1.2 },
                  borderRadius: 2,
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 600,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    backgroundColor: 'primary.light',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Go Back
              </Button>
            </Stack>

            {/* Help Text */}
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: '0.85rem',
                mt: 2,
                opacity: 0.7
              }}
            >
              If you believe this is an error, please contact support or try refreshing the page.
            </Typography>
          </Stack>
        </Paper>
      </Container>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0, 0, 0);
          }
          40%, 43% {
            transform: translate3d(0, -8px, 0);
          }
          70% {
            transform: translate3d(0, -4px, 0);
          }
          90% {
            transform: translate3d(0, -2px, 0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
        }
      `}</style>
    </Box>
  );
};

export default NotFound;