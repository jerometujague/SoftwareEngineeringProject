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
	name VARCHAR(50) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE service (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	service VARCHAR(100),
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

CREATE TABLE branch_hours (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	open_time TIME NOT NULL,
	close_time TIME NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	day_of_week INT NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE skills (
	manager_id SMALLINT UNSIGNED NOT NULL,
	service_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (manager_id, service_id)
);

CREATE TABLE cb_db.calendar
(
	calendar_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
	calendar_Date DATE NOT NULL, -- The date addressed in this row.
	calendar_Month TINYINT NOT NULL, -- Number from 1-12
	calendar_Day TINYINT NOT NULL, -- Number from 1 through 31
	calendar_Year SMALLINT NOT NULL, -- Current year, eg: 2017, 2025, 1984.
	calendar_Quarter TINYINT NOT NULL, -- 1-4, indicates quarter within the current year.
	Day_Name VARCHAR(9) NOT NULL, -- Name of the day of the week, Sunday...Saturday
	Day_of_Week TINYINT NOT NULL, -- Number from 1-7 (1 = Sunday)
	Day_of_Week_in_Month TINYINT NOT NULL, -- Number from 1-5, indicates for example that it's the Nth saturday of the month.
	Day_of_Week_in_Year TINYINT NOT NULL, -- Number from 1-53, indicates for example that it's the Nth saturday of the year.
	Day_of_Year SMALLINT NOT NULL, -- Number from 1-366
	Week_of_Month TINYINT NOT NULL, -- Number from 1-6, indicates the number of week within the current month.
	Week_of_Year TINYINT NOT NULL, -- Number from 1-53, indicates the number of week within the current year.
	Month_Name VARCHAR(9) NOT NULL, -- January-December
	First_Date_of_Week DATE NOT NULL, -- Date of the first day of this week.
	Last_Date_of_Week DATE NOT NULL, -- Date of the last day of this week.
	First_Date_of_Month DATE NOT NULL, -- Date of the first day of this month.
	Last_Date_of_Month DATE NOT NULL, -- Date of the last day of this month.
	First_Date_of_Year DATE NOT NULL, -- Date of the first day of this year.
	Last_Date_of_Year DATE NOT NULL, -- Date of the last day of this year.
	Is_Holiday BIT NOT NULL, -- 1 if a holiday
	Holiday_Name VARCHAR(50) NULL, -- Name of holiday, if Is_Holiday = 1
	Is_Weekday BIT NOT NULL, -- 1 if Monday-->Friday, 0 for Saturday/Sunday
	Is_Business_Day BIT NOT NULL, -- 1 if a workday, otherwise 0.
	Is_Leap_Year BIT NOT NULL, -- 1 if current year is a leap year.
	Days_in_Month TINYINT NOT NULL, -- Number of days in the current month.
	PRIMARY KEY (calendar_id)
);

DROP PROCEDURE IF EXISTS Populate_calendar;
DELIMITER //
CREATE PROCEDURE Populate_calendar (IN Start_Date DATE, IN End_Date DATE)
BEGIN

	DECLARE calendar_Date DATE;
	DECLARE calendar_Month TINYINT;
	DECLARE calendar_Day TINYINT;
	DECLARE calendar_Year SMALLINT;
	DECLARE calendar_Quarter TINYINT;
	DECLARE Day_Name VARCHAR(9);
	DECLARE Day_of_Week TINYINT;
	DECLARE Day_of_Week_in_Month TINYINT;
	DECLARE Day_of_Week_in_Year TINYINT;
	DECLARE Day_of_Year SMALLINT;
	DECLARE Week_of_Month TINYINT;
	DECLARE Week_of_Year TINYINT;
	DECLARE Month_Name VARCHAR(9);
	DECLARE First_Date_of_Week DATE;
	DECLARE Last_Date_of_Week DATE;
	DECLARE First_Date_of_Month DATE;
	DECLARE Last_Date_of_Month DATE;
	DECLARE First_Date_of_Year DATE;
	DECLARE Last_Date_of_Year DATE;
	DECLARE Is_Holiday BIT;
	DECLARE Holiday_Name VARCHAR(50);
	DECLARE Is_Weekday BIT;
	DECLARE Is_Business_Day BIT;
	DECLARE Is_Leap_Year BIT;
	DECLARE Days_in_Month TINYINT;

	DECLARE dt DATE;
	SET dt = Start_Date;
	WHILE dt <= End_Date DO
		SET calendar_Date = dt;
		SET calendar_Month = MONTH(dt);
		SET calendar_Day = DAYOFMONTH(dt);
		SET calendar_Year = YEAR(dt);
		SET calendar_Quarter = QUARTER(dt);
		SET Day_Name = DAYNAME(dt);
		SET Day_of_Week = DAYOFWEEK(dt);
		SET Day_of_Year = DAYOFYEAR(dt);
		SET Week_of_Year = WEEKOFYEAR(dt);
		SET Month_Name = MONTHNAME(dt);
		SET Day_of_Week_in_Month = FLOOR((calendar_Day + 6) / 7);
		SET Day_of_Week_in_Year = (Day_of_Year + 6) / 7;
		SET Is_Weekday = CASE
			WHEN Day_Name IN ('Sunday', 'Saturday')
				THEN 0
			ELSE 1
			END;
		SET Is_Business_Day = Is_Weekday;
		SET Is_Leap_Year = CASE
			WHEN calendar_Year % 4 <> 0 THEN 0
			WHEN calendar_Year % 100 <> 0 THEN 1
			WHEN calendar_Year % 400 <> 0 THEN 0
			ELSE 1
			END;

		SET Days_in_Month = CASE
			WHEN calendar_Month IN (4, 6, 9, 11) THEN 30				
                	WHEN calendar_Month IN (1, 3, 5, 7, 8, 10, 12) THEN 31
			WHEN calendar_Month = 2 AND Is_Leap_Year = 1 THEN 29
			ELSE 28
			END;
		 
		SET Day_of_Year = DAYOFYEAR(dt);
		SET Week_of_Month = TIMESTAMPDIFF(WEEK, DATE_ADD('1990-01-01', INTERVAL TIMESTAMPDIFF(WEEK, '1990-01-01', DATE_ADD('1990-01-01', INTERVAL TIMESTAMPDIFF(MONTH, '1990-01-01', dt) MONTH)) WEEK), dt) + 1;
		SET First_Date_of_Week = DATE_ADD(dt, INTERVAL -1 * Day_of_Week + 1 DAY);
		SET Last_Date_of_Week = DATE_ADD(dt, INTERVAL 1 * (7 - Day_of_Week) DAY);
		SET First_Date_of_Month = DATE_ADD(dt, INTERVAL -1 * DAYOFMONTH(dt) + 1 DAY);
		SET Last_Date_of_Month = LAST_DAY(dt);
		SET First_Date_of_Year = DATE_ADD('1990-01-01', INTERVAL TIMESTAMPDIFF(YEAR, '1990-01-01', dt) YEAR);
		SET Last_Date_of_Year = DATE_ADD(DATE_ADD('1990-01-01', INTERVAL TIMESTAMPDIFF(YEAR, '1990-01-01', dt) + 1 YEAR), INTERVAL -1 DAY);
		SET dt = DATE_ADD(dt, INTERVAL 1 DAY);

		INSERT INTO calendar (calendar_Date, calendar_Month, calendar_Day, calendar_Year, calendar_Quarter, Day_Name, Day_of_Week, Day_of_Week_in_Month, Day_of_Week_in_Year, Day_of_Year, Week_of_Month, Week_of_Year, 
Month_Name, First_Date_of_Week, Last_Date_of_Week, First_Date_of_Month, Last_Date_of_Month, First_Date_of_Year, Last_Date_of_Year, Is_Holiday, Holiday_Name, Is_Weekday, Is_Business_Day, Is_Leap_Year, Days_in_Month)
		VALUES
			(calendar_Date, calendar_Month, calendar_Day, calendar_Year, 
calendar_Quarter, Day_Name, Day_of_Week, Day_of_Week_in_Month, Day_of_Week_in_Year, Day_of_Year, Week_of_Month, Week_of_Year, Month_Name, First_Date_of_Week, Last_Date_of_Week, First_Date_of_Month, Last_Date_of_Month, First_Date_of_Year, Last_Date_of_Year, 0, NULL, Is_Weekday, Is_Business_Day, Is_Leap_Year, Days_in_Month);
	END WHILE;

		-- New Year's Day: 1st of January
		UPDATE calendar
		SET Is_Holiday = 1,
		Holiday_Name = 'New Year''s Day'
		WHERE calendar.calendar_Month = 1
		AND calendar.calendar_Day = 1
		AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
	 
		-- Martin Luther King, Jr. Day: 3rd Monday in January, beginning in 1983
		UPDATE calendar
		SET Is_Holiday = 1,
		Holiday_Name = 'Martin Luther King, Jr. Day'
		WHERE calendar.calendar_Month = 1
		AND calendar.Day_of_Week = 2
		AND calendar.Day_of_Week_in_Month = 3
		AND calendar.calendar_Year >= 1983
		AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
	 
		-- President's Day: 3rd Monday in February
		UPDATE calendar
		SET Is_Holiday = 1,
		Holiday_Name = 'President''s Day'
		WHERE calendar.calendar_Month = 2
		AND calendar.Day_of_Week = 2
		AND calendar.Day_of_Week_in_Month = 3
		AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
 
 
	-- Memorial Day: Last Monday in May
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Memorial Day'
	WHERE calendar.calendar_Month = 5
	AND calendar.Day_of_Week = 2
	AND calendar.Day_of_Week_in_Month = (SELECT MAX(calendar_Memorial_Day_Check.Day_of_Week_in_Month) FROM (SELECT * FROM cb_db.calendar) AS calendar_Memorial_Day_Check 
WHERE calendar_Memorial_Day_Check.calendar_Month = calendar.calendar_Month												
                                                                       AND 
calendar_Memorial_Day_Check.Day_of_Week = calendar.Day_of_Week
				                                       AND 
calendar_Memorial_Day_Check.calendar_Year = calendar.calendar_Year)
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
 
	-- Independence Day (USA): 4th of July
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Independence Day (USA)'
	WHERE calendar.calendar_Month = 7
	AND calendar.calendar_Day = 4
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
 
	-- Labor Day: 1st Monday in September
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Labor Day'
	WHERE calendar.calendar_Month = 9
	AND calendar.Day_of_Week = 2
	AND calendar.Day_of_Week_in_Month = 1
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
 
	-- Columbus Day: 2nd Monday in October
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Columbus Day'
	WHERE calendar.calendar_Month = 10
	AND calendar.Day_of_Week = 2
	AND calendar.Day_of_Week_in_Month = 2
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
 
	-- Veteran's Day: 11th of November
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Veteran''s Day'
	WHERE calendar.calendar_Month = 11
	AND calendar.calendar_Day = 11
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
 
	-- Thanksgiving: 4th Thursday in November
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Thanksgiving'
	WHERE calendar.calendar_Month = 11
	AND calendar.Day_of_Week = 5
	AND calendar.Day_of_Week_in_Month = 4
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;

	-- Christmas: 25th of December
	UPDATE calendar
	SET Is_Holiday = 1,
	Holiday_Name = 'Christmas'
	WHERE calendar.calendar_Month = 12
	AND calendar.calendar_Day = 25
	AND calendar.calendar_Date BETWEEN Start_Date AND End_Date;
END;
//
DELIMITER ;

CALL Populate_calendar ('2019-01-01', '2019-12-31');

CREATE TABLE appointment (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	calendar_id INT UNSIGNED NOT NULL,
	time TIME NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	manager_id SMALLINT UNSIGNED NOT NULL,
	customer_id SMALLINT UNSIGNED NOT NULL,
	service_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE unavailable (
	id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
	calendar_id INT UNSIGNED NOT NULL,
	time TIME NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE branch_unavailable (
	unavailable_id SMALLINT UNSIGNED NOT NULL,
	branch_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (unavailable_id, branch_id)
);

CREATE TABLE manager_unavailable (
	unavailable_id SMALLINT UNSIGNED NOT NULL,
	manager_id SMALLINT UNSIGNED NOT NULL,
	PRIMARY KEY (unavailable_id, manager_id)
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
	ADD FOREIGN KEY (calendar_id)
	REFERENCES calendar (calendar_id)
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

ALTER TABLE appointment
	ADD FOREIGN KEY (service_id)
	REFERENCES service (id)
	ON DELETE CASCADE;

ALTER TABLE unavailable
	ADD FOREIGN KEY (calendar_id)
	REFERENCES calendar (calendar_id)
	ON DELETE CASCADE;

ALTER TABLE branch_hours
	ADD FOREIGN KEY(branch_id)
	REFERENCES branch (id)
	ON DELETE CASCADE;

ALTER TABLE branch_unavailable
	ADD FOREIGN KEY(branch_id)
	REFERENCES branch (id)
	ON DELETE CASCADE;

ALTER TABLE branch_unavailable
	ADD FOREIGN KEY(unavailable_id)
	REFERENCES unavailable (id)
	ON DELETE CASCADE;

ALTER TABLE manager_unavailable
	ADD FOREIGN KEY(manager_id)
	REFERENCES manager (id)
	ON DELETE CASCADE;

ALTER TABLE manager_unavailable
	ADD FOREIGN KEY(unavailable_id)
	REFERENCES unavailable (id)
	ON DELETE CASCADE;

DROP PROCEDURE IF EXISTS future_unavailable;
DELIMITER //
CREATE PROCEDURE future_unavailable (IN unavailable_id SMALLINT UNSIGNED)
BEGIN
	DECLARE date_counter DATE;
	DECLARE end_date DATE;
	DECLARE day_of_week VARCHAR(10);
	DECLARE id_update INT UNSIGNED;
	DECLARE set_time TIME;

	SELECT calendar_id INTO id_update
	FROM unavailable
	WHERE unavailable.id = unavailable_id;

	SELECT time INTO set_time
	FROM unavailable
	WHERE unavailable.id = unavailable_id;

	SELECT Calendar_date INTO date_counter
	FROM calendar 
	WHERE calendar_id = (
			SELECT calendar_id 
			FROM unavailable 
			WHERE id = unavailable_id);
	
	SET day_of_week = DAYNAME(date_counter);
	SET date_counter = DATE_ADD(date_counter, INTERVAL 1 DAY);
	SELECT Calendar_date INTO end_date
	FROM calendar
	WHERE calendar_id = (
		SELECT calendar_id 
		FROM calendar
		ORDER BY calendar_id DESC
		LIMIT 0,1);

	WHILE date_counter <= end_date DO
		IF DAYNAME(date_counter) = day_of_week THEN
			INSERT INTO unavailable (calendar_id, time)
				VALUES
					(id_update, set_time);
		END IF;
		SET date_counter = DATE_ADD(date_counter, INTERVAL 1 DAY);
		SET id_update = id_update + 1;
		
	END WHILE;
END;
//
DELIMITER ;

DROP PROCEDURE IF EXISTS set_default_times;
DELIMITER //
CREATE PROCEDURE set_default_times()
BEGIN
	DECLARE base_time TIME;
	DECLARE counter INT UNSIGNED;
	DECLARE var_time TIME;
	DECLARE bank_id SMALLINT UNSIGNED;
	DECLARE max_bank_id SMALLINT UNSIGNED;

	SELECT id INTO bank_id
	FROM branch
	WHERE id = 1
	LIMIT 0, 1;

	SELECT id INTO max_bank_id
	FROM branch
	WHERE id = (
		SELECT id 
		FROM branch
		ORDER BY id DESC
		LIMIT 0,1);

	SET base_time = "8:00:00";
	
	WHILE bank_id <= max_bank_id DO
		SET counter = 0;
		WHILE counter < 5 DO
			SET var_time = base_time;
			WHILE var_time < "17:00:00" DO
				INSERT INTO branch_hours (open_time, close_time, branch_id, day_of_week)
					VALUES
						(var_time, ADDTIME(var_time, "1:00:00"), bank_id, counter);
				SET var_time = ADDTIME(var_time, "1:00:00");
			END WHILE;
			SET counter = counter +1; 
		END WHILE;
		SET bank_id = bank_id + 1;
	END WHILE;
END;
//
DELIMITER ;
#######################################################################
## Populate database
#######################################################################

INSERT INTO branch (street_address, city, state, zip, name)
	VALUES
		("1234 Main Street", "Warrensburg", "Missouri", 66446, "First Branch"),
		("4444 South Street", "Warrensburg", "Missouri", 66446, "Second Branch"),
		("9876 North Street", "Warrensburg", "Missouri", 66446, "Third Branch");

INSERT INTO service (service)
	VALUES
		("Checking Account"),
		("Savings Account"),
		("Money Market Account"),
		("Student Banking"),
		("Auto Loans"),
		("Home Equity"),
		("Mortgage"),
		("Student Loans"),
		("Saving for Retirement"),
		("Investment Account"),
		("Credit Card"),
		("Other");

INSERT INTO customer (f_name, l_name, phone_num, email)
	VALUES
		("John", "Doe", "9135555555", "jdoe@ucmo.edu"),
		("Jane", "Doe", "8165555555", "jadoe@ucmo.edu"),
		("Bob", "Smith", "6605555555", "bsmith@ucmo.edu"),
		("Larry", "Jones", "9905555555", "ljones@ucmo.edu");

INSERT INTO manager (f_name, l_name, phone_num, email, branch_id)
	VALUES
		("LeBron", "James", "6607777777", "ljames@ucmo.edu", 1),
		("Tom", "Brady", "6608888888", "tbrady@ucmo.edu", 2),
		("Steph", "Curry", "9137777777", "scurry@ucmo.edu", 3);

INSERT INTO unavailable (calendar_id, time)
	VALUES
		(3, "12:00:00");

INSERT INTO appointment (calendar_id, time, branch_id, manager_id, customer_id, service_id)
	VALUES
		(5, "10:00:00", 1, 1, 1, 1),
		(27, "13:00:00", 2, 3, 2, 2);

INSERT INTO skills (manager_id, service_id)
	VALUES
		(1, 1),
		(1, 2),
		(1, 3),
		(1, 4),
		(1, 5),
		(1, 6),
		(1, 7),
		(1, 8),
		(1, 9),
		(1, 10),
		(1, 11),
		(1, 12),
		(2, 3),
		(2, 7),
		(2, 9),
		(2, 12),
		(3, 4),
		(3, 7),
		(3, 1),
		(3, 11);

CALL future_unavailable(1);

CALL set_default_times();




