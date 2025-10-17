const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>
          <span className="header-icon">�</span>
          Task Manager
          <span className="header-accent">Pro</span>
        </h1>
        <p>Manage your daily tasks with style and efficiency</p>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-icon">⚡</span>
            <span className="stat-text">Fast & Responsive</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🎨</span>
            <span className="stat-text">Beautiful Design</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📱</span>
            <span className="stat-text">Mobile Friendly</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header