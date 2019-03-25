**List Branches**
----
  Returns an array of json branch objects

* **URL**

  /api/branches

* **Method:**

  `GET`
  
*  **URL Params**

    None

* **Data Params**

    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    `[
        {
            "id": 1,
            "streetAddress": "1234 Main Street",
            "city": "Warrensburg",
            "state": "Missouri",
            "zipCode": 66446,
            "name": "First Branch",
            "hasService": false,
            "appointmentCount": 0
        }
    ]`

* **Sample Call:**

  ```javascript
    $.ajax({
        url: "/api/branches",
        type: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function(data) {
            console.log(data);
        }
    });
  ```