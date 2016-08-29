# LineServer

A Simple Node.JS and Express REST API to serve lines from a specified file to clients.

A few test files have been included with this project. 

___

###Build the project using:

  + build.sh - This script will install all dependencies (through npm) and will also appropriately install and configure a MongoDB database instance for use with the api.
  + Example Useage: `./build.sh`
  
###Run the project using:
  
  + run.sh - This script will load the specified file and start a Node.JS server with the REST API on your localhost at port 3000.
  + Example Useage: `./run.sh <path/to/file.txt>`
  
###Examples of using the REST API with Hamlet by William Shakespeare:

| Request        | Status           | Response  |
| ------------- |:-------------:| -----|
| http://localhost:3000/lines/1      | 200 | {"lineNumber":"1","text":"Hamlet"}                                               |
| http://localhost:3000/lines/2      | 200 | {"lineNumber":"2","text":"by William Shakespeare"}                               |
| http://localhost:3000/lines/1000   | 200 | {"lineNumber":"1000","text":"Makes us traduced and taxed of other nations."}     |
| http://localhost:3000/lines/5000   | 200 | {"lineNumber":"5000","text":"question to thee. If thou answerest me not to the"} |
| http://localhost:3000/lines/10000  | 413 | Requested line beyond end of document                                            |
 
___

###FAQ
How does your system work? (if not addressed in comments in source)
>This system implements a REST API using Node.JS and Express, two very popular frameworks for building lightweight server
>backends for basic webpages and webapps. On startup, I add each line of the file to a MongoDB NoSQL database, indexed by
>the line number, which can later be queried by the /lines endpoint to efficiently return the requested line

How will your system perform with a 1 GB file? a 10 GB file? a 100 GB file?
>This system uses a Javascript package called LineNavigator to efficiently read in any file in managable data chunks. Most 
>libraries or the standard FileReader() will attempt to read the entire file in to memory, which would likely cause the
>client/server to crash for very large files. By reading the file incrementally, this limitation is avoided. For an extremely
>large file, each line needs to be read and added to the database, so processing time will inevitably increase linearly 
>as the file size increases. This program currently creates a new table and processes the specified file on load but could
>easily be extended further to create a new table for new files, or not reprocess previously processed files.

How will your system perform with 100 users? 10000 users? 1000000 users?
>Node.JS and Express.js are two powerful choices for implementing a simple server. Based on recent [performance tests](https://raygun.com/blog/2016/06/node-performance/)
>Node and Express are each capable of serving over 5000 requests/second, meaning 100-5000 simultaneous requests from users should notice
>no performance change when simultaneously making requests from the API. Even with hundreds of thousands of users, Node.JS is a solid choice. Based on [this](https://www.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/) post, it seems possible to configure
>a single Node.JS server to serve over six hundred thousand concurrent connections.

What documentation, websites, papers, etc did you consult in doing this assignment?
>I utilized the [Node.JS](https://nodejs.org/api/), [Express.js](http://expressjs.com/en/api.html), [MongoDB Node Driver](https://mongodb.github.io/node-mongodb-native/), [MongoDB JavaScript Driver](http://mafintosh.github.io/mongojs/)
>and [LineNavigator](https://github.com/anpur/line-navigator) docs pages. I also consulted [StackOverflow](http://stackoverflow.com/) when debugging a few REST API and MongoDB issues the arose.

What third-party libraries or other tools does the system use? How did you choose each library or framework you used?
>As detailed above, Node.JS, Express.js, and MongoDB were chosen because of their ease in implementation, widespread support and community, and solid performance.
>The only other third-party library I used was LineNavigator, to handle incrementally loading huge files. I chose this library because it had a sensible API and was well suited to my incremental file read requirement.

How long did you spend on this exercise? If you had unlimited more time to spend on this, how would you spend it and how would you prioritize each item?
>I spent about 6 hours coding, and 1 hour documenting my work for this exercise. Additional items to spend time on would be:

>1. Avoiding re-processing of already processed files on startup
>2. A REST endpoint for allowing a user to upload a new file to be processed
>3. Allowing requests for *any* line from *any* previously processed file, not just a single file
>4. Implement Server-side Caching
>

If you were to critique your code, what would you have to say about it?
>This code could be much more modular and abstracted, there is a lot of code here that would be useful across many projects if made more generic. Callback functions could be organized into sensible libraries, which would help readability and maintainability. This code also could be much better documented.
