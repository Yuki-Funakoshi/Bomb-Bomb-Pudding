
import React from 'react';

interface MessageLogProps {
  message: string;
}

const MessageLog: React.FC<MessageLogProps> = ({ message }) => {
  return (
    <div className="p-4 bg-gray-800 border-2 border-gray-700 rounded-lg h-28 flex items-center justify-center">
        <p className="text-center text-indigo-300 italic">{message}</p>
    </div>
  );
};

export default MessageLog;
