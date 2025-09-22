import React from 'react';

const Loading = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}>
          <div style={styles.innerSpinner}></div>
        </div>
      </div>
      <p style={styles.text}>Loading your content</p>
      <div style={styles.dotsContainer}>
        <span style={styles.dot}></span>
        <span style={styles.dot}></span>
        <span style={styles.dot}></span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '3px solid rgba(99, 102, 241, 0.2)',
    borderRadius: '50%',
    position: 'relative',
    animation: 'rotate 1.8s linear infinite',
  },
  innerSpinner: {
    content: '""',
    position: 'absolute',
    top: '-3px',
    left: '-3px',
    width: '100%',
    height: '100%',
    border: '3px solid transparent',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'rotate 1.2s cubic-bezier(0.5, 0.1, 0.5, 1) infinite',
  },
  text: {
    color: '#4b5563',
    fontSize: '1.2rem',
    fontWeight: '500',
    marginBottom: '1rem',
    letterSpacing: '0.5px',
  },
  dotsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: '10px',
    height: '10px',
    margin: '0 4px',
    backgroundColor: '#6366f1',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.5s infinite ease-in-out',
  },
};

// Add styles to the document head
const styleSheet = document.createElement('style');
styleSheet.innerText = `
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    0%, 100% { 
      transform: translateY(0);
      opacity: 0.4;
    }
    50% { 
      transform: translateY(-15px);
      opacity: 1;
    }
  }
  
  div > div:nth-child(1) > div {
    animation-delay: -0.45s;
  }
  
  div > div:nth-child(1) > div > div {
    animation-delay: -0.3s;
  }
  
  div > div:nth-child(3) > span:nth-child(1) {
    animation-delay: -0.32s;
  }
  
  div > div:nth-child(3) > span:nth-child(2) {
    animation-delay: -0.16s;
  }
`;
document.head.appendChild(styleSheet);

export default Loading;