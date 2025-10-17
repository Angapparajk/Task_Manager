import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../hooks/useTasks';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Fab,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Assignment as TaskIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Loop as InProgressIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { TaskList, NotificationModal } from './';
import Layout from './Layout';
import TaskFormModal from './TaskFormModal';

const Tasks = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [modalOpen, setModalOpen] = useState(false);
  
  // Priority filter states
  const [showPriorityFilters, setShowPriorityFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  const {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetchTasks
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);
  const taskFormRef = useRef(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Helper function to check if a task is overdue
  const isTaskOverdue = (task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'Completed';
  };

  // Get tasks by categories
  const getTasksByCategory = () => {
    let allTasks = [...tasks];

    // Apply search filter
    if (searchTerm) {
      allTasks = allTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'All') {
      allTasks = allTasks.filter(task => task.priority === priorityFilter);
    }

    // Sort tasks
    allTasks.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        default:
          return 0;
      }
    });

    // Categorize tasks
    const activeTasks = allTasks.filter(task => 
      task.status !== 'Completed' && !isTaskOverdue(task)
    );
    
    const overdueTasks = allTasks.filter(task => isTaskOverdue(task));
    
    const completedTasks = allTasks.filter(task => task.status === 'Completed');

    return {
      active: activeTasks,
      overdue: overdueTasks,
      completed: completedTasks,
      total: allTasks.length
    };
  };

  const taskCategories = getTasksByCategory();

  const onSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        showNotification('Task updated successfully!', 'success');
        setEditingTask(null);
      } else {
        await addTask(taskData);
        showNotification('Task created successfully!', 'success');
      }
      taskFormRef.current?.resetForm();
      setModalOpen(false);
    } catch (error) {
      showNotification(error.message || 'An error occurred', 'error');
    }
  };

  const onEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const onDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      showNotification('Task deleted successfully!', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete task', 'error');
    }
  };

  const handleModalClose = () => {
    setEditingTask(null);
    setModalOpen(false);
  };

  const handleAddTaskClick = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  return (
    <Layout title="All Tasks">
      <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
        {/* Header */}
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            justifyContent="space-between" 
            spacing={{ xs: 1.5, sm: 0 }}
            sx={{ mb: 0.5 }}
          >
            <Typography
              variant={{ xs: 'h5', sm: 'h4' }}
              component="h1"
              sx={{
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.25rem', sm: '1.75rem' },
                lineHeight: { xs: 1.3, sm: 1.2 }
              }}
            >
              Task Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTaskClick}
              size="small"
              sx={{
                borderRadius: 2,
                px: { xs: 2, sm: 2 },
                py: { xs: 0.75, sm: 1 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
                minWidth: { xs: 'auto', sm: 'auto' },
                alignSelf: { xs: 'flex-start', sm: 'auto' },
                width: { xs: 'auto', sm: 'auto' },
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Add Task
            </Button>
          </Stack>
          <Typography 
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            Manage all your tasks - past, present, future, and overdue
          </Typography>
        </Box>

        {/* Filters */}
        <Paper elevation={1} sx={{ p: { xs: 1.5, sm: 2 }, mb: { xs: 1.5, sm: 2 } }}>
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="center">
            <Grid item xs={12} sm={8} md={8}>
              <TextField
                fullWidth
                placeholder="Search tasks by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    height: { xs: 44, sm: 56 }
                  }
                }}
              />
            </Grid>
            {/* <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="dueDate">Due Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('dueDate');
                  setPriorityFilter('All');
                }}
                sx={{ height: 56 }}
              >
                Clear
              </Button>
            </Grid> */}
            <Grid item xs={12} sm={4} md={4}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setShowPriorityFilters(!showPriorityFilters)}
                sx={{ 
                  height: { xs: 44, sm: 56 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {showPriorityFilters ? 'Hide Filters' : 'Priority Filter'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Priority Filters */}
        {showPriorityFilters && (
          <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
            <Typography 
              variant={{ xs: 'subtitle1', sm: 'h6' }} 
              sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Filter by Priority
            </Typography>
            <Stack 
              direction="row" 
              spacing={{ xs: 1, sm: 2 }} 
              flexWrap="wrap"
              sx={{ gap: { xs: 1, sm: 2 } }}
            >
              <Button
                variant={priorityFilter === 'All' ? 'contained' : 'outlined'}
                onClick={() => setPriorityFilter('All')}
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 }
                }}
              >
                All Priorities
              </Button>
              <Button
                variant={priorityFilter === 'High' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => setPriorityFilter('High')}
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 }
                }}
              >
                🔥 High
              </Button>
              <Button
                variant={priorityFilter === 'Medium' ? 'contained' : 'outlined'}
                color="warning"
                onClick={() => setPriorityFilter('Medium')}
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 }
                }}
              >
                ⚡ Medium
              </Button>
              <Button
                variant={priorityFilter === 'Low' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => setPriorityFilter('Low')}
                sx={{ 
                  borderRadius: 2,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 }
                }}
              >
                🌱 Low
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Active Tasks Section */}
        {taskCategories.active.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
            <TaskList
              tasks={taskCategories.active}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
              title="Active Tasks"
            />
          </Box>
        )}

        {/* Overdue Tasks Section */}
        {taskCategories.overdue.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
            <TaskList
              tasks={taskCategories.overdue}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
              title="Overdue Tasks"
            />
          </Box>
        )}

        {/* Completed Tasks Section */}
        {taskCategories.completed.length > 0 && (
          <Box sx={{ mb: { xs: 2, sm: 2.5 } }}>
            <TaskList
              tasks={taskCategories.completed}
              onEdit={onEdit}
              onDelete={onDelete}
              loading={loading}
              title="Completed Tasks"
            />
          </Box>
        )}

        {/* Loading State */}
        {loading && (
          <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <CircularProgress size={48} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Loading Tasks...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we fetch your tasks
            </Typography>
          </Paper>
        )}

        {/* Empty State */}
        {!loading && taskCategories.total === 0 && (
          <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm || priorityFilter !== 'All' 
                ? 'Try adjusting your search or filters.'
                : 'Start by creating your first task!'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTaskClick}
              sx={{ borderRadius: 2 }}
            >
              Add Task
            </Button>
          </Paper>
        )}

        {/* Task Form Modal */}
        <TaskFormModal
          ref={taskFormRef}
          open={modalOpen}
          onClose={handleModalClose}
          onSubmit={onSubmit}
          editingTask={editingTask}
          loading={loading}
          showNotification={showNotification}
        />

        {/* Mobile Floating Action Button */}
        <Fab
          color="primary"
          onClick={handleAddTaskClick}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: { xs: 'flex', sm: 'none' },
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            },
            zIndex: 1000
          }}
        >
          <AddIcon />
        </Fab>

        {/* Notification */}
        <NotificationModal
          open={notification.open}
          message={notification.message}
          severity={notification.severity}
          onClose={closeNotification}
        />
      </Container>
    </Layout>
  );
};

export default Tasks;