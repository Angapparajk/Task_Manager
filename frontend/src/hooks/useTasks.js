import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { useAuth } from '../contexts/AuthContext'

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { api, isAuthenticated } = useAuth()

  // Fetch all tasks
  const fetchTasks = async (currentFilters = filters) => {
    if (!isAuthenticated || !api) return;
    
    try {
      setLoading(true)
      setError(null)
      const tasksData = await taskService.getAllTasks(api, currentFilters)
      setTasks(tasksData)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching tasks. Please check your connection.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Add a new task
  const addTask = async (taskData) => {
    if (!api) {
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true)
      setError(null)
      const newTask = await taskService.createTask(api, taskData)
      
      // Add the new task to the current list instead of refetching all
      setTasks(prevTasks => [newTask, ...prevTasks])
      
      return { success: true, message: 'Task added successfully!' }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error adding task'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Update a task
  const updateTask = async (taskId, taskData) => {
    if (!api) {
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true)
      setError(null)
      const updatedTask = await taskService.updateTask(api, taskId, taskData)
      
      // Update the task in the current list
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      )
      
      return { success: true, message: 'Task updated successfully!' }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating task'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Delete a task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return { success: false, message: 'Deletion cancelled' }
    }

    if (!api) {
      throw new Error('Not authenticated');
    }

    try {
      setLoading(true)
      setError(null)
      await taskService.deleteTask(api, taskId)
      
      // Remove the task from the current list
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId))
      
      return { success: true, message: 'Task deleted successfully!' }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting task'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Load tasks when authenticated and filters change
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks(filters)
    }
  }, [isAuthenticated, JSON.stringify(filters)])

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    refetchTasks: fetchTasks
  }
}