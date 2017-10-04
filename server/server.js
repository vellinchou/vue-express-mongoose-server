const PORT = 3000

const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const mine = require('./mine.js')

const server = http.createServer((req, res) => {
  var pathname = url.parse(req.url).pathname
  var realPath = pathname.replace('/', '')

  var ext = path.extname(realPath)
  ext = ext ? ext.slice(1) : 'unknown'

  fs.exists(realPath, (exists) => {
      if (!exists) {
          res.writeHead(404, {
             'Content-Type': 'text/plain'
          })

          res.write('页面未找到', 'utf8')
          res.end()
      }else {
          fs.readFile(realPath, 'binary', (err, file)=>{
              if (err) {
                  res.writeHead(500, {
                      'Content-Type': 'text/plain'
                  })
                  res.write('系统内部错误')
                  res.end()
              }else {
                  
                  res.writeHead(200, {
                      'Content-Type': mine[ext] || 'text/plain'
                  })
                
                  res.write(file, 'binary')
                  res.end()
              }
          })
      }
  })
})

server.listen(PORT, '127.0.0.1', () => {
    console.log('服务已经启动')
})
