import React from 'react'

export default class EditDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editValues: this.props.editItems,
        }
    }

    handleChange(i, e) {
        const newEditValues = this.state.editValues;
        newEditValues[i] = e.target.value;

        this.setState({
            editValues: newEditValues,
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
                        return <input key={index} type="text" defaultValue={item} className={this.props.editErrors[index] ? "editError" : ""} onChange={this.handleChange.bind(this, index)} />
                    })
                }
                <input type="submit" value="Save" onClick={this.props.saveHandler.bind(this, this.props.editId, this.state.editValues)} />
                <input type="submit" value="X" onClick={this.props.closeHandler.bind(this)} />
            </div>
        );
    }
}