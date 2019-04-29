# SoftwareEngineeringProject
https://commercebank.azurewebsites.net

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)

Check out the wiki for the [project roadmap](https://github.com/jerometujague/SoftwareEngineeringProject/wiki) and the [git workflow](https://github.com/jerometujague/SoftwareEngineeringProject/wiki/Git-Workflow)

## API Documentation

### Appointments
* [Get appointments]() : `GET /api/appointments`
* [Add an appointment]() : `POST /api/appointments/add`
* [Update an appointment]() : `POST /api/appointments/update`
* [Delete an appointment]() : `DELETE /api/appointments/delete/{appointmentId}`

### Branches
* [Get branches]() : `GET /api/branches`
* [Get branches with services]() : `POST /api/branches`
* [Add a branch]() : `POST /api/branches/add`
* [Update a branch]() : `POST /api/branches/update`
* [Delete a branch]() : `DELETE /api/branches/delete/{branchId}`

### Managers
* [Get managers]() : `GET /api/managers`
* [Add a manager]() : `POST /api/managers/add`
* [Update a manager]() : `POST /api/managers/update`
* [Delete a manager]() : `DELETE /api/managers/delete/{managerId}`

### Services
* [Get services]() : `GET /api/services`
* [Add a service]() : `POST /api/services/add`
* [Update a service]() : `POST /api/services/update`
* [Delete a service]() : `DELETE /api/services/delete/{serviceId}`

### Customers
* [Get customers]() : `GET /api/customers`
* [Get customer with email]() : `GET /api/customers/{email}/`
* [Add a customer]() : `POST /api/customers/add`
* [Update a customer]() : `POST /api/customers/update`
* [Delete a customer]() : `DELETE /api/customers/delete/{customerId}`

### Unavailables
* [Get unavailables]() : `GET /api/unavailables`
* [Get branch unavailables]() : `GET /api/branchUnavailables`
* [Get manager unavailables]() : `GET /api/managerUnavailables`
* [Add a branch unavailable]() : `POST /api/unavailables/branch/add`
* [Add a manager unavailable]() : `POST /api/unavailables/manager/add`
* [Update a branch unavailable]() : `POST /api/unavailables/branch/update`
* [Update a manager unavailable]() : `POST /api/unavailables/manager/update`
* [Delete a branch unavailable]() : `DELETE /api/unavailables/branch/delete/{unavailableId}`
* [Delete a manager unavailable]() : `DELETE /api/unavailables/manager/delete/{unavailableId}`

### Appointment slots
* [Get available appointment slots]() : `POST /api/appointmentSlots/{branchId}`
* [Get available appointment slots on a specific date]() : `POST /api/appointmentSlots/{branchId}/{date}`

## Development tools
* Amazon Corretto 8 OpenJDK - https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/downloads-Get.html
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