// Simple Node.js server for the finance tracking application
const http = require("http")
const fs = require("fs")
const path = require("path")
const url = require("url")

// Port for the server to listen on
const PORT = process.env.PORT || 3000

// MIME types for different file extensions
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
}

// Function to serve static files
const serveStaticFile = (res, filePath) => {
  const extname = path.extname(filePath)
  const contentType = MIME_TYPES[extname] || "text/plain"

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found
        fs.readFile(path.join(__dirname, "404.html"), (err, content) => {
          if (err) {
            // If 404.html doesn't exist, send a simple 404 message
            res.writeHead(404, { "Content-Type": "text/html" })
            res.end("<h1>404 Not Found</h1>")
          } else {
            res.writeHead(404, { "Content-Type": "text/html" })
            res.end(content, "utf-8")
          }
        })
      } else {
        // Server error
        res.writeHead(500)
        res.end(`Server Error: ${err.code}`)
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content, "utf-8")
    }
  })
}

// Create a placeholder SVG for demo purposes
const createPlaceholderSVG = (width, height) => {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" text-anchor="middle" dominant-baseline="middle" fill="#888">
          ${width}x${height}
      </text>
  </svg>`
}

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url, true)
  let pathname = parsedUrl.pathname

  // Normalize the path (remove trailing slash if present)
  pathname = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname

  // Handle login form submission (simplified for demo)
  if (pathname === "/api/login" && req.method === "POST") {
    let body = ""
    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      try {
        // In a real app, you would validate credentials against a database
        // For demo purposes, we'll just return success
        res.writeHead(200, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ success: true, redirect: "/dashboard.html" }))
      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ success: false, message: "Invalid request" }))
      }
    })
    return
  }

  // Handle placeholder SVG requests
  if (pathname.startsWith("/placeholder.svg")) {
    const { width = 300, height = 200 } = parsedUrl.query
    const svg = createPlaceholderSVG(width, height)
    res.writeHead(200, { "Content-Type": "image/svg+xml" })
    res.end(svg, "utf-8")
    return
  }

  // Map the pathname to the corresponding file
  let filePath
  if (pathname === "/") {
    filePath = path.join(__dirname, "index.html")
  } else {
    filePath = path.join(__dirname, pathname)
  }

  // Serve the static file
  serveStaticFile(res, filePath)
})

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`)
  console.log("Press Ctrl+C to stop the server")
})

