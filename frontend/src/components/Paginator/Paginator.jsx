import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

// const Paginator = (props) => {
class Paginator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      pagesCount: 0,
      currentPage: 1
    }
  }

  componentDidUpdate(nextProps) {
    if (nextProps.pages !== this.props.pages) {
      this.setState({pagesCount: this.props.pages})
      var pages = [];
      for (var i = 0; i < this.props.pages; i++) {
        pages.push(
          <PaginationItem>
            <PaginationLink onClick={e => this.handleClick(e, i)}>
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        )
      }
      this.setState({ pages: pages })
    }

    if (this.props.currentPage !== this.state.currentPage) {      
      this.setState({ currentPage: nextProps.currentPage })
    }
  }
  
  handleClick = (e, page) => {
    e.preventDefault();
    
    this.props.setState({currentPage: page})
    this.setState({ currentPage: page })
  }

  render() {
    return (
      <Pagination aria-label="Page navigation example">
        <PaginationItem disabled={this.state.currentPage <= 1}>
          <PaginationLink first onClick={e => this.handleClick(e, 1)}/>
        </PaginationItem>
        <PaginationItem disabled={this.state.currentPage <= 1}>
          <PaginationLink previous onClick={e => this.handleClick(e, this.state.currentPage-1)}/>
        </PaginationItem>
  
        {[...Array(this.state.pagesCount)].map((page, i) =>
          <PaginationItem active={i+1 === this.state.currentPage} key={i}>
            <PaginationLink onClick={e => this.handleClick(e, i+1)} href="#">
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        )}
  
        <PaginationItem disabled={this.state.currentPage >= this.state.pagesCount}>
          <PaginationLink next onClick={e => this.handleClick(e, this.state.currentPage + 1)} />
        </PaginationItem>
        <PaginationItem disabled={this.state.currentPage >= this.state.pagesCount}>
          <PaginationLink last onClick={e => this.handleClick(e, this.state.pagesCount)} />
        </PaginationItem>
      </Pagination>
    );
  }
}

export default Paginator;