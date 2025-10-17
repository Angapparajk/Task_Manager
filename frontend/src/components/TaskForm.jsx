import { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react'

// Material-UI Components
import {
  Paper,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Chip,
  LinearProgress,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Title as TitleIcon,
  Event as EventIcon,
  PriorityHigh as PriorityIcon,
  Assessment as StatusIcon
} from '@mui/icons-material';

const TaskForm = forwardRef(({ onSubmit, editingTask, onCancel, loading, showNotification }, ref) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending'
  })

  const formSectionRef = useRef(null)

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Pending'
      })
    },
    scrollIntoView: (options) => {
      if (formSectionRef.current) {
        formSectionRef.current.scrollIntoView(options)
      }
    },
    classList: formSectionRef.current?.classList,
    // Expose the DOM element for backward compatibility
    get current() {
      return formSectionRef.current
    }
  }))

  // Update form data when editing task changes
  useEffect(() => {
    if (editingTask) {
      // Clean title by removing any numbers when editing
      const cleanTitle = editingTask.title.replace(/\d/g, '').trim()
      setFormData({
        title: cleanTitle,
        description: editingTask.description || '',
        dueDate: editingTask.dueDate.split('T')[0],
        priority: editingTask.priority,
        status: editingTask.status
      })
      // Show warning if numbers were removed
      if (cleanTitle !== editingTask.title) {
        showNotification('Numbers have been removed from the task title', 'warning')
      }
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'Pending'
      })
    }
  }, [editingTask])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Prevent numbers in title field
    if (name === 'title' && /\d/.test(value)) {
      showNotification('Numbers are not allowed in task title', 'warning')
      return; // Don't update state if numbers are detected in title
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.dueDate) {
      showNotification('Please fill in all required fields', 'warning')
      return
    }
    if (/\d/.test(formData.title)) {
      showNotification('Task title cannot contain numbers', 'warning')
      return
    }
    onSubmit(formData)
  }

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0]

  return (
    <Paper
      ref={formSectionRef}
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        position: { xs: 'static', md: 'sticky' },
        top: { xs: 0, md: 24 },
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: { xs: 'none', md: 'translateY(-2px)' },
          boxShadow: 4,
        },
      }}
    >
      {/* Form Header */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          alignItems={{ xs: 'flex-start', sm: 'center' }} 
          justifyContent="space-between" 
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {editingTask ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
            <Typography variant="h5" component="h2" fontWeight={600} color="text.primary">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Typography>
          </Stack>
          {editingTask && (
            <Chip
              icon={<EditIcon />}
              label="Editing mode"
              color="primary"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </Box>
      
      {/* Loading Progress */}
      {loading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress color="primary" />
        </Box>
      )}

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Task Title */}
          <TextField
            fullWidth
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter a descriptive task title..."
            required
            inputProps={{ maxLength: 100 }}
            helperText={`${formData.title.length}/100 characters`}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Task Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Task Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter additional details about this task... (optional)"
            inputProps={{ maxLength: 500 }}
            helperText={`${formData.description.length}/500 characters (optional)`}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Due Date */}
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
            inputProps={{ min: today }}
            helperText="Select when this task should be completed"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon color="action" />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
              },
            }}
          />

          {/* Priority Level */}
          <FormControl fullWidth>
            <InputLabel>Priority Level</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              label="Priority Level"
              startAdornment={
                <InputAdornment position="start">
                  <PriorityIcon color="action" />
                </InputAdornment>
              }
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="Low">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>🌱</span>
                  <Typography>Low Priority</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="Medium">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>⚡</span>
                  <Typography>Medium Priority</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="High">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>🔥</span>
                  <Typography>High Priority</Typography>
                </Stack>
              </MenuItem>
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
              Choose the urgency level for this task
            </Typography>
          </FormControl>

          {/* Current Status */}
          <FormControl fullWidth>
            <InputLabel>Current Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              label="Current Status"
              startAdornment={
                <InputAdornment position="start">
                  <StatusIcon color="action" />
                </InputAdornment>
              }
              sx={{
                borderRadius: 2,
              }}
            >
              <MenuItem value="Pending">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>⏳</span>
                  <Typography>Pending</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="In Progress">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>🔄</span>
                  <Typography>In Progress</Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="Completed">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <span>✅</span>
                  <Typography>Completed</Typography>
                </Stack>
              </MenuItem>
            </Select>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1 }}>
              Update the current progress of this task
            </Typography>
          </FormControl>

          {/* Form Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? null : (editingTask ? <SaveIcon /> : <AddIcon />)}
              sx={{
                flex: 1,
                borderRadius: 2,
                py: 1.5,
                fontWeight: 600,
                background: editingTask
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: 4,
                },
                '&:disabled': {
                  background: 'grey.300',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Add Task')}
            </Button>
            {editingTask && (
              <Button
                type="button"
                variant="outlined"
                size="large"
                onClick={onCancel}
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: 'grey.400',
                  color: 'grey.700',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    </Paper>
  )
})

TaskForm.displayName = 'TaskForm'

export default TaskForm