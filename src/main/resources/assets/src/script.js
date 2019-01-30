const host = "";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            branches: [],
        }
    }

    loadBranches(){
        var url = host + "/api/branches"; 

        $.getJSON(url, (branchList) => {
            const newBranches = [];
            branchList.forEach((branch) => {
                newBranches.push(branch);
            });

            this.setState({
                branches: newBranches,
            });
        });
    }

    updateBranch(){
        var branchID = 4;

        $.ajax({
            type: 'POST',
            headers: { 
                'Accept': 'application/json',
                'Content-Type': 'application/json' 
            },

            url: host + '/api/branch/' + branchID,
            data: JSON.stringify({
                open: false,
                hours: "9-5",
            })
        });
    }

    render() {
        return <div>Hello world!</div>;
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);