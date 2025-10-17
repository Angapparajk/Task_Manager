import { useState, useRef } from 'react'
import './App.css'

// Components
import { Header, TaskForm, TaskList, NotificationModal } from './components'

// Custom hooks
import { useTasks } from './hooks/useTasks'

function App() {
  const [editingTask, setEditingTask] = useState(null)
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false })
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks()
  const formRef = useRef(null)

  // Show notification helper
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, isVisible: true })
  }

  // Hide notification helper
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  // Scroll to form smoothly with highlight animation
  const scrollToForm = () => {
    if (formRef.current) {
      // Scroll to the form
      if (formRef.current.scrollIntoView) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }
      
      // Add highlight class for animation
      const formElement = formRef.current.current || formRef.current
      if (formElement && formElement.classList) {
        formElement.classList.add('editing-focus')
        
        // Remove the class after animation completes
        setTimeout(() => {
          if (formElement && formElement.classList) {
            formElement.classList.remove('editing-focus')
          }
        }, 1500)
      }
    }
  }

  // Handle form submission for adding tasks
  const handleAddTask = async (formData) => {
    const result = await addTask(formData)
    if (result.success) {
      // Reset the form after successful task creation
      if (formRef.current && formRef.current.resetForm) {
        formRef.current.resetForm()
      }
      showNotification(result.message, 'success')
    } else {
      showNotification(result.message, 'error')
    }
  }

  // Handle form submission for updating tasks
  const handleUpdateTask = async (formData) => {
    if (!editingTask) return

    const result = await updateTask(editingTask._id, formData)
    if (result.success) {
      setEditingTask(null)
      // Reset the form after successful task update
      if (formRef.current && formRef.current.resetForm) {
        formRef.current.resetForm()
      }
      showNotification(result.message, 'success')
    } else {
      showNotification(result.message, 'error')
    }
  }

  // Start editing a task
  const handleEditTask = (task) => {
    setEditingTask(task)
    // Scroll to form after a small delay to ensure state updates first
    setTimeout(() => {
      scrollToForm()
    }, 100)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingTask(null)
    // Reset the form when canceling edit
    if (formRef.current && formRef.current.resetForm) {
      formRef.current.resetForm()
    }
  }

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    const result = await deleteTask(taskId)
    if (result.success) {
      showNotification(result.message, 'success')
    } else if (result.message !== 'Deletion cancelled') {
      showNotification(result.message, 'error')
    }
  }

  return (
    <div className="app">
      <Header />

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="app-content">
        <TaskForm
          ref={formRef}
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          editingTask={editingTask}
          onCancel={handleCancelEdit}
          loading={loading}
          showNotification={showNotification}
        />

        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          loading={loading}
        />
      </div>

      {/* Notification Modal */}
      <NotificationModal
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  )
}

export default App
