import React, { useState } from 'react';

const StreamInput = ({ onAddStream }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic RTSP URL validation
        const rtspRegex = /^rtsp:\/\/[^\s\/]+(\/[^\s]*)?$/;
        if (!url.trim()) {
            setError('Please enter an RTSP URL');
            return;
        }
        if (!rtspRegex.test(url)) {
            setError('Invalid RTSP URL format');
            return;
        }

        onAddStream({ id: Date.now(), url });
        setUrl('');
        setError('');
    };

    return (
        <div className="stream-input" style={{ marginBottom: '20px' }}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setError('');
                    }}
                    placeholder="Enter RTSP URL (e.g., rtsp://username:password@host:port/path)"
                    style={{ width: '400px', padding: '8px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '8px 16px' }}>
                    Add Stream
                </button>
                {error && <p style={{ color: 'red', marginTop: '5px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default StreamInput;