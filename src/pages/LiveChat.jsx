import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Clock } from 'lucide-react';

const LiveChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Selamat datang di live chat! Ada yang bisa saya bantu?",
      sender: "admin",
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [isUserNameSet, setIsUserNameSet] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulasi balasan otomatis setelah 1 detik
    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        text: "Terima kasih atas pesan Anda! Tim kami akan segera membalas.",
        sender: "admin",
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleSetUserName = (e) => {
    e.preventDefault();
    if (userName.trim() === '') return;
    setIsUserNameSet(true);
    
    const welcomeMessage = {
      id: messages.length + 1,
      text: `Halo ${userName}! Senang bertemu dengan Anda. Silakan ajukan pertanyaan atau sampaikan keluhan Anda.`,
      sender: "admin",
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  if (!isUserNameSet) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-gray-600 mt-2">Silakan masukkan nama Anda untuk memulai chat</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Masukkan nama Anda..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSetUserName(e)}
          />
          <button
            onClick={handleSetUserName}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Mulai Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Live Chat Support</h3>
            <p className="text-sm text-blue-100">Online • Tim Customer Service</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <div className={`flex items-center mt-1 space-x-1 ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}>
                <Clock className="w-3 h-3 opacity-60" />
                <span className="text-xs opacity-60">{message.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="mb-2">
          <span className="text-xs text-gray-500">Chatting sebagai: </span>
          <span className="text-xs font-medium text-blue-600">{userName}</span>
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-100 text-center">
        <p className="text-xs text-gray-500">
          Powered by Live Chat System • Aktif 24/7
        </p>
      </div>
    </div>
  );
};

export default LiveChat;