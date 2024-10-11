const { exec } = require('child_process');
const path = require('path');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const command = req.body.command;

        const allowedCommands = [
            'ls',
            'mkdir',
            'rm',
            'echo',
            'clear',
            'cd'
        ];

        // Check if the command is allowed
        if (!allowedCommands.some(cmd => command.startsWith(cmd))) {
            return res.status(403).send('Command not allowed');
        }

        // Handle the 'clear' command
        if (command === 'clear') {
            return res.send({ clear: true });
        }

        // Handle 'cd' command
        if (command.startsWith('cd')) {
            const dir = command.split(' ')[1];
            if (!dir) {
                return res.status(400).send('No directory specified');
            }

            try {
                process.chdir(dir);
                return res.send(`Changed directory to ${process.cwd()}`);
            } catch (err) {
                return res.status(500).send(`Error: ${err.message}`);
            }
        }

        // Execute other commands
        exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).send(`Error: ${error.message}`);
            }
            if (stderr) {
                return res.status(500).send(`Stderr: ${stderr}`);
            }

            const output = stdout.trim(); // Remove leading/trailing whitespace
            res.send(output);
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
