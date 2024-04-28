# The Tigerlilly Online
### Summary
A [ReactJS](https://react.dev) frontend and [Node.js](https://nodejs.org) backend leveraging a postgresql database. The app serves up humorous articles in a tradtional newspaper-like format along with
author profiles, search features, games, and more...all in an aesthetically pleasing format. The site is open to infinite modification and addition of new features going forward...opinion pages, reader feedback, comics, user interaction, etc. There is currently a feature to create a user profile, but not a currently utility for this feature.  This will be rolled out going forward.
This isn't so much a project to fultill a bootcamp capstone requirement, but a pet project to be developed over time.
### General Architecture
- The frontend website is directly tied to data structures defined on the backend. It is conceiveable that the existing codebase could translate appropriately to another website, but it would be a challenge. That level of abstraction does not exist here.
- The site is configured to host frontend and backend http requests _on the same server_. There is certainly no reason the app could not function across multiple servers. This also applies to where the database
   is located.
- http requests are handled on the frontend via the [react-router](https://github.com/remix-run/react-router#readme) library, which maps requests to the appropriate component/page.
- components will fetch any needed data using the backend api, the configuration of which is described below.
- an admin page exists, allowing site admin's the ability to perform basic CRUD operations on database tables. Site admins can also perform remote database operations using an http client such as [Insomnia](https://insomnia.rest/), [Postman](https://www.postman.com), Curl, etc.
### Tests
There are ample tests addressing backend functionality. Backend tests leverage the popular [Jest testing library](https://jestjs.io). These tests can be peformed running the `npm test` command in the Tigerlilly/backend directory. Difficulties were encountered using the [React testing library](https://testing-library.com/docs/react-testing-library) for frontend testing, so these efforts were aborted for the time being.
### Deployment
It is (obviously) imperative that the machine you will be working from has Node.js, npm (node package manager), and ReactJS installed. Git is also a requirement. You can run `nvm install --lts` to install the latest stable verion of Node.js along with npm.
1. This project uses [Create React App](https://create-react-app.dev/) to get the project up and running. There are a number of other ways to set up a ReactJS application, however. See the official [React start-up page](https://react.dev/learn/start-a-new-react-project) for additional options. Create React App includes pre-configured dependencies like [Babel](https://babeljs.io/docs/) - necessary for the transpilation of html markup in JavaScript code to actual html - and [Webpack](https://webpack.js.org/) - which bundles JavaScript code for the browswer.
2. 
3. Then run `git clone https://brettagreen/tigerlilly`. Once downloaded, move to the backend directory `cd backend`. From here, you will install all of the dependencies listed in the package.json file. Run `npm install` to perform the installation. cd ../frontend. npm install. cd ../backend. create an .env file. This holds values specific to your development environment --> UPLOAD_PATH:
   this is where user and author icon files will be stored. These will need to be stored in the frontend/public folder somewhere. full - not relative - path should be provided. TIGERLILLY_BASE_URL --> This is
   the url where frontend http requests are routed to the backend API. PORT --> port the backend api is listening on. SECRET_KEY --> value json web tokens are signed with. see https://jwt.io for more info on json
   web tokens. DB_HOST --> your db server. DB_USER --> your db user. DB_PORT --> port your db is listening on.
8. starting the app is pretty easy. Navigate to Tigerlilly/backend and run 'node server.js'. This will have the api up and running. then go to Tigerlilly/frontend and run 'npm start'. This will have your
   frontend up and running and listening on the default React port of 3000. If you want the app to listen on another port, you will want to modify the your package.json accordingly. see https://stackoverflow.com/questions/40714583/how-to-specify-a-port-to-run-a-create-react-app-based-project.
   for a typical solution to this problem. And you're done, it's that simple!
