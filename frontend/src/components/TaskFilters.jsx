import { useState } from 'react'

// Material-UI Components
import {
  Paper,
  Box,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Grid,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  List as ListIcon,
  Assessment as StatusIcon,
  PriorityHigh as PriorityIcon,
  CheckCircle as CompletedIcon,
  Loop as InProgressIcon,
  Schedule as PendingIcon,
  Warning as OverdueIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';

const TaskFilters = ({ tasks, onFilterChange, loading, excludeStatus = [] }) => {
  const [filterType, setFilterType] = useState('status') // 'status' or 'priority'
  const [activeFilter, setActiveFilter] = useState('All')

  // Get task statistics
  const getTaskStats = () => {
    const total = tasks.length
    
    // Status statistics
    const completed = tasks.filter(task => task.status === 'Completed').length
    const inProgress = tasks.filter(task => task.status === 'In Progress').length
    const pending = tasks.filter(task => task.status === 'Pending').length
    const overdue = tasks.filter(task => {
      const dueDate = new Date(task.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return dueDate < today && task.status !== 'Completed'
    }).length

    // Priority statistics
    const high = tasks.filter(task => task.priority === 'High').length
    const medium = tasks.filter(task => task.priority === 'Medium').length
    const low = tasks.filter(task => task.priority === 'Low').length

    return {
      total,
      completed,
      inProgress,
      pending,
      overdue,
      high,
      medium,
      low
    }
  }

  const stats = getTaskStats()

  // Handle filter type change
  const handleFilterTypeChange = (type) => {
    setFilterType(type)
    setActiveFilter('All')
    if (onFilterChange) {
      onFilterChange('All', type)
    }
  }

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter)
    if (onFilterChange) {
      onFilterChange(filter, filterType)
    }
  }

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Filter Header */}
      <Stack spacing={3}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <ListIcon color="primary" />
          <Typography 
            variant="h6" 
            component="h3" 
            fontWeight={600} 
            color="text.primary"
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            Advanced Filters
          </Typography>
          {activeFilter !== 'All' && (
            <Chip
              label={`Active: ${activeFilter}`}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            />
          )}
        </Stack>

        {/* Filter Controls */}
        <Stack spacing={2}>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }} 
            spacing={2}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={1}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <Button
                startIcon={<StatusIcon />}
                onClick={() => handleFilterTypeChange('status')}
                variant={filterType === 'status' ? 'contained' : 'outlined'}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  minHeight: { xs: 44, sm: 36 },
                  fontSize: { xs: '0.9rem', sm: '0.875rem' },
                  flex: { xs: 1, sm: 'none' },
                }}
              >
                By Status
              </Button>
              <Button
                startIcon={<PriorityIcon />}
                onClick={() => handleFilterTypeChange('priority')}
                variant={filterType === 'priority' ? 'contained' : 'outlined'}
                size="small"
                sx={{ 
                  borderRadius: 2,
                  minHeight: { xs: 44, sm: 36 },
                  fontSize: { xs: '0.9rem', sm: '0.875rem' },
                  flex: { xs: 1, sm: 'none' },
                }}
              >
                By Priority
              </Button>
            </Stack>
            
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Filter by {filterType}:
              </Typography>
              <Chip 
                label={activeFilter} 
                color="primary" 
                size="small" 
                variant="outlined"
              />
            </Stack>
          </Stack>

          {/* Task Statistics */}
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                variant={activeFilter === 'All' ? 'contained' : 'outlined'}
                onClick={() => handleFilterChange('All')}
                sx={{
                  flexDirection: 'column',
                  py: 1.5,
                  borderRadius: 2,
                  minHeight: 72,
                  '&:hover': { transform: 'translateY(-1px)' },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <StatsIcon fontSize="small" sx={{ mb: 0.5 }} />
                <Typography variant="h6" fontWeight={700}>
                  {stats.total}
                </Typography>
                <Typography variant="caption">
                  All Tasks
                </Typography>
              </Button>
            </Grid>

            {filterType === 'status' ? (
              <>
                {!excludeStatus.includes('Completed') && (
                  <Grid item xs={6} sm={3} md={2}>
                    <Button
                      fullWidth
                      variant={activeFilter === 'Completed' ? 'contained' : 'outlined'}
                      color="success"
                      onClick={() => handleFilterChange('Completed')}
                      sx={{
                        flexDirection: 'column',
                        py: 1.5,
                        borderRadius: 2,
                        minHeight: 72,
                        '&:hover': { transform: 'translateY(-1px)' },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <CompletedIcon fontSize="small" sx={{ mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={700}>
                        {stats.completed}
                      </Typography>
                      <Typography variant="caption">
                        Completed
                      </Typography>
                    </Button>
                  </Grid>
                )}

                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'In Progress' ? 'contained' : 'outlined'}
                    color="info"
                    onClick={() => handleFilterChange('In Progress')}
                    sx={{
                      flexDirection: 'column',
                      py: 1.5,
                      borderRadius: 2,
                      minHeight: 72,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <InProgressIcon fontSize="small" sx={{ mb: 0.5 }} />
                    <Typography variant="h6" fontWeight={700}>
                      {stats.inProgress}
                    </Typography>
                    <Typography variant="caption">
                      In Progress
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'Pending' ? 'contained' : 'outlined'}
                    color="warning"
                    onClick={() => handleFilterChange('Pending')}
                    sx={{
                      flexDirection: 'column',
                      py: 1.5,
                      borderRadius: 2,
                      minHeight: 72,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <PendingIcon fontSize="small" sx={{ mb: 0.5 }} />
                    <Typography variant="h6" fontWeight={700}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="caption">
                      Pending
                    </Typography>
                  </Button>
                </Grid>

                {stats.overdue > 0 && (
                  <Grid item xs={6} sm={3} md={2}>
                    <Button
                      fullWidth
                      variant={activeFilter === 'Overdue' ? 'contained' : 'outlined'}
                      color="error"
                      onClick={() => handleFilterChange('Overdue')}
                      sx={{
                        flexDirection: 'column',
                        py: 1.5,
                        borderRadius: 2,
                        minHeight: 72,
                        '&:hover': { transform: 'translateY(-1px)' },
                        transition: 'all 0.2s ease-in-out',
                      }}
                    >
                      <OverdueIcon fontSize="small" sx={{ mb: 0.5 }} />
                      <Typography variant="h6" fontWeight={700}>
                        {stats.overdue}
                      </Typography>
                      <Typography variant="caption">
                        Overdue
                      </Typography>
                    </Button>
                  </Grid>
                )}
              </>
            ) : (
              <>
                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'High' ? 'contained' : 'outlined'}
                    color="error"
                    onClick={() => handleFilterChange('High')}
                    sx={{
                      flexDirection: 'column',
                      py: 1.5,
                      borderRadius: 2,
                      minHeight: 72,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 0.5 }}>🔥</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stats.high}
                    </Typography>
                    <Typography variant="caption">
                      High Priority
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'Medium' ? 'contained' : 'outlined'}
                    color="warning"
                    onClick={() => handleFilterChange('Medium')}
                    sx={{
                      flexDirection: 'column',
                      py: 1.5,
                      borderRadius: 2,
                      minHeight: 72,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 0.5 }}>⚡</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stats.medium}
                    </Typography>
                    <Typography variant="caption">
                      Medium Priority
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={6} sm={3} md={2}>
                  <Button
                    fullWidth
                    variant={activeFilter === 'Low' ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => handleFilterChange('Low')}
                    sx={{
                      flexDirection: 'column',
                      py: 1.5,
                      borderRadius: 2,
                      minHeight: 72,
                      '&:hover': { transform: 'translateY(-1px)' },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 0.5 }}>🌱</Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {stats.low}
                    </Typography>
                    <Typography variant="caption">
                      Low Priority
                    </Typography>
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default TaskFilters