import { readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const PORT = 3000;
const DATA_FILE = path.join("data", "links.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reusable arrow function
const serveFile = async (res, filePath, contentType) => {
    try {
        const data = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    } catch (e) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("Error 404: Page not found");
    }
};

const loadLinks = async () => {
    try {
        const data = await readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (e) {
        if (e.code === "ENOENT") {
            await writeFile(DATA_FILE, JSON.stringify({}));
            return {};
        }
        throw e;
    }
};

const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links));
};

const server = createServer(async (req, res) => {
    // ✅ Handle GET requests
    if (req.method === "GET") {
        if (req.url === "/") {
            await serveFile(res, path.join(__dirname, "public", "index.html"), "text/html");
        } else if (req.url === "/style.css") {
            await serveFile(res, path.join(__dirname, "public", "style.css"), "text/css");
        } 
        else if(req.url === '/links'){
            const links = await loadLinks();
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(links));
        }
        else {
            const links = await loadLinks();
            const shortCode = req.url.slice(1);

            if (links[shortCode]) {
                    res.writeHead(302, {location : links[shortCode]});
                    return res.end();
                }
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("Error 404: Page not found");
        }

    
    } else if (req.method === "POST" && req.url === "/shorten") {
        const links = await loadLinks();

        let body = "";
        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const { url, shortCode } = JSON.parse(body);

                if (!url) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    res.end("URL is required !!");
                    return;
                }

                const finalCode = shortCode || crypto.randomBytes(4).toString("hex");

                if (links[finalCode]) {
                    res.writeHead(400, { "Content-Type": "text/plain" });
                    return res.end("Shortcode already exists.");
                }

                links[finalCode] = url;
                await saveLinks(links);

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, shortCode: finalCode }));

            } catch (err) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                res.end("Invalid JSON");
            }
        });

    
    } else {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Error 405: Method Not Allowed");
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
