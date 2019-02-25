var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function fixTime(oldTime) {
    // Get AM or PM
    var t = oldTime.slice(-2);

    // Cut off AM or PM
    var time = oldTime.slice(0, oldTime.length - 2);

    // Add 12 to hour if PM
    if (t == "PM") {
        var _array = time.split(":");
        if (_array[0] != 12) {
            var newHour = Number(_array[0]) + 12;
            time = newHour + ":00";
        }
    }

    var array = time.split(":");

    // Check if hour is single digit
    if (array[0] < 10) {
        time = "0" + array[0] + ":00";
    }

    return time;
}

var CustomerView = function (_React$Component) {
    _inherits(CustomerView, _React$Component);

    function CustomerView(props) {
        _classCallCheck(this, CustomerView);

        var _this = _possibleConstructorReturn(this, (CustomerView.__proto__ || Object.getPrototypeOf(CustomerView)).call(this, props));

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

        _this.handleChange = _this.handleChange.bind(_this);
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
        value: function addCustomer() {
            var _this2 = this;

            var url = "/api/customers/" + this.state.email + "/";

            // Check if the customer already exists
            $.getJSON(url, function (customer) {
                if (customer.id > 0) {
                    // Customer already exists, schedule appointment with that id
                    _this2.scheduleAppointment(customer.id);
                } else {
                    // Create a new customer
                    $.ajax({
                        type: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        url: '/api/customers/add',
                        data: JSON.stringify({
                            firstName: _this2.state.firstName,
                            lastName: _this2.state.lastName,
                            phoneNumber: _this2.state.phoneNumber,
                            email: _this2.state.email
                        }),
                        success: function success() {
                            // Get the id of the customer just created
                            $.getJSON(url, function (customer) {
                                // Call schedule appointment with the new id
                                _this2.scheduleAppointment(customer.id);
                            });
                        }
                    });
                }
            });
        }
    }, {
        key: "loadServices",
        value: function loadServices() {
            var _this3 = this;

            var url = "/api/services";

            $.getJSON(url, function (servicesList) {
                var newServices = [];
                servicesList.forEach(function (service) {
                    newServices.push(service);
                });

                _this3.setState({
                    services: newServices
                });
            });
        }
    }, {
        key: "loadBranches",
        value: function loadBranches(id) {
            var _this4 = this;

            var url = "/api/branches/" + id;

            $.getJSON(url, function (branchesList) {
                var newBranches = [];
                branchesList.forEach(function (branch) {
                    newBranches.push(branch);
                });

                _this4.setState({
                    branches: newBranches
                });
            });
        }
    }, {
        key: "loadAppointmentSlots",
        value: function loadAppointmentSlots(branchId, serviceId) {
            var _this5 = this;

            var url = "/api/appointment-slots/" + branchId + "/" + serviceId;

            $.getJSON(url, function (appointmentSlotsList) {
                var newAppointmentSlots = [];
                appointmentSlotsList.forEach(function (appointmentSlot) {
                    newAppointmentSlots.push(appointmentSlot);
                });

                _this5.setState({
                    appointmentSlots: newAppointmentSlots
                });
            });
        }
    }, {
        key: "scheduleAppointment",
        value: function scheduleAppointment(customerId) {
            console.log(customerId);
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
        }
    }, {
        key: "handleServiceClicked",
        value: function handleServiceClicked(id) {
            this.setState({
                serviceId: id
            });

            // Load the branches based on this service
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
            var _this6 = this;

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "h1",
                    null,
                    "What can we help you with?"
                ),
                React.createElement(
                    "p",
                    null,
                    "Choose as many topics as you need."
                ),
                React.createElement(
                    "div",
                    { id: "services" },
                    this.state.services.map(function (service) {
                        return React.createElement(
                            "button",
                            { key: service.id, onClick: _this6.handleServiceClicked.bind(_this6, service.id) },
                            service.service
                        );
                    })
                ),
                React.createElement(
                    "div",
                    { id: "branches" },
                    this.state.branches.map(function (branch) {
                        return React.createElement(
                            "div",
                            { className: "branch", key: branch.id },
                            React.createElement(
                                "p",
                                null,
                                "Name: ",
                                branch.name,
                                " "
                            ),
                            React.createElement("input", { type: "submit", value: "Choose branch", disabled: !branch.hasService, onClick: _this6.handleBranchClicked.bind(_this6, branch.id) })
                        );
                    })
                ),
                React.createElement(
                    "div",
                    { id: "appointmentSlots" },
                    this.state.appointmentSlots.map(function (slot, i) {
                        return React.createElement("input", { key: i, type: "submit", value: slot.day + " " + slot.month + " " + slot.date + " at " + slot.time, disabled: slot.taken, onClick: _this6.handleAppointmentSlotClicked.bind(_this6, slot) });
                    })
                ),
                React.createElement(
                    "h2",
                    null,
                    "Please enter your information."
                ),
                React.createElement(
                    "form",
                    null,
                    React.createElement(
                        "label",
                        null,
                        "First Name",
                        React.createElement("input", { type: "text", name: "firstName", value: this.state.firstName, onChange: this.handleChange })
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        "Last Name",
                        React.createElement("input", { type: "text", name: "lastName", value: this.state.lastName, onChange: this.handleChange })
                    ),
                    React.createElement("br", null),
                    React.createElement(
                        "label",
                        null,
                        "Email",
                        React.createElement("input", { type: "email", name: "email", value: this.state.email, onChange: this.handleChange })
                    )
                ),
                React.createElement("input", { type: "submit", value: "Schedule Appointment", id: "scheduleButton", onClick: this.addCustomer.bind(this) })
            );
        }
    }]);

    return CustomerView;
}(React.Component);

ReactDOM.render(React.createElement(CustomerView, null), document.getElementById('root'));