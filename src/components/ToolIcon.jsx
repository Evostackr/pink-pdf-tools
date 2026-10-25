import React from 'react';
import * as Icons from 'lucide-react';

export default function ToolIcon({ name, size = 22, color, strokeWidth = 2, className = '' }) {
  const IconComponent = Icons[name] || Icons.FileText;
  return <IconComponent size={size} color={color} strokeWidth={strokeWidth} className={className} />;
}
