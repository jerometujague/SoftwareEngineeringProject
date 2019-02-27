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
      email: ''
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
    value: function loadServices() {
      var _this2 = this;

      var url = "/api/services";
      $.getJSON(url, function (servicesList) {
        var newServices = [];
        servicesList.forEach(function (service) {
          newServices.push(service);
        });

        _this2.setState({
          services: newServices
        });
      });
    }
  }, {
    key: "loadBranches",
    value: function loadBranches(id) {
      var _this3 = this;

      var url = "/api/branches/" + id;
      $.getJSON(url, function (branchesList) {
        var newBranches = [];
        branchesList.forEach(function (branch) {
          newBranches.push(branch);
        });

        _this3.setState({
          branches: newBranches
        });
      });
    }
  }, {
    key: "loadAppointmentSlots",
    value: function loadAppointmentSlots(branchId, serviceId) {
      var _this4 = this;

      var url = "/api/appointment-slots/" + branchId + "/" + serviceId;
      $.getJSON(url, function (appointmentSlotsList) {
        var newAppointmentSlots = [];
        appointmentSlotsList.forEach(function (appointmentSlot) {
          newAppointmentSlots.push(appointmentSlot);
        });

        _this4.setState({
          appointmentSlots: newAppointmentSlots
        });
      });
    }
  }, {
    key: "scheduleAppointment",
    value: function () {
      var _scheduleAppointment = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var customerId;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.addCustomer();

              case 2:
                customerId = _context2.sent;
                // Send the schedule request
                $.ajax({
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

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function scheduleAppointment() {
        return _scheduleAppointment.apply(this, arguments);
      }

      return scheduleAppointment;
    }()
  }, {
    key: "handleServiceClicked",
    value: function handleServiceClicked(id) {
      this.setState({
        serviceId: id
      }); // Load the branches based on this service

      this.loadBranches(id);
    }
  }, {
    key: "handleBranchClicked",
    value: function handleBranchClicked(id) {
      this.setState({
        branchId: id
      });
      this.loadAppointmentSlots(id, this.state.serviceId);
    }
  }, {
    key: "handleAppointmentSlotClicked",
    value: function handleAppointmentSlotClicked(slot) {
      this.setState({
        appointmentSlot: slot
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      return React.createElement("div", null, React.createElement("h1", null, "What can we help you with?"), React.createElement("p", null, "Choose as many topics as you need."), React.createElement("div", {
        id: "services"
      }, this.state.services.map(function (service) {
        return React.createElement("button", {
          key: service.id,
          onClick: _this5.handleServiceClicked.bind(_this5, service.id)
        }, service.service);
      })), React.createElement("div", {
        id: "branches"
      }, this.state.branches.map(function (branch) {
        return React.createElement("div", {
          className: "branch",
          key: branch.id
        }, React.createElement("p", null, "Name: ", branch.name, " "), React.createElement("input", {
          type: "submit",
          value: "Choose branch",
          disabled: !branch.hasService,
          onClick: _this5.handleBranchClicked.bind(_this5, branch.id)
        }));
      })), React.createElement("div", {
        id: "appointmentSlots"
      }, this.state.appointmentSlots.map(function (slot, i) {
        return React.createElement("input", {
          key: i,
          type: "submit",
          value: slot.day + " " + slot.month + " " + slot.date + " at " + slot.time,
          disabled: slot.taken,
          onClick: _this5.handleAppointmentSlotClicked.bind(_this5, slot)
        });
      })), React.createElement("h2", null, "Please enter your information."), React.createElement("form", null, React.createElement("label", null, "First Name", React.createElement("input", {
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
      }));
    }
  }]);

  return CustomerView;
}(React.Component);

ReactDOM.render(React.createElement(CustomerView, null), document.getElementById('root'));