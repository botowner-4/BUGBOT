const fs = require('fs');
const path = require('path');

function loadCommands() {
    const commands = {};
    const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.js') && f !== 'index.js');

    for (const file of files) {
        try {
            const cmd = require(path.join(__dirname, file));
            
            // Handle both function exports and object exports
            if (typeof cmd === 'function') {
                // If it's a function, use filename as command name
                const cmdName = path.basename(file, '.js');
                commands[cmdName] = cmd;
                console.log(`✅ Loaded command: ${cmdName}`);
            } else if (cmd && typeof cmd === 'object') {
                // If it's an object with name property
                if (cmd.name) {
                    commands[cmd.name] = cmd;
                    if (cmd.aliases) {
                        for (const a of cmd.aliases) {
                            commands[a] = cmd;
                        }
                    }
                    console.log(`✅ Loaded command: ${cmd.name}`);
                } else {
                    console.warn(`⚠️ Command file ${file} exported an object without a name property`);
                }
            }
        } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error.message);
        }
    }
    return commands;
}

function getCommand(commands, name) {
    return commands[name] || null;
}

module.exports = { loadCommands, getCommand };
