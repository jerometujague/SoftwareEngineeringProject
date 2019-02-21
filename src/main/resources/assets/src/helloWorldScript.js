const host = "";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            branches: [],
        }
    }

    loadBranches() {
        let url = host + "/api/branches";

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

    updateBranch() {
        let branchID = 4;

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
        const divs = [];

        this.state.branches.forEach((branch) => {
            divs.push(<p>
                {
                    branch.name
                }
            </p>);
            divs.push(<p>
                {
                    branch.id
                }
            </p>);
            divs.push(<p>
                {
                    branch.streetAddress
                }
            </p>);
            divs.push(<p>
                {
                    branch.city
                }
            </p>);
            divs.push(<p>
                {
                    branch.state
                }
            </p>);
            divs.push(<p>
                {
                    branch.zipCode
                }
            </p>);

        });

        return <div>{divs}</div>;
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);