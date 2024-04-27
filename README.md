1. The Tigerlilly Online
2. A react.js frontend and node.js backend leveraging a postgresql database. The app serves up humorous articles in a tradtional newspaper-like format along with
   author profiles, search features, games, and more...all in an aesthetically pleasing format. The site is open to infinite modification and addition of new features going forward...opinion pages, reader feedback,
   comics, user interaction, etc. There is currently a feature to create a user profile, but not a currently utility for this feature.  This will be rolled out going forward.
   This isn't so much a project to fultill a bootcamp capstone requirement, but a pet project to be developed over time.
3. The frontend website is directly tied to data structures defined in the backend. It is conceiveable that the existing codebase could translate appropriately to another website, but it would be a challenge. That
   level of abstraction does not exist here.
4. The site is configured to host frontend and backend http requests _on the same server_. There is certainly no reason the app could not function across multiple servers. This also applies to where the database
   is located.
6. There are ample tests addressing backend functionality. Tests leveraged the popular Jest testing library, https://jestjs.io. Difficulties were encountered using the React testing library - https://testing-library.com/docs/react-testing-library
    - so these efforts were aborted. 
7. git clone https://brettagreen/tigerlilly. cd backend. npm install. cd ../frontend. npm install. cd ../backend. create an .env file. This holds values specific to your development environment --> UPLOAD_PATH:
   this is where user and author icon files will be stored. These will need to be stored in the frontend/public folder somewhere. full - not relative - path should be provided. TIGERLILLY_BASE_URL --> This is
   the url where frontend http requests are routed to the backend API. PORT --> port the backend api is listening on. SECRET_KEY --> value json web tokens are signed with. see https://jwt.io for more info on json
   web tokens. DB_HOST --> your db server. DB_USER --> your db user. DB_PORT --> port your db is listening on.
8. starting the app is pretty easy. Navigate to Tigerlilly/backend and run 'node server.js'. This will have your api up and running. then go to Tigerlilly/frontend and run 'npm start'. This will have your
   frontend up and running and listening on the default React port of 3000. If you want the app to listen on another port, see https://stackoverflow.com/questions/40714583/how-to-specify-a-port-to-run-a-create-react-app-based-project
   for a typical solution to this problem. You're done, it's that simple!
