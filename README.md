# SoftwareEngineeringProject
**Live application**: https://commercebank.azurewebsites.net

![version](https://img.shields.io/badge/version-1.0.0-blue.svg)

This is a web application for Commerce Bank that allows a customer to schedule an apppointment with the bank. It also allows managers to manager all of the information in the system.

## Web pages
* `/index.html` - Customer view for scheduling an appointment
* `/managerView.html` - Manager view for managing information

# How to build and run locally
## Technical Prerequisites
* Amazon Corretto 8 OpenJDK - https://docs.aws.amazon.com/corretto/latest/corretto-8-ug/downloads-Get.html
* Apache Maven (Project management) - https://maven.apache.org/download.cgi
* NodeJS (Front end compiler)- https://nodejs.org/en/download/

## Building and running
```
// Build the application
mvn install

// Run the application
java -jar target/commercebank-1.0.0.jar

// View the appliction
Open `http://localhost:8080` in your browser
```

## Spring boot profiles

There are two profiles that will change which database is used: 
* `development` - Local Xampp MySQL database (requires setup)
* `production` - Live server hosted MySQL database (no setup required)

The default profile is set to `production`

## Building the front end seperately
While `mvn install` will compile the front end automatically, you can also commpile the front end seperately if needed

```
// Install the dependencies
npm install

// Run the webpack compiler and bundler
npm run build
```

```
// Or you can start a watcher that will recompile on change
npm start
```


# API Documentation
The RESTful API documentation for the back end of the application. 

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