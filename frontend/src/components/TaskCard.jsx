// Material-UI Components
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  Divider,
  Alert,
  useTheme
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Assessment as StatusIcon
} from '@mui/icons-material';

const TaskCard = ({ task, onEdit, onDelete, loading, style }) => {
  const theme = useTheme();
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔥'
      case 'Medium': return '⚡'
      case 'Low': return '🌱'
      default: return '📌'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return '✅'
      case 'In Progress': return '🔄'
      case 'Pending': return '⏳'
      default: return '📋'
    }
  }

  // Check if task is overdue
  const isOverdue = () => {
    const dueDate = new Date(task.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today && task.status !== 'Completed'
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'default'
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Progress': return 'info'
      case 'Pending': return 'warning'
      default: return 'default'
    }
  }

  // Get card border color based on status
  const getCardBorderColor = (task) => {
    // First check if task is overdue (highest priority)
    if (isOverdue()) {
      return '#f44336'; // Red - Overdue
    }
    
    // Use status for border color
    switch (task.status) {
      case 'Completed': 
        return '#4caf50'; // Green - Completed
      case 'In Progress': 
        return '#2196f3'; // Blue - In Progress
      case 'Pending': 
        return '#ff9800'; // Orange - Pending
      default: 
        return '#9e9e9e'; // Gray - Default/Unknown
    }
  }

  return (
    <Card
      className="task-card"
      sx={{
        width: '100%',
        maxWidth: '100%',
        borderRadius: { xs: 2, sm: 3 },
        borderLeft: `4px solid ${getCardBorderColor(task)}`,
        background: isOverdue() 
          ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(255, 255, 255, 0.9) 50%)'
          : task.status === 'Completed'
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.9) 50%)'
          : task.status === 'In Progress'
          ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.05) 0%, rgba(255, 255, 255, 0.9) 50%)'
          : 'rgba(255, 255, 255, 0.9)',
        boxShadow: 2,
        transition: 'all 0.3s ease-in-out',
        minHeight: { xs: 240, sm: 280 }, // Responsive minimum height
        overflow: 'visible',
        '&:hover': {
          transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' },
          boxShadow: 4,
        },
        position: 'relative',
        ...style,
      }}
    >
      {/* Overdue Alert */}
      {isOverdue() && (
        <Alert
          severity="error"
          icon={<WarningIcon />}
          sx={{
            position: 'absolute',
            top: -16,
            left: 16,
            right: 16,
            zIndex: 1000,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            boxShadow: 3,
            '& .MuiAlert-message': {
              fontWeight: 600,
            },
          }}
        >
          Overdue Task
        </Alert>
      )}

      <CardContent sx={{ 
        pb: { xs: 2, sm: 2 }, 
        pt: isOverdue() ? { xs: 4, sm: 5 } : { xs: 2, sm: 3 }, 
        px: { xs: 2, sm: 3 },
        '&:last-child': { pb: { xs: 2, sm: 2 } },
      }}>
        {/* Task Title and Priority - Same Line */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 2 }}
        >
          <Typography 
            variant="h6" 
            component="h3" 
            fontWeight={600}
            color="text.primary"
            sx={{ 
              flex: 1,
              lineHeight: 1.3,
              wordBreak: 'break-word',
              fontSize: { xs: '1rem', sm: '1.125rem' },
              mr: 2
            }}
          >
            {task.title}
          </Typography>
          <Chip
            icon={<span>{getPriorityIcon(task.priority)}</span>}
            label={task.priority}
            color={getPriorityColor(task.priority)}
            size="small"
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              '& .MuiChip-icon': {
                fontSize: '1rem',
              },
            }}
          />
        </Stack>

        {/* Created Date (left) and Due Date (right) - Same Line */}
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ mb: 2 }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Start: {formatDate(task.createdAt)}
          </Typography>
          <Typography 
            variant="body2" 
            color={isOverdue() ? 'error.main' : 'text.secondary'}
            fontWeight={isOverdue() ? 600 : 400}
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Due: {formatDate(task.dueDate)}
          </Typography>
        </Stack>

        {/* Status */}
        <Box sx={{ mb: task.description ? 2 : 0 }}>
          <Chip
            icon={<span>{getStatusIcon(task.status)}</span>}
            label={task.status}
            color={getStatusColor(task.status)}
            size="medium"
            sx={{
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              height: { xs: 28, sm: 32 },
              fontWeight: 500,
              '& .MuiChip-icon': {
                fontSize: '1rem',
              },
            }}
          />
        </Box>

        {/* Description */}
        {task.description && (
          <Box sx={{ mb: 0 }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                lineHeight: 1.5,
                fontSize: { xs: '0.875rem', sm: '0.9rem' },
                wordBreak: 'break-word',
              }}
            >
              {task.description}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider />

      {/* Card Actions */}
      <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: { xs: 1.5, sm: 2 } }}>
        <Stack 
          direction="row" 
          spacing={{ xs: 1, sm: 2 }} 
          sx={{ width: '100%' }}
        >
          <Button
            variant="contained"
            color="success"
            size="medium"
            startIcon={<EditIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            onClick={() => onEdit(task)}
            disabled={loading}
            sx={{
              flex: 1,
              borderRadius: 2,
              fontWeight: 500,
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8rem', sm: '0.95rem' },
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="medium"
            startIcon={<DeleteIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            onClick={() => onDelete(task._id)}
            disabled={loading}
            sx={{
              flex: 1,
              borderRadius: 2,
              fontWeight: 500,
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: '0.8rem', sm: '0.95rem' },
              minWidth: { xs: 'auto', sm: 'auto' },
              '&:hover': {
                transform: 'translateY(-1px)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            Delete
          </Button>
        </Stack>
      </CardActions>
    </Card>
  )
}

export default TaskCard