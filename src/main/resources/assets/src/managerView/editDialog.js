import React from 'react'

export default class EditDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editValues: this.props.editItems,
            showOptions: false,
            optionsId: 0,
        }

        this.itemRefs = [];
        this.optionRefs = [];
        this.props.editItems.forEach(() => {
            this.itemRefs.push(React.createRef());
            this.optionRefs.push(React.createRef());
        });
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick.bind(this), false);
    }

    handleChange(i, e) {
        const newEditValues = this.state.editValues;
        newEditValues[i] = e.target.value;

        this.setState({
            editValues: newEditValues,
        })
    }

    showOptions(index) {
        this.setState({
            showOptions: true,
            optionsId: index,
        })
    }

    optionClicked(index, optionItem) {
        const newEditValues = this.state.editValues;
        newEditValues[index] = optionItem;

        this.itemRefs[index].current.value = optionItem;

        this.setState({
            editValues: newEditValues,
            showOptions: false,
        })
    }

    handleOutsideClick(event) {
        this.optionRefs.forEach((r, i) => {
            if (!r.current) {
                return;
            }

            if (!r.current.contains(event.target) && event.target != this.itemRefs[i].current) {

                this.setState({
                    showOptions: false,
                })
            }
        })
    }

    render() {
        const styles = {
            top: this.props.topPosition
        }

        return (
            <div className="editDialog" style={styles} key={this.props.editId}>
                {
                    this.props.editItems.map((item, index) => {
                        return (
                            <div key={index} className="editItem">
                                <input ref={this.itemRefs[index]} type="text" defaultValue={item}
                                    className={this.props.editErrors[index] ? "editError" : ""}
                                    onChange={this.handleChange.bind(this, index)}
                                    onClick={this.showOptions.bind(this, index)} />
                                {
                                    this.state.showOptions &&
                                    this.props.editOptions &&
                                    this.props.editOptions[this.state.optionsId] &&
                                    index == this.state.optionsId &&
                                    <div ref={this.optionRefs[index]} className="editOptions">
                                        {
                                            this.props.editOptions[this.state.optionsId].map((optionItem, i) => {
                                                return (
                                                    <div key={i} className="editOptionItem" onClick={this.optionClicked.bind(this, index, optionItem)}>
                                                        {optionItem}
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
                <input type="submit" value="Save" onClick={this.props.saveHandler.bind(this, this.props.editId, this.state.editValues)} />
                <input type="submit" value="X" onClick={this.props.closeHandler.bind(this)} />
            </div>
        );
    }
}