import React, { useState, useEffect, useRef } from 'react';

const MouseTracker = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    // Use current coords for the context menu handler to avoid stale closures
    const coordsRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setVisible(true);
            setMousePos({ x: e.clientX, y: e.clientY });

            const canvas = document.querySelector('.canvas');
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                // Calculate scale on the fly to be accurate
                const scaleX = rect.width / 1920;
                const scaleY = rect.height / 1080;

                // Prevent division by zero
                if (scaleX === 0 || scaleY === 0) return;

                // Calculate position relative to canvas and divide by scale
                const canvasX = Math.round((e.clientX - rect.left) / scaleX);
                const canvasY = Math.round((e.clientY - rect.top) / scaleY);

                const newCoords = { x: canvasX, y: canvasY };
                coordsRef.current = newCoords;
                setCoords(newCoords);
            } else {
                // Fallback to screen coordinates if canvas not found (though unlikely)
                coordsRef.current = { x: e.clientX, y: e.clientY };
                setCoords({ x: e.clientX, y: e.clientY });
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault(); // Prevent default context menu

            const { x, y } = coordsRef.current;
            const textToCopy = `${x}, ${y}`;

            navigator.clipboard.writeText(textToCopy).then(() => {
                console.log('Coordinates copied:', textToCopy);
                // Optional: you could show a temporary "Copied!" feedback here
            }).catch(err => {
                console.error('Failed to copy coordinates:', err);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                left: mousePos.x + 15,
                top: mousePos.y + 15, // Offset to not overlap cursor
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                color: '#00ff00',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                pointerEvents: 'none', // Allows clicks to pass through
                zIndex: 99999,
                border: '1px solid #00ff00',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap',
            }}
        >
            x: {coords.x}, y: {coords.y}
        </div>
    );
};

export default MouseTracker;
