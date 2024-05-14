const http = require('http');
const url = require('url');

let db = [];

let currentId = 0;

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/' && req.method === 'GET') {
        // Return all jokes
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(db));
    } else if (reqUrl.pathname === '/' && req.method === 'POST') {
        // Add a new joke
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, comedian, year } = JSON.parse(body);
            console.log("BOdy", body)
            const joke = {
                id: currentId,
                title: title,
                comedian: comedian,
                year: year
            };
            db.push(joke);
            currentId++;
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(db));
        });
    } else if (reqUrl.pathname.startsWith('/joke/') && req.method === 'PATCH') {
        // Update a joke
        const jokeId = parseInt(reqUrl.pathname.split('/')[2]);
        let body = '';
        console.log("jokeid", jokeId)
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, comedian, year } = JSON.parse(body);
            if (db[jokeId]) {
                db[jokeId] = {
                    id: jokeId,
                    title: title || db[jokeId].title,
                    comedian: comedian || db[jokeId].comedian,
                    year: year || db[jokeId].year
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(db[jokeId]));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Joke not found');
            }
        });
    } else if (reqUrl.pathname.startsWith('/joke/') && req.method === 'DELETE') {
        // Delete a joke
        const jokeId = parseInt(reqUrl.pathname.split('/')[2]);
        if (db[jokeId]) {
            const deletedJoke = db.splice(jokeId, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(deletedJoke));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Joke not found');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
