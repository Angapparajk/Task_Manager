// Task service functions that use the authenticated API from AuthContext
// The actual API calls are made through the useAuth context's api instance

export const taskService = {
  // Get all tasks
  getAllTasks: async (api, filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filter parameters
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const queryString = params.toString();
      const url = queryString ? `/tasks?${queryString}` : '/tasks';
      
      const response = await api.get(url);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch tasks');
      }
    } catch (error) {
      throw error;
    }
  },

  // Create a new task
  createTask: async (api, taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create task');
      }
    } catch (error) {
      throw error;
    }
  },

  // Update a task
  updateTask: async (api, taskId, taskData) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update task');
      }
    } catch (error) {
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (api, taskId) => {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete task');
      }
    } catch (error) {
      throw error;
    }
  },
}

export default taskService;