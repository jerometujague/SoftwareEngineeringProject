# Commerce Bank Project Database Schema
# Last Edit: 2/3/2019 2:54 PM

#######################################################################
## Create database schema
#######################################################################
DROP DATABASE IF EXISTS cb_db;
CREATE DATABASE cb_db;
USE cb_db;

# Create the service account and grant it admin permissions on the database
CREATE OR REPLACE USER `admin`@`localhost` IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON cb_db.* TO `admin`@`localhost` WITH GRANT OPTION;

 
CREATE TABLE branch (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	street_address VARCHAR(50) NOT NULL,
	city VARCHAR(30) NOT NULL,
	state VARCHAR(30) NOT NULL,
	zip SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE service (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	service VARCHAR(50),
	PRIMARY KEY (id)
);

CREATE TABLE customer (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	f_name VARCHAR(30) NOT NULL,
	l_name VARCHAR(30) NOT NULL,
	phone_num VARCHAR(10) NOT NULL,
	email VARCHAR(320) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE manager (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	f_name VARCHAR(30) NOT NULL,
	l_name VARCHAR(30) NOT NULL,
	phone_num VARCHAR(10) NOT NULL,
	email VARCHAR(320) NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE appointment_time (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	open_time TIME NOT NULL,
	close_time TIME NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE appointment_date (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	date DATE NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE skills (
	manager_id SMALLINT UNSIGNED NOT NULL,
	service_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (manager_id, service_id)
);

CREATE TABLE appointment (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	date_id SMALLINT UNSIGNED NOT NULL,
	time_id SMALLINT UNSIGNED NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	manager_id SMALLINT UNSIGNED NOT NULL,
	customer_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE unavailable (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	date_id SMALLINT UNSIGNED NOT NULL,
	time TIME NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	manager_id SMALLINT UNSIGNED NOT NULL,
	service_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

#Add Foreign Key Constraints

ALTER TABLE manager
	ADD FOREIGN KEY (branch_id)
	REFERENCES branch (id)
	ON DELETE CASCADE;

ALTER TABLE skills
	ADD FOREIGN KEY (manager_id)
	REFERENCES manager (id)
	ON DELETE CASCADE;

ALTER TABLE skills
	ADD FOREIGN KEY (service_id)
	REFERENCES service (id)
	ON DELETE CASCADE;

ALTER TABLE appointment
	ADD FOREIGN KEY (date_id)
	REFERENCES appointment_date (id)
	ON DELETE CASCADE;

ALTER TABLE appointment
	ADD FOREIGN KEY (branch_id)
	REFERENCES branch (id)
	ON DELETE CASCADE;

ALTER TABLE appointment
	ADD FOREIGN KEY (manager_id)
	REFERENCES manager (id)
	ON DELETE CASCADE;

ALTER TABLE appointment
	ADD FOREIGN KEY (customer_id)
	REFERENCES customer (id)
	ON DELETE CASCADE;

ALTER TABLE unavailable
	ADD FOREIGN KEY (date_id)
	REFERENCES appointment_date (id)
	ON DELETE CASCADE;

ALTER TABLE unavailable
	ADD FOREIGN KEY (branch_id)
	REFERENCES branch (id)
	ON DELETE CASCADE;

ALTER TABLE unavailable
	ADD FOREIGN KEY (manager_id)
	REFERENCES manager (id)
	ON DELETE CASCADE;

ALTER TABLE unavailable
	ADD FOREIGN KEY (service_id)
	REFERENCES service (id)
	ON DELETE CASCADE;

ALTER TABLE appointment_time
	ADD FOREIGN KEY(branch_id)
	REFERENCES branch (id)
	ON DELETE CASCADE;
#######################################################################
## Populate database
#######################################################################

INSERT INTO branch (street_address, city, state, zip)
	VALUES
		("1234 Main Street", "Warrensburg", "Missouri", 66446),
		("4444 South Street", "Warrensburg", "Missouri", 66446),
		("9876 North Street", "Warrensburg", "Missouri", 66446);

INSERT INTO service (service)
	VALUES
		("Financial Advisor"),
		("Debt Advisor"),
		("Retirement Planner");

INSERT INTO customer (f_name, l_name, phone_num, email)
	VALUES
		("John", "Doe", "9135555555", "jdoe@ucmo.edu"),
		("Jane", "Doe", "8165555555", "jadoe@ucmo.edu"),
		("Bob", "Smith", "6605555555", "bsmith@ucmo.edu");

INSERT INTO manager (f_name, l_name, phone_num, email, branch_id)
	VALUES
		("LeBron", "James", "6607777777", "ljames@ucmo.edu", 1),
		("Tom", "Brady", "6608888888", "tbrady@ucmo.edu", 2),
		("Steph", "Curry", "9137777777", "scurry@ucmo.edu", 3);

INSERT INTO appointment_time (open_time, close_time, branch_id)
	VALUES
		("12:00:00", "1:00:00", 2);

INSERT INTO appointment_date (date)
	VALUES
		("2018-03-03");



