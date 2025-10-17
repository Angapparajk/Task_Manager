import { useEffect } from 'react'
import {
  Snackbar,
  Alert,
  Slide
} from '@mui/material';

// Slide transition component
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const NotificationModal = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-close after different durations based on type
      // Error messages stay longer so users can read them
      const duration = type === 'error' ? 4000 : 3000; // 4s for errors, 3s for others
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, type])

  // Map type to Material-UI severity
  const getMuiSeverity = (type) => {
    switch (type) {
      case 'error': return 'error'
      case 'warning': return 'warning'
      case 'success': return 'success'
      default: return 'info'
    }
  }

  return (
    <Snackbar
      open={isVisible && !!message}
      autoHideDuration={type === 'error' ? 4000 : 3000}
      onClose={onClose}
      anchorOrigin={{ 
        vertical: 'top', 
        horizontal: window.innerWidth < 600 ? 'center' : 'right' 
      }}
      TransitionComponent={SlideTransition}
      sx={{
        mt: { xs: 6, sm: 8 }, // Responsive top margin
        mx: { xs: 2, sm: 0 }, // Add horizontal margin on mobile
        '& .MuiSnackbarContent-root': {
          borderRadius: 2,
        },
      }}
    >
      <Alert
        onClose={onClose}
        severity={getMuiSeverity(type)}
        variant="filled"
        sx={{
          width: { xs: '90vw', sm: '100%' },
          maxWidth: { xs: '90vw', sm: 400 },
          borderRadius: 2,
          boxShadow: 3,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          '& .MuiAlert-message': {
            fontWeight: 500,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationModal