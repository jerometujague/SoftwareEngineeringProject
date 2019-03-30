# SoftwareEngineeringProject
https://commercebank.azurewebsites.net

![version](https://img.shields.io/badge/version-0.3.0-blue.svg)

Check out the wiki for the [project roadmap](https://github.com/jerometujague/SoftwareEngineeringProject/wiki) and the [git workflow](https://github.com/jerometujague/SoftwareEngineeringProject/wiki/Git-Workflow)

## API Documentation
* [List branches]() : `GET /api/branches`
* [List appointments]() : `GET /api/appointments`
* [List managers]() : `GET /api/managers`
* [List services]() : `GET /api/services`
* [List customers]() : `GET /api/customers`
* [List customer with email]() : `GET /api/customers/{email}/`
* [List unavailables]() : `GET /api/unavailables`
* [List branches with services]() : `POST /api/branches`
* [List available appointment slots]() : `POST /api/appointmentSlots/{branchId}`
* [Add an appointment]() : `POST /api/appointments/add`
* [Add a customer]() : `POST /api/customers/add`
* [Add an unavailable]() : `POST /api/unavailables/add`

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

// Build the application
mvn clean install

// Start the xampp MySQL database

// Run the application
java -jar target/commercebank-0.0.1-SNAPSHOT.jar

// Test the appliction
Open `http://localhost:8080` in your browser
```

## Front end development
**Start the Webpack bundler to compile your React files and bundle the application**
```
// Install the dependencies
npm install

// Run the webpack bundler
npm start
```

**Or compile the source files once**

`npm run build`