import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  LinearProgress,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import {
  Assignment as TaskIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CompletedIcon,
  Schedule as PendingIcon,
  Loop as InProgressIcon,
  Warning as WarningIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Components
import { TaskList, TaskFilters, NotificationModal } from './index';
import Layout from './Layout';
import TaskFormModal from './TaskFormModal';

// Custom hooks
import { useTasks } from '../hooks/useTasks';

const Dashboard = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [editingTask, setEditingTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notification, setNotification] = useState({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });
  
  // Filter states for TaskFilters
  const [filteredActiveTasks, setFilteredActiveTasks] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterApplied, setActiveFilterApplied] = useState(false);
  
  const {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refetchTasks
  } = useTasks();
  
  const formRef = useRef(null);

  // Helper function to check if a task is overdue
  const isTaskOverdue = (task) => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'Completed';
  };

  // Filter to show only active tasks (not completed and not overdue) and sort by due date
  const activeTasks = tasks
    .filter(task => task.status !== 'Completed' && !isTaskOverdue(task))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Handle filter change from TaskFilters
  const handleFilterChange = (filter, filterType) => {
    if (filter === 'All') {
      setFilteredActiveTasks([]);
      setActiveFilterApplied(false);
    } else {
      let filtered = [];
      
      if (filterType === 'status') {
        filtered = activeTasks.filter(task => task.status === filter);
      } else if (filterType === 'priority') {
        filtered = activeTasks.filter(task => task.priority === filter);
      }
      
      // Sort filtered tasks by due date (nearest first)
      filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      setFilteredActiveTasks(filtered);
      setActiveFilterApplied(true);
    }
  };

  // Use filtered tasks if filters are applied, otherwise use all active tasks
  const displayTasks = activeFilterApplied && showFilters ? filteredActiveTasks : activeTasks;
  
  // Get task statistics
  const getTaskStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
    const overdueTasks = tasks.filter(task => isTaskOverdue(task)).length;

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      overdue: overdueTasks,
      active: activeTasks.length,
      completionRate
    };
  };

  const stats = getTaskStats();

  // Show notification helper
  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Hide notification helper
  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Handle task creation/editing
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
      formRef.current?.resetForm();
      setModalOpen(false);
    } catch (error) {
      showNotification(error.message || 'An error occurred', 'error');
    }
  };

  // Handle task edit
  const onEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Handle task delete
  const onDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      showNotification('Task deleted successfully!', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete task', 'error');
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setEditingTask(null);
    setModalOpen(false);
  };

  // Handle add task button click
  const handleAddTaskClick = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card 
      elevation={1}
      sx={{ 
        height: '100%',
        minHeight: { xs: '80px', sm: '90px' },
        background: `linear-gradient(135deg, ${color}10 0%, ${color}03 100%)`,
        border: `1px solid ${color}20`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-2px)' },
          boxShadow: { xs: 2, sm: 3 }
        }
      }}
    >
      <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
        <Stack 
          direction="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          spacing={{ xs: 0.25, sm: 0.5 }}
          sx={{ height: '100%' }}
        >
          {/* Icon */}
          <Box sx={{ 
            color: color, 
            opacity: 0.8,
            mb: { xs: 0.25, sm: 0.5 }
          }}>
            {React.cloneElement(icon, { 
              sx: { fontSize: { xs: 20, sm: 24 } } 
            })}
          </Box>
          <Typography 
            variant={{ xs: 'h5', sm: 'h4' }} 
            fontWeight={700} 
            color={color}
            sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
          >
            {value}
          </Typography>
          <Typography 
            variant="caption"
            color="text.primary" 
            fontWeight={500}
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              lineHeight: 1.2
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.6rem', sm: '0.7rem' },
                display: { xs: 'none', sm: 'block' },
                lineHeight: 1.2
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Layout title="Dashboard">
      <Container maxWidth="xl" sx={{ py: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
        {/* Welcome Header */}
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
              Welcome back, {user?.name || 'User'}! 👋
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
            Here's your task overview and active tasks
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box
          sx={{
            maxWidth: { sm: '100%', lg: '60%', xl: '50%' },
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'  
            },
            gap: 2,
            mb: { xs: 3, sm: 4 }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: { lg: 180, xl: 160 } }}>
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={<TaskIcon sx={{ fontSize: 40 }} />}
              color={theme.palette.primary.main}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: { lg: 180, xl: 160 } }}>
            <StatCard
              title="Active Tasks"
              value={stats.active}
              icon={<InProgressIcon sx={{ fontSize: 40 }} />}
              color={theme.palette.info.main}
              subtitle="Current tasks (not overdue)"
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: { lg: 180, xl: 160 } }}>
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={<CompletedIcon sx={{ fontSize: 40 }} />}
              color={theme.palette.success.main}
              subtitle={`${stats.completionRate}% completion rate`}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: { lg: 180, xl: 160 } }}>
            <StatCard
              title="Overdue"
              value={stats.overdue}
              icon={<WarningIcon sx={{ fontSize: 40 }} />}
              color={theme.palette.error.main}
              subtitle="Need attention"
            />
          </Box>
        </Box>

        {/* Progress Overview */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: { xs: 1.5, sm: 2 } }}>
            <TrendingIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
            <Typography 
              variant="h6" 
              fontWeight={600}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Progress Overview
            </Typography>
          </Stack>
          
          <Stack spacing={{ xs: 1.5, sm: 2 }}>
            {/* Overall Completion Progress */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  Overall Completion
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
                >
                  {stats.completionRate}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={stats.completionRate} 
                sx={{ height: { xs: 6, sm: 8 }, borderRadius: 4 }}
              />
            </Box>

            {/* Status Breakdown - Grid for Mobile */}
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                Task Status Breakdown
              </Typography>
              
              {/* Mobile: Use Grid, Desktop: Use Chips */}
              <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        backgroundColor: 'warning.light',
                        color: 'warning.contrastText'
                      }}
                    >
                      <PendingIcon sx={{ fontSize: 16, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block' }}>
                        {stats.pending} Pending
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        backgroundColor: 'info.light',
                        color: 'info.contrastText'
                      }}
                    >
                      <InProgressIcon sx={{ fontSize: 16, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block' }}>
                        {stats.inProgress} In Progress
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        backgroundColor: 'success.light',
                        color: 'success.contrastText'
                      }}
                    >
                      <CompletedIcon sx={{ fontSize: 16, mb: 0.5 }} />
                      <Typography variant="caption" sx={{ fontSize: '0.7rem', display: 'block' }}>
                        {stats.completed} Completed
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>

              {/* Desktop: Use Original Chips */}
              <Stack 
                direction="row" 
                spacing={2} 
                flexWrap="wrap" 
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <Chip 
                  label={`${stats.pending} Pending`} 
                  color="warning" 
                  size="small" 
                  icon={<PendingIcon />}
                />
                <Chip 
                  label={`${stats.inProgress} In Progress`} 
                  color="info" 
                  size="small" 
                  icon={<InProgressIcon />}
                />
                <Chip 
                  label={`${stats.completed} Completed`} 
                  color="success" 
                  size="small" 
                  icon={<CompletedIcon />}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>

        {/* Active Tasks Section */}
        <Box>
          {/* Filter Toggle Button */}
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                const newShowFilters = !showFilters;
                setShowFilters(newShowFilters);
                if (!newShowFilters) {
                  // Reset filters when hiding
                  setFilteredActiveTasks([]);
                  setActiveFilterApplied(false);
                }
              }}
              sx={{ borderRadius: 2 }}
            >
              {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </Button>
          </Box>

          {/* Task Filters - Outside TaskList */}
          {showFilters && (
            <TaskFilters
              tasks={activeTasks}
              onFilterChange={handleFilterChange}
              loading={loading}
              excludeStatus={['Completed']}
            />
          )}

          {/* Task List */}
          <TaskList
            tasks={displayTasks}
            onEdit={onEdit}
            onDelete={onDelete}
            loading={loading}
            title="Active Tasks"
          />
        </Box>

        {/* Task Form Modal */}
        <TaskFormModal
          ref={formRef}
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

export default Dashboard;