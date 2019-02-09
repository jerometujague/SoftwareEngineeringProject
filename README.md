# SoftwareEngineeringProject
CommerceBankProject

Check out the wiki for the [project roadmap](https://github.com/jerometujague/SoftwareEngineeringProject/wiki) and the [git workflow](https://github.com/jerometujague/SoftwareEngineeringProject/wiki/Git-Workflow)

## Development tools
* Amazon Corretto 8 OpenJDK - https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/downloads-list.html
* Apache Maven (Project management) - https://maven.apache.org/download.cgi
* NodeJS (Front end/ReactJS compiler)- https://nodejs.org/en/download/
* Xampp (For MariaDB SQL database) - https://www.apachefriends.org/download.html
* Git - https://git-scm.com/downloads

## Local development
```
// Clone the repository
git clone https://github.com/jerometujague/SoftwareEngineeringProject.git

// Build
mvn clean install

// Run
java -jar target/commercebank-0.0.1-SNAPSHOT.jar

// Test
Open `http://localhost:8080` in your browser
```

## Database
Start your local Xammp MySQL server

## Front end development
**Start the React compiler to compile your JavaScript files**
```
// Install the JSX compiler
npm install

// Run the compiler
npm start
```

Or compile the source files once

`npm run compiler`