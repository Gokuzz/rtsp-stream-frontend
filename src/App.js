import React, { useState, useEffect, useCallback } from 'react';
import StreamPlayer from './components/StreamPlayer';
import './App.css';

function App() {
    const [streams, setStreams] = useState([]);
    const [newStream, setNewStream] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    // Define the WebSocket URL - this should match your backend server address
    const websocketUrl = 'ws://rtsp-stream-backend-1.onrender.com'; // Update this to match your server

    // Function to add a new stream
    const addStream = useCallback(() => {
        if (!newStream || newStream.trim() === '') {
            alert('Please enter a valid RTSP URL');
            return;
        }

        // Validate URL format (basic check)
        if (!newStream.startsWith('rtsp://')) {
            alert('URL must start with "rtsp://"');
            return;
        }

        setIsAdding(true);

        try {
            const streamId = Date.now();
            console.log(`Adding new stream with ID: ${streamId} at ${new Date().toISOString()}`);
            
            // Add the stream to state
            setStreams(prevStreams => {
                // Check if URL already exists
                // const duplicate = prevStreams.find(s => s.url === newStream);
                // if (duplicate) {
                //     alert(`This stream URL is already added (ID: ${duplicate.id})`);
                //     return prevStreams;
                // }
                
                return [...prevStreams, {
                    id: streamId,
                    url: newStream
                }];
            });
            
            // Clear input
            setNewStream('');
        } catch (error) {
            console.error('Error adding stream:', error);
            alert(`Failed to add stream: ${error.message}`);
        } finally {
            setIsAdding(false);
        }
    }, [newStream]);

    // Improved stream removal with proper cleanup
    const removeStream = useCallback((id) => {
        console.log(`Scheduling removal of stream with ID: ${id} at ${new Date().toISOString()}`);
        
        // Mark stream for removal in UI first
        setStreams(prev => 
            prev.map(s => 
                s.id === id ? { ...s, removing: true } : s
            )
        );
        
        // Then remove after a short delay to allow cleanup
        setTimeout(() => {
            setStreams(prev => {
                console.log(`Removing stream with ID: ${id} at ${new Date().toISOString()}`);
                return prev.filter(s => s.id !== id);
            });
        }, 300); // Longer delay to ensure proper cleanup
    }, []);

    // Handle enter key press in input field
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter' && !isAdding) {
            addStream();
        }
    }, [addStream, isAdding]);

    return (
        <div className="App">
            <h1>RTSP Stream Viewer</h1>
            
            <div className="add-stream-container">
                <input 
                    type="text" 
                    value={newStream} 
                    onChange={(e) => setNewStream(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter RTSP URL (e.g., rtsp://username:pass@host:port/path)"
                    disabled={isAdding}
                    className="rtsp-input"
                />
                <button 
                    onClick={addStream} 
                    disabled={isAdding || !newStream}
                    className="add-button"
                >
                    {isAdding ? 'Adding...' : 'Add Stream'}
                </button>
            </div>
            
            {streams.length === 0 && (
                <div className="no-streams">
                    <p>No streams added yet. Enter an RTSP URL above to get started.</p>
                </div>
            )}
            
            <div className="streams-container">
                {streams.map((stream) => (
                    <div 
                        className={`stream-wrapper ${stream.removing ? 'removing' : ''}`} 
                        key={stream.id}
                    >
                        <StreamPlayer 
                            stream={stream}
                            onRemove={() => removeStream(stream.id)}
                            websocketUrl={websocketUrl}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;