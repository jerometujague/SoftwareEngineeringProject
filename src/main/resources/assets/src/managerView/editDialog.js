import React from 'react'

export class EditItem {
    /**
    * The EditItem object that is a field in the EditorDialog.
    * @param name The name of the editable field.
    * @param value The initial value of the item.
    * @param options The array of options that are suggestions for this field
    * @param multiSelect A boolean value that determines if this field accepts multiple select.
    */
    constructor(name, value, options, multiSelect = false) {
        this.name = name;
        this.value = value;
        this.options = options;
        this.multiSelect = multiSelect;
    }
}

export class EditorData {
    /**
    * The EditorData object to be passed into the EditDialog component.
    * @param editId The unique id of the row being edited.
    * @param editItems The array of values of fields to edit.
    * @param editErrors The array of error messages to show for each field.
    */
    constructor(editId, editItems, editErrors) {
        this.editId = editId;
        this.editItems = editItems;
        this.editErrors = editErrors;
    }
}

export class EditDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editValues: this.props.editorData.editItems.map(i => i.value),
            showOptions: false,
            optionsId: 0,
        }

        this.itemRefs = [];
        this.optionRefs = [];
        this.props.editorData.editItems.forEach(() => {
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

    optionClicked(index, optionItem, multiSelect) {
        const newEditValues = this.state.editValues;

        // Check if this is a multi select input
        if (multiSelect) {
            // Check if this option is already checked
            if (this.itemRefs[index].current.value.indexOf(optionItem) >= 0) {
                if (this.itemRefs[index].current.value.indexOf(',') >= 0) {
                    // Check if this is the first option
                    if (this.itemRefs[index].current.value.indexOf(optionItem) == 0) {
                        this.itemRefs[index].current.value = this.itemRefs[index].current.value.replace(optionItem + ', ', '')
                    } else {
                        this.itemRefs[index].current.value = this.itemRefs[index].current.value.replace(', ' + optionItem, '')
                    }
                } else {
                    this.itemRefs[index].current.value = this.itemRefs[index].current.value.replace(optionItem, '')
                }
            } else {
                // Check if there are any options clicked
                if (this.itemRefs[index].current.value.length > 0) {
                    this.itemRefs[index].current.value = this.itemRefs[index].current.value + ', ' + optionItem;
                } else {
                    this.itemRefs[index].current.value = optionItem;
                }
            }
        } else {
            this.itemRefs[index].current.value = optionItem;

            this.setState({
                showOptions: false,
            })
        }

        newEditValues[index] = this.itemRefs[index].current.value;

        this.setState({
            editValues: newEditValues,
        })
    }

    handleOutsideClick(event) {
        this.optionRefs.forEach((r, i) => {
            if (!r.current) {
                return;
            }

            if (!r.current.contains(event.target) &&
                event.target != this.itemRefs[i].current &&
                event.target.className != 'filterItemText' &&
                event.target.className != 'editOptionItem') {
                this.setState({
                    showOptions: false,
                })
            }
        })
    }

    render() {
        const numOptions = 12;

        let counter = 0;

        return (
            <div className="editDialog" key={this.props.editorData.editId} >
                {
                    this.props.editorData.editItems.map((item, index) => {
                        return (
                            <div key={index} className="editItem">
                                <input ref={this.itemRefs[index]} type="text" defaultValue={item.value} placeholder={item.name + '...'}
                                    className={this.props.editorData.editErrors && this.props.editorData.editErrors[index] ? "editError" : ""}
                                    onChange={this.handleChange.bind(this, index)}
                                    onClick={this.showOptions.bind(this, index)} />
                                {
                                    this.state.showOptions &&
                                    item.options &&
                                    index == this.state.optionsId &&
                                    <div ref={this.optionRefs[index]} className="editOptions">
                                        {// Print items that are checked
                                            item.options.map((optionItem, i) => {
                                                if (counter < numOptions && (optionItem.match('^' + this.itemRefs[this.state.optionsId].current.value + '$') ||
                                                    (item.multiSelect && this.itemRefs[this.state.optionsId].current.value.match(optionItem)))) {
                                                    counter++;
                                                    return (
                                                        <div key={i} className="editOptionItem" onClick={this.optionClicked.bind(this, index, optionItem)}>
                                                            <svg className="filterCheckmark" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true"><path fillRule="evenodd" d="M12 5l-8 8-4-4 1.5-1.5L4 10l6.5-6.5L12 5z"></path></svg>
                                                            <p className="filterItemText">{optionItem}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                        {// Print the rest of the items
                                            item.options.map((optionItem, i) => {
                                                if (counter < numOptions && !(optionItem.match('^' + this.itemRefs[this.state.optionsId].current.value + '$') ||
                                                    (item.multiSelect && this.itemRefs[this.state.optionsId].current.value.match(optionItem)))) {
                                                    counter++;
                                                    return (
                                                        <div key={i} className="editOptionItem" onClick={this.optionClicked.bind(this, index, optionItem, item.multiSelect)}>
                                                            <p className="filterItemText">{optionItem}</p>
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </div>
                                }
                            </div>
                        )
                    })
                }
                <input type="submit" value="Save" onClick={this.props.saveHandler.bind(this, this.props.editorData.editId, this.state.editValues)} />
                <input type="submit" value="X" onClick={this.props.closeHandler.bind(this)} />
            </div>
        );
    }
}