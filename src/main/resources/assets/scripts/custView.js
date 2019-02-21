var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var One = function (_React$Component) {
    _inherits(One, _React$Component);

    function One(props) {
        _classCallCheck(this, One);

        return _possibleConstructorReturn(this, (One.__proto__ || Object.getPrototypeOf(One)).call(this, props));
    }

    _createClass(One, [{
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'h1',
                    null,
                    'What can we help you with?'
                ),
                React.createElement(
                    'p',
                    null,
                    'Choose as many topics as you need.'
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'button',
                        null,
                        'Checking Account'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Savings Account'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'CDs/Money Market Accounts'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Student Banking'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Auto Loans'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Home Equity'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Mortgage'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Student Loans'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Saving for Retirement'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Investment Account'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Credit Card'
                    ),
                    React.createElement(
                        'button',
                        null,
                        'Other'
                    )
                )
            );
        }
    }]);

    return One;
}(React.Component);

ReactDOM.render(React.createElement(One, null), document.getElementById('test'));