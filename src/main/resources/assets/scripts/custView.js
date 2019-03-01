"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function fixTime(oldTime) {
  // Get AM or PM
  var t = oldTime.slice(-2); // Cut off AM or PM

  var time = oldTime.slice(0, oldTime.length - 2); // Add 12 to hour if PM

  if (t == "PM") {
    var _array = time.split(":");

    if (_array[0] != 12) {
      var newHour = Number(_array[0]) + 12;
      time = newHour + ":00";
    }
  }

  var array = time.split(":"); // Check if hour is single digit

  if (array[0] < 10) {
    time = "0" + array[0] + ":00";
  }

  return time;
}

var CustomerView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CustomerView, _React$Component);

  function CustomerView(props) {
    var _this;

    _classCallCheck(this, CustomerView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomerView).call(this, props));
    _this.state = {
      branches: [],
      services: [],
      appointmentSlots: [],
      serviceId: 0,
      branchId: 0,
      appointmentSlot: null,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      page: 1,
      loading: false
    };
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));

    _this.loadServices();

    return _this;
  }

  _createClass(CustomerView, [{
    key: "handleChange",
    value: function handleChange(event) {
      var target = event.target;
      var value = target.value;
      var name = target.name;
      this.setState(_defineProperty({}, name, value));
    }
  }, {
    key: "addCustomer",
    value: function () {
      var _addCustomer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var url, id;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = "/api/customers/" + this.state.email + "/";
                id = 0; // Check if the customer already exists

                _context.next = 4;
                return $.getJSON(url, function (customer) {
                  if (customer.id > 0) {
                    // Customer already exists, schedule appointment with that id
                    id = customer.id;
                  }
                });

              case 4:
                if (!(id == 0)) {
                  _context.next = 9;
                  break;
                }

                _context.next = 7;
                return $.ajax({
                  type: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  url: '/api/customers/add',
                  data: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    phoneNumber: this.state.phoneNumber,
                    email: this.state.email
                  })
                });

              case 7:
                _context.next = 9;
                return $.getJSON(url, function (customer) {
                  // Call schedule appointment with the new id
                  id = customer.id;
                });

              case 9:
                return _context.abrupt("return", id);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function addCustomer() {
        return _addCustomer.apply(this, arguments);
      }

      return addCustomer;
    }()
  }, {
    key: "loadServices",
    value: function () {
      var _loadServices = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var url;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                url = "/api/services";
                _context2.next = 3;
                return $.getJSON(url, function (servicesList) {
                  var newServices = [];
                  servicesList.forEach(function (service) {
                    newServices.push(service);
                  });

                  _this2.setState({
                    services: newServices
                  });
                });

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function loadServices() {
        return _loadServices.apply(this, arguments);
      }

      return loadServices;
    }()
  }, {
    key: "loadBranches",
    value: function () {
      var _loadBranches = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(id) {
        var _this3 = this;

        var url;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                url = "/api/branches/" + id;
                _context3.next = 3;
                return $.getJSON(url, function (branchesList) {
                  var newBranches = [];
                  branchesList.forEach(function (branch) {
                    newBranches.push(branch);
                  });

                  _this3.setState({
                    branches: newBranches
                  });
                });

              case 3:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function loadBranches(_x) {
        return _loadBranches.apply(this, arguments);
      }

      return loadBranches;
    }()
  }, {
    key: "loadAppointmentSlots",
    value: function () {
      var _loadAppointmentSlots = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(branchId, serviceId) {
        var _this4 = this;

        var url;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                url = "/api/appointment-slots/" + branchId + "/" + serviceId;
                _context4.next = 3;
                return $.getJSON(url, function (appointmentSlotsList) {
                  var newAppointmentSlots = [];
                  appointmentSlotsList.forEach(function (appointmentSlot) {
                    newAppointmentSlots.push(appointmentSlot);
                  });

                  _this4.setState({
                    appointmentSlots: newAppointmentSlots
                  });
                });

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function loadAppointmentSlots(_x2, _x3) {
        return _loadAppointmentSlots.apply(this, arguments);
      }

      return loadAppointmentSlots;
    }()
  }, {
    key: "scheduleAppointment",
    value: function () {
      var _scheduleAppointment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        var customerId;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(this.state.firstName == '' || this.state.lastName == '' || this.state.email == '')) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return");

              case 2:
                // Show a loading image
                this.setState({
                  loading: true
                });
                _context5.next = 5;
                return this.addCustomer();

              case 5:
                customerId = _context5.sent;
                _context5.next = 8;
                return $.ajax({
                  type: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  url: '/api/appointments/add',
                  data: JSON.stringify({
                    calendarId: this.state.appointmentSlot.calendarId,
                    time: fixTime(this.state.appointmentSlot.time),
                    branchId: this.state.branchId,
                    customerId: customerId,
                    serviceId: this.state.serviceId
                  })
                });

              case 8:
                // Show the completion page
                this.setState({
                  page: 5,
                  loading: false
                });

              case 9:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function scheduleAppointment() {
        return _scheduleAppointment.apply(this, arguments);
      }

      return scheduleAppointment;
    }()
  }, {
    key: "handleServiceClicked",
    value: function () {
      var _handleServiceClicked = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(id) {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                // Update service id and show a loading image
                this.setState({
                  serviceId: id,
                  loading: true
                }); // Load the branches based on this service

                _context6.next = 3;
                return this.loadBranches(id);

              case 3:
                this.setState({
                  page: 2,
                  loading: false
                });

              case 4:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function handleServiceClicked(_x4) {
        return _handleServiceClicked.apply(this, arguments);
      }

      return handleServiceClicked;
    }()
  }, {
    key: "handleBranchClicked",
    value: function () {
      var _handleBranchClicked = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(id) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                // Update branch id and show a loading image
                this.setState({
                  branchId: id,
                  loading: true
                }); // Load the appointment slots based on the branch and service

                _context7.next = 3;
                return this.loadAppointmentSlots(id, this.state.serviceId);

              case 3:
                this.setState({
                  page: 3,
                  loading: false
                });

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function handleBranchClicked(_x5) {
        return _handleBranchClicked.apply(this, arguments);
      }

      return handleBranchClicked;
    }()
  }, {
    key: "handleAppointmentSlotClicked",
    value: function handleAppointmentSlotClicked(slot) {
      this.setState({
        appointmentSlot: slot,
        page: 4
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return React.createElement("div", null, this.state.page == 1 && // Show the services when page is 1
      React.createElement("div", null, React.createElement("h1", null, "What can we help you with?"), React.createElement("h2", null, "Choose a service"), React.createElement("div", {
        id: "services"
      }, this.state.services.map(function (service) {
        return React.createElement("button", {
          key: service.id,
          onClick: _this5.handleServiceClicked.bind(_this5, service.id)
        }, service.service);
      }))), this.state.page == 2 && // Show the branches when page is 2
      React.createElement("div", {
        id: "branches"
      }, React.createElement("h2", null, "Choose a branch"), this.state.branches.map(function (branch) {
        return React.createElement("div", {
          className: "branch",
          key: branch.id
        }, React.createElement("p", null, "Name: ", branch.name, " "), React.createElement("input", {
          type: "submit",
          value: "Choose branch",
          disabled: !branch.hasService,
          onClick: _this5.handleBranchClicked.bind(_this5, branch.id)
        }));
      })), this.state.page == 3 && // Show the appointment slots when page is 3
      React.createElement("div", {
        id: "appointmentSlots"
      }, React.createElement("h2", null, "Choose an appointment time"), this.state.appointmentSlots.map(function (slot, i) {
        return React.createElement("input", {
          key: i,
          type: "submit",
          value: slot.day + " " + slot.month + " " + slot.date + " at " + slot.time,
          disabled: slot.taken,
          onClick: _this5.handleAppointmentSlotClicked.bind(_this5, slot)
        });
      })), this.state.page == 4 && // Show the page to enter information when page is 4
      React.createElement("div", null, React.createElement("h2", null, "Please enter your information."), React.createElement("form", null, React.createElement("label", null, "First Name", React.createElement("input", {
        type: "text",
        name: "firstName",
        value: this.state.firstName,
        onChange: this.handleChange
      })), React.createElement("br", null), React.createElement("label", null, "Last Name", React.createElement("input", {
        type: "text",
        name: "lastName",
        value: this.state.lastName,
        onChange: this.handleChange
      })), React.createElement("br", null), React.createElement("label", null, "Email", React.createElement("input", {
        type: "email",
        name: "email",
        value: this.state.email,
        onChange: this.handleChange
      }))), React.createElement("input", {
        type: "submit",
        value: "Schedule Appointment",
        id: "scheduleButton",
        onClick: this.scheduleAppointment.bind(this)
      })), this.state.page == 5 && // Show the confimation screen when page is 5
      React.createElement("div", null, React.createElement("p", null, "You have successfully scheduled an appointment")), this.state.loading && // Show the loading image when page is loading something
      React.createElement("div", null, React.createElement("img", {
        id: "loadingImage",
        src: "./images/loading.gif"
      })));
    }
  }]);

  return CustomerView;
}(React.Component);

ReactDOM.render(React.createElement(CustomerView, null), document.getElementById('root'));