import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class DropdownSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dropdownOpen: false,
      selected: ""
    }
  }

  componentDidMount = () => {
    this.setState({
      selected: this.props.selected
    });
  }

  toggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  };

  onClick = (event) => {
    let value = event.currentTarget.getAttribute("dropDownValue")
    let text = event.currentTarget.getAttribute("text")

    this.setState({ selected: text }, () => { this.props.onChange(value) })
  }

  render() {
    return (
      <Dropdown className={this.props.customClass} isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>
          {this.state.selected}
        </DropdownToggle>
        <DropdownMenu>
          {
            this.props.items.map(item => {
              return(
                <DropdownItem onClick={this.onClick} dropDownValue={item.value} text={item.text}>{item.text}</DropdownItem>
              )
            })
          }
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DropdownSelect