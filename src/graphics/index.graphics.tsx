import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './index.graphics.css'; 

const Index = () => {
  return <div>Hello world!</div>;
};
     
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Index />);
