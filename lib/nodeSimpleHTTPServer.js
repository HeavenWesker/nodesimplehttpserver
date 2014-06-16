#!/usr/bin/env node
var http = require("http")
var url = require("url")
var fs = require("fs")
var domain = require("domain")

process.on('uncaughtException', function(err) {
  console.error('Error caught in uncaughtException event:', err);
});

function server(port, root){
  http.createServer(function(req,res){
    if(url.parse(req.url).path === "/"){
      var requestpath = ""
    }else{
      var requestpath = decodeURI(url.parse(req.url).path).replace(/\/\/+/g,"/").replace(/\/+$/g,"")
    }
    if(requestpath.replace(/\/$/g,"").replace(/\/[^/]*$/g,"").length === 0){
      var upperpath = "/"
    }else{
      var upperpath = requestpath.replace(/\/$/g,"").replace(/\/[^/]*$/g,"")
    }
    console.log(requestpath)
    if(fs.existsSync(root + requestpath)){
      if(fs.lstatSync(root + requestpath).isFile()){
        var d_file = domain.create()
        d_file.on("error",function(e){
          res.writeHeader(200,{"Content-Type":"text/plain"})
          res.write("Permission Denied when try to access " + requestpath)
          res.end()
        })
        d_file.run(function(){
          fs.createReadStream(root + requestpath).pipe(res)
        })
      }else{
        fs.readdir(root + requestpath, function(err,list){
          if(err){
            res.writeHeader(200,{"Content-Type":"text/html"})
            res.write("Permission Denied when try to access " + requestpath)
            res.end()
          }else{
            res.writeHeader(200,{"Content-Type":"text/html"})
            res.write("Index of " 
                      + requestpath + "</br>" 
                      + "<a href=" 
                      + encodeURI(upperpath)
                      + ">⬆︎</a>" + "</br>" + "<hr />")
                      var count = 0
                      for(var i = 0; i < list.length; i++){
                        res.write("<a href=" + encodeURI(requestpath) 
                                  +"/" 
                                  + encodeURI(list[i]) 
                                  + ">" 
                                  + list[i] + "</a></br>")
                                  count++
                                    if(count === list.length){res.end()}
                      }
                      if(count === 0){res.end()}
          }
        })
      }
    }else{
      res.writeHeader(200,{"Content-Type":"text/html"})
      res.write("Index of " 
                + requestpath + "</br>" 
                + "<a href=" 
                + encodeURI(upperpath)
                + ">⬆︎</a>" + "</br>" + "<hr />")
      res.write("404")
      res.end()
    }
  }).listen(port)
  console.log("Server Listening on port " + port)
  var interfaces = require("os").networkInterfaces()
  for(var i in interfaces){
    for(var j = 0; j < interfaces[i].length; j++){
      console.log(i + "\t" + interfaces[i][j]["address"] )
    }
  }
  console.log("==============================================================================")
}
exports.server = server
