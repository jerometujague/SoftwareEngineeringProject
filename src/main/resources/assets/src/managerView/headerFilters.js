import React from 'react';

export default class HeaderFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemFilterInput: "",
        }

        this.filterRefs = [];

        this.props.headerNames.forEach(() => {
            this.filterRefs.push(React.createRef());
        })
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick.bind(this), false);
    }

    itemFilterInput(e) {
        this.setState({
            itemFilterInput: e.target.value,
        })
    }

    addFilter(newFilter, type) {
        const filters = this.props.filters;

        const index = filters[type].indexOf(newFilter);
        if (index == -1) {
            filters[type].push(newFilter);
        } else {
            filters[type].splice(index, 1);
        }

        this.props.setFilters(filters);

        this.filterRefs.forEach(ref => {
            ref.current.open = false;
        })
    }

    handleOutsideClick(event) {
        this.filterRefs.forEach(ref => {
            if (!ref.current) {
                return;
            }

            if (!ref.current.contains(event.target)) {
                ref.current.open = false;
                const input = ref.current.getElementsByTagName('input')[0];
                if (input) {
                    input.value = "";
                }
                this.clearFilterInput();
            }
        })
    }

    clearFilterInput() {
        this.setState({
            itemFilterInput: "",
        })
    }

    render() {
        const numPreviewFilters = 5;

        return (<>
            {
                this.props.headerNames.map((headerName, headerIndex) => {
                    let counter = 0;

                    return (
                        <td key={headerIndex}>
                            <details ref={this.filterRefs[headerIndex]}>
                                <summary className={this.props.filterOptions[headerIndex].length > 0 ? "filterHeader hasFilterItems" : "filterHeader"}>{headerName}</summary>
                                {this.props.filterOptions[headerIndex].length > 0 &&
                                    <details-menu class="filterMenu">
                                        <input type="text" placeholder={"Filter " + headerName.toLowerCase()} className="filterInput" onChange={this.itemFilterInput.bind(this)} />
                                        {
                                            this.props.filterOptions[headerIndex].map((name, index) => {
                                                if (counter < numPreviewFilters) {
                                                    // Filter by search input
                                                    if (this.state.itemFilterInput.length > 0 && !name.toLowerCase().match(this.state.itemFilterInput.toLowerCase())) {
                                                        return;
                                                    }

                                                    counter++;

                                                    return (
                                                        <div key={index} className="filterItem" onClick={this.addFilter.bind(this, name, headerIndex)}>
                                                            {
                                                                this.props.filters[headerIndex].includes(name) &&
                                                                <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            }
                                                            <p className="filterItemText">{name}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }

                                    </details-menu>
                                }
                            </details>
                        </td>
                    );
                })
            }
        </>);
    }
}