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
### Deployment
It is imperative that the machine you will be working from has Node.js, npm (node package manager), and ReactJS installed. Git is _not_ a requirement, but is used here. This project uses [Postgresql](https://www.postgresql.org/) for the backend database.
1. Run `nvm install --lts` to install the latest stable verion of Node.js along with npm. This will install Node.js globally for your user on your machine.
2. This project uses [Create React App](https://create-react-app.dev/) (CRA) to get the project up and running. There are a number of other ways to set up a ReactJS application, however. See the official [React start-up page](https://react.dev/learn/start-a-new-react-project) for additional options. Create React App includes pre-configured dependencies like [Babel](https://babeljs.io/docs/) - necessary for the transpilation of html markup in JavaScript code to actual html - and [Webpack](https://webpack.js.org/) - which bundles JavaScript code for the browswer. Run `npx create-react-app my-app` where 'my-app' is the name of your app. This creates a 'my-app' subdirectory - and everything you need to start your project - in the directory in which you run the command. 
3. Navigate to the new folder - `cd my-app` - and then run `git clone https://brettagreen/tigerlilly`. Now the project is in your my-app directory. Once downloaded, navigate to the backend folder. From here, you will install all of the dependencies listed in the package.json file. Run `npm install` to perform the installation.
4. Next `cd ../frontend`. Again, run `npm install` to install all the dependencies in the package.json file.
5. Again, `cd ../backend`. Here, create an .env file. This holds values specific to your development environment. This should _not_ be a .git tracked file, given the sensitivity of the data. 5a spells out the needed variables and what they are used for
- UPLOAD_PATH --> This is where user and author icon files will be stored. These will need to be stored in the frontend/public folder somewhere. a full - not relative - path should be provided.
- TIGERLILLY_BASE_URL --> This is the url where frontend http requests are routed to the backend API.
- PORT --> The port the backend api is listening on.
- SECRET_KEY --> String value json web tokens are signed with. More on how JSON Web Tokens work and ensure user identity at https://jwt.io
- DB_HOST --> your db server.
- DB_USER --> your db user.
- DB_PORT --> port your db is listening on.
- #### Database
  1. While other relational databases could be used instead of Postgresql, there are a few things to consider:
    - the provided setup scripts in the backend/sql directory would not work.
    - there are hardcoded sql queries throughout the backend/models modules, an unknown number of which may break with another db engine.
  2. The database can reside locally with the rest of the application or on a separate host.
  3. [Download and install](https://www.postgresql.org/download/) Postgresql at their site.
  4. Navitage to `backend\sql`. From here you can run `psql -U user_name < tigerlilly.sql`. This will create your database(s) and table definitions and can even seed your tables with some starter data. To 
     control which databases to create and/or which to seed with data, you can simply comment out the relevant fields in the tigerlilly.sql file.
8. Starting the app is pretty easy. Navigate to the backend directory and run `node server.js`. This will have the api up and running. Then navigate to the frontend directory and run `npm start`. This will have your frontend up and running and listening on the default React port of 3000. If you want the app to listen on another port, you will want to modify the your backend/package.json accordingly. see [How to specify a port to run CRA](https://stackoverflow.com/questions/40714583/how-to-specify-a-port-to-run-a-create-react-app-based-project).
### Tests
There are ample tests addressing backend functionality. Backend tests leverage the popular [Jest testing library](https://jestjs.io). These tests can be peformed running the `npm test` command in the Tigerlilly/backend directory. Difficulties were encountered using the [React testing library](https://testing-library.com/docs/react-testing-library) for frontend testing, so these efforts were aborted for the time being.
