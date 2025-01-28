const express = require('express');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const router = express.Router();

function loadRoutes(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
        const entryPath = path.join(directory, entry.name);
        
        if (entry.isDirectory()) {
            loadRoutes(entryPath);
        } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== basename) {
            console.log(`Loading route: ${entryPath}`);
            const route = require(entryPath);
            
            // Adjust the route name (removes base path and .js extension)
            let routeName = '/' + path.relative(__dirname, entryPath)
                .replace(/\\/g, '/')   // Replace Windows backslashes with forward slashes
                .replace('.js', '');   // Remove the .js extension
            
            // If the route is 'index.js', make it the root of the directory
            routeName = routeName.replace('/index', '');
            router.use(routeName, route);
        }
    });
}

loadRoutes(__dirname);

module.exports = router;
