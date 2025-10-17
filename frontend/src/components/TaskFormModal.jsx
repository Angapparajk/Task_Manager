import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  InputAdornment,
  IconButton,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Title as TitleIcon,
  Event as EventIcon,
  PriorityHigh as PriorityIcon,
  Assessment as StatusIcon,
  Add as AddIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const TaskFormModal = forwardRef(({ open, onClose, onSubmit, editingTask, loading, showNotification }, ref) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    status: 'Pending'
  })

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
  }, [editingTask, showNotification])

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

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'Medium',
      status: 'Pending'
    })
    onClose()
  }

  // Get today's date for min date validation
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: { xs: 2, sm: 3 },
          minHeight: { xs: 'auto', sm: '500px' },
          maxHeight: { xs: '85vh', sm: '90vh' },
          margin: { xs: 2, sm: 'auto' },
          width: { xs: 'calc(100vw - 32px)', sm: '700px', md: '800px', lg: '900px' },
          maxWidth: { xs: 'calc(100vw - 32px)', sm: '700px', md: '800px', lg: '900px' }
        }
      }}
      sx={{
        '& .MuiDialog-container': {
          padding: { xs: 2, sm: 3 },
          alignItems: { xs: 'flex-start', sm: 'center' }
        }
      }}
    >
      {/* Loading Progress */}
      {loading && (
        <LinearProgress color="primary" />
      )}

      {/* Dialog Title */}
      <DialogTitle sx={{ pb: { xs: 1, sm: 1 }, px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 3 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={{ xs: 1, sm: 1.5 }}>
            {editingTask ? <EditIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <AddIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />}
            <Typography 
              variant={{ xs: 'h6', sm: 'h6' }} 
              component="h2" 
              fontWeight={600}
              sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
            >
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </Typography>
          </Stack>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ 
              color: 'text.secondary',
              padding: { xs: 1, sm: 1.5 }
            }}
          >
            <CloseIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Form Content */}
      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: { xs: 1, sm: 2 } }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={{ xs: 2, sm: 3 }} sx={{ mt: { xs: 0.5, sm: 1 } }}>
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
                    <TitleIcon color="action" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </InputAdornment>
                ),
                sx: {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  py: { xs: 0.5, sm: 0.75 }
                }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
            />

            {/* Task Description */}
            <TextField
              fullWidth
              multiline
              rows={{ xs: 2, sm: 3 }}
              label="Task Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter additional details about this task... (optional)"
              inputProps={{ 
                maxLength: 500,
                style: {
                  resize: 'vertical',
                  minHeight: '60px'
                }
              }}
              helperText={`${formData.description.length}/500 characters (optional)`}
              InputProps={{
                sx: {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  py: { xs: 0.5, sm: 0.75 },
                  '& .MuiInputBase-input': {
                    resize: 'vertical',
                    minHeight: { xs: '60px', sm: '80px' },
                    maxHeight: '200px'
                  }
                }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
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
                    <EventIcon color="action" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </InputAdornment>
                ),
                sx: {
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  py: { xs: 0.5, sm: 0.75 }
                }
              }}
              InputLabelProps={{
                sx: { fontSize: { xs: '0.9rem', sm: '1rem' } }
              }}
            />

            {/* Priority Level */}
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Priority Level</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                label="Priority Level"
                startAdornment={
                  <InputAdornment position="start">
                    <PriorityIcon color="action" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </InputAdornment>
                }
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  '& .MuiSelect-select': {
                    py: { xs: 1, sm: 1.25 }
                  }
                }}
              >
                <MenuItem value="Low">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>🌱</span>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Low Priority</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="Medium">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>⚡</span>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Medium Priority</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="High">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>🔥</span>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>High Priority</Typography>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>

            {/* Current Status */}
            <FormControl fullWidth>
              <InputLabel sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Current Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Current Status"
                startAdornment={
                  <InputAdornment position="start">
                    <StatusIcon color="action" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  </InputAdornment>
                }
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  '& .MuiSelect-select': {
                    py: { xs: 1, sm: 1.25 }
                  }
                }}
              >
                <MenuItem value="Pending">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>⏳</span>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Pending</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="In Progress">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>🔄</span>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>In Progress</Typography>
                  </Stack>
                </MenuItem>
                <MenuItem value="Completed">
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <span>✅</span>
                    <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>Completed</Typography>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 }, 
        pt: { xs: 1.5, sm: 2 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1, sm: 0 }
      }}>
        <Button
          onClick={handleClose}
          startIcon={<CancelIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
          disabled={loading}
          sx={{ 
            mr: { xs: 0, sm: 1 },
            width: { xs: '100%', sm: 'auto' },
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.9rem', sm: '0.95rem' }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<SaveIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
          disabled={loading || !formData.title || !formData.dueDate}
          sx={{
            minWidth: { xs: 'auto', sm: 120 },
            width: { xs: '100%', sm: 'auto' },
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
            }
          }}
        >
          {loading ? 'Saving...' : (editingTask ? 'Update Task' : 'Create Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

TaskFormModal.displayName = 'TaskFormModal';

export default TaskFormModal;