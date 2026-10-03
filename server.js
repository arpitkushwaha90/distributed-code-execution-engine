const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: "active", message: "Remote Code Execution Engine running" });
});

// Code execution endpoint
app.post('/execute', (req, res) => {
    const { language, code, input } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: "Code payload cannot be empty." });
    }

    const timestamp = Date.now();
    const filename = `temp_${timestamp}.${language === 'python' ? 'py' : 'cpp'}`;
    fs.writeFileSync(filename, code);

    // Timeout: 3 seconds to prevent infinite loops (TLE)
    const runCommand = language === 'python' 
        ? `python3 ${filename}` 
        : `g++ ${filename} -o out_${timestamp} && ./out_${timestamp}`;

    exec(runCommand, { timeout: 3000 }, (error, stdout, stderr) => {
        // Cleanup generated files
        if (fs.existsSync(filename)) fs.unlinkSync(filename);
        if (fs.existsSync(`out_${timestamp}`)) fs.unlinkSync(`out_${timestamp}`);

        if (error && error.killed) {
            return res.json({ 
                verdict: "Time Limit Exceeded (TLE)", 
                executionTime: "3000ms", 
                output: null 
            });
        }
        if (stderr) {
            return res.json({ 
                verdict: "Runtime Error (RE)", 
                error: stderr 
            });
        }
        return res.json({ 
            verdict: "Accepted (AC)", 
            output: stdout.trim() 
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Execution Engine listening on port ${PORT}`));
