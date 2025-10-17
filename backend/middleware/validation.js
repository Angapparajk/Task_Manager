// Input validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  if (name && name.length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email) {
    errors.push('Email is required');
  } else if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  } else if (password.length > 128) {
    errors.push('Password cannot exceed 128 characters');
  }

  // Check password strength
  if (password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push('Email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateTaskInput = (req, res, next) => {
  const { title, description, dueDate, priority } = req.body;
  const errors = [];

  // Title validation
  if (!title || title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (title.length > 200) {
    errors.push('Task title cannot exceed 200 characters');
  }

  // Description validation (optional)
  if (description && description.length > 1000) {
    errors.push('Task description cannot exceed 1000 characters');
  }

  // Due date validation
  if (!dueDate) {
    errors.push('Due date is required');
  } else {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push('Invalid due date format');
    }
  }

  // Priority validation
  const validPriorities = ['Low', 'Medium', 'High'];
  if (!priority) {
    errors.push('Priority is required');
  } else if (!validPriorities.includes(priority)) {
    errors.push('Priority must be one of: Low, Medium, High');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

const validateProfileUpdate = (req, res, next) => {
  const { name, email } = req.body;
  const errors = [];

  // Name validation (optional)
  if (name !== undefined) {
    if (name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    if (name.length > 50) {
      errors.push('Name cannot exceed 50 characters');
    }
  }

  // Email validation (optional)
  if (email !== undefined) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateTaskInput,
  validateProfileUpdate
};