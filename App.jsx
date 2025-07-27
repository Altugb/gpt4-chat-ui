import React, { useState } from 'react';

export default function GPT4Chat() {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!apiKey || !input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo',
          messages: newMessages,
        }),
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message;
      if (reply) setMessages([...newMessages, reply]);
    } catch (err) {
      alert('API isteği başarısız: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-bold">GPT-4 API Chat</h1>
      <input
        className="w-full p-2 border rounded"
        placeholder="OpenAI API Key (sk-...)"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        type="password"
      />
      <div className="border rounded p-4 h-96 overflow-y-auto bg-gray-50 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
            <span className="block text-sm font-bold">
              {msg.role === 'user' ? 'Sen' : 'GPT-4'}:
            </span>
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>
      <textarea
        className="w-full p-2 border rounded"
        rows={3}
        placeholder="Mesajını yaz..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Gönderiliyor...' : 'Gönder'}
      </button>
    </div>
  );
}
