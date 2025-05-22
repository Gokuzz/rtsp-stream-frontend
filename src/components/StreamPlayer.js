import React, { useEffect, useRef } from 'react';
import * as mpegts from 'mpegts.js';
import './StreamPlayer.css'; // import the CSS

const StreamPlayer = ({ stream, onRemove }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const isRemoved = useRef(false);

    useEffect(() => {
        if (mpegts.getFeatureList().mseLivePlayback && videoRef.current) {
            const rtspUrl = encodeURIComponent(stream.url);
            const player = mpegts.createPlayer({
                type: 'mpegts',
                isLive: true,
                url: `wss://rtsp-stream-backend-1.onrender.com/ws/stream/${stream.id}/?rtsp=${rtspUrl}`,
            }, {
                enableWorker: true,
                liveBufferLatencyChasing: true,
                liveBufferLatencyMax: 0.3, // Lower = lower delay
                liveBufferLatencyMin: 0.1,
                autoCleanupSourceBuffer: true,
                enableStashBuffer: false,
                stashInitialSize: 128,
            });

            playerRef.current = player;
            player.attachMediaElement(videoRef.current);
            player.load();
            player.play().catch((err) => {
                console.error('Player play error:', err);
            });

            return () => {
                player.destroy();
                playerRef.current = null;
            };
        }
    }, [stream.id]);

    const handleRemove = () => {
        if (!isRemoved.current) {
            isRemoved.current = true;
            onRemove(stream.id);
        }
    };

    return (
        <div className="stream-card">
            <video
                ref={videoRef}
                autoPlay
                muted
                controls
                className="stream-video"
            />
            <button className="remove-btn" onClick={handleRemove}>
                ✖ Remove Stream
            </button>
        </div>
    );
};

export default React.memo(StreamPlayer, (prevProps, nextProps) => {
    return (
        prevProps.stream.id === nextProps.stream.id &&
        prevProps.stream.url === nextProps.stream.url
    );
});

