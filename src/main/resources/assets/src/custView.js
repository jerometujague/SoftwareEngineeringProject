
class One extends React.Component {
    constructor(props) {
        super(props);
    }


    render(){
        return <div>
            <h1>What can we help you with?</h1>
            <p>Choose as many topics as you need.</p>

            <div>
                <button>Checking Account</button>
                <button>Savings Account</button>
                <button>CDs/Money Market Accounts</button>
                <button>Student Banking</button>
                <button>Auto Loans</button>
                <button>Home Equity</button>
                <button>Mortgage</button>
                <button>Student Loans</button>
                <button>Saving for Retirement</button>
                <button>Investment Account</button>
                <button>Credit Card</button>
                <button>Other</button>
            </div>
        </div>;
    }
}

ReactDOM.render(
    <One/>,
    document.getElementById('test')
);