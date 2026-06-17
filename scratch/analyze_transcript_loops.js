const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\Sajad\\.gemini\\antigravity-ide\\brain\\d38bf192-0aab-4aed-8ad9-ade0ccafc134\\.system_generated\\logs\\transcript.jsonl';

const rl = readline.createInterface({
    input: fs.createReadStream(logPath),
    crlfDelay: Infinity
});

let stepCount = 0;
let lastToolName = null;
let lastToolArgs = null;
let repeatCount = 0;
let toolCounts = {};
let runCommands = [];
let errorSteps = [];

rl.on('line', (line) => {
    stepCount++;
    try {
        const data = JSON.parse(line);
        if (data.type === 'PLANNER_RESPONSE' && data.tool_calls) {
            for (let tc of data.tool_calls) {
                const name = tc.name;
                toolCounts[name] = (toolCounts[name] || 0) + 1;
                
                if (name === lastToolName) {
                    repeatCount++;
                } else {
                    if (repeatCount > 3) {
                        console.log(`Step ${stepCount - repeatCount - 1} to ${stepCount - 1}: Repeated tool ${lastToolName} ${repeatCount} times`);
                    }
                    repeatCount = 0;
                }
                lastToolName = name;
                lastToolArgs = tc.args;
            }
        }
        
        if (data.error) {
            errorSteps.push({ step: stepCount, error: data.error, type: data.type });
        }
        
        if (data.type === 'RUN_COMMAND' || data.type === 'COMMAND') {
            runCommands.push({ step: stepCount, command: data.content ? data.content.slice(0, 100) : '', status: data.status });
        }
    } catch (e) {
        // ignore
    }
});

rl.on('close', () => {
    if (repeatCount > 3) {
        console.log(`Step ${stepCount - repeatCount - 1} to ${stepCount}: Repeated tool ${lastToolName} ${repeatCount} times`);
    }
    console.log('\n--- Tool Call Counts ---');
    console.log(toolCounts);
    
    console.log('\n--- Errors encountered ---');
    console.log(`Total error steps: ${errorSteps.length}`);
    errorSteps.slice(-10).forEach(e => {
        console.log(`Step ${e.step} (${e.type}):`, JSON.stringify(e.error).slice(0, 200));
    });
    
    console.log('\nTotal steps in transcript:', stepCount);
});
