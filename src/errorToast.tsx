// CustomErrorToast.tsx
import React from 'react';

interface CustomErrorToastProps {
  message: string;
  gifUrl: string;
}

const CustomErrorToast: React.FC<CustomErrorToastProps> = ({ message, gifUrl }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img src={gifUrl} alt="Error" style={{ width: '300px', height: '300px', marginRight: '10px' }} />
    <span>{message}</span>
  </div>
);

export default CustomErrorToast;
