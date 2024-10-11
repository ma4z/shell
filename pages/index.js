import { useState } from 'react';

export default function Home() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('root@localhost$~ ');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const command = input;
        setInput(''); // Clear the input field

        const res = await fetch('/api/runCommand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command }),
        });

        if (res.ok) {
            const result = await res.json();
            if (result.clear) {
                setOutput(''); // Clear the terminal output
            } else {
                setOutput((prev) => prev + command + '\n' + result + '\nroot@localhost$~ ');
            }
        } else {
            const errorMessage = await res.text();
            setOutput((prev) => prev + command + '\nError: ' + errorMessage + '\nroot@localhost$~ ');
        }
    };

    return (
        <div style={{ backgroundColor: 'black', color: 'green', height: '100vh', padding: '20px', fontFamily: 'monospace' }}>
            <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                {output}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ backgroundColor: 'black', color: 'green', border: 'none', width: '100%' }}
                    autoFocus
                />
            </form>
        </div>
    );
}
