import TaskCard from './TaskCard'

// Material-UI Components
import {
  Paper,
  Box,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  List as ListIcon,
  Inbox as EmptyIcon
} from '@mui/icons-material';

const TaskList = ({ tasks, onEdit, onDelete, loading, title = "Task List" }) => {

  if (loading) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <ListIcon color="primary" />
          <Typography variant="h6" component="h2" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Stack>
        <Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Loading your tasks...
          </Typography>
        </Stack>
      </Paper>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Paper
        elevation={1}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <ListIcon color="primary" />
          <Typography variant="h6" component="h2" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Stack>
        <Stack alignItems="center" spacing={3} sx={{ py: 6 }}>
          <EmptyIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
          <Box textAlign="center">
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              There are no tasks to display at the moment.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper
      elevation={1}
      sx={{
        p: 0,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
      }}
    >
      {/* Task List Header */}
      <Box sx={{ p: { xs: 2, sm: 3 }, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <ListIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
          <Typography 
            variant={{ xs: 'subtitle1', sm: 'h6' }} 
            component="h2" 
            fontWeight={600} 
            color="text.primary"
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            {title} ({tasks.length})
          </Typography>
        </Stack>
      </Box>

      {/* Task Cards */}
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2, md: 3 },
          width: '100%',
        }}>
          {tasks.map((task, index) => (
            <Box
              key={task._id}
              sx={{
                width: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(50% - 12px)' },
                minWidth: 0,
                display: 'flex',
              }}
            >
              <TaskCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={loading}
                style={{ '--animation-order': index }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

export default TaskList