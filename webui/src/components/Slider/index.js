import React, { Component } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import { Motion, spring } from 'react-motion';

const TRESHOLD = 100;
const GUTTER = 30;

const springConfig = { stiffness: 300, damping: 50 };

const controlBound = (pos, height) => {
  return _.clamp(pos, 0, height);
};

const SliderWrapper = styled.div`
  overflow-x: hidden;
`;

const SliderBoard = styled.div`
  margin-left: ${GUTTER}px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const SlideItem = styled.div`
  width: ;
  flex-shrink: 0;
`;

class Slider extends Component {

  static defaultProps = {
    start: 0,
    children: [],
  }

  state = {
    width: 320,
    current: 0,
    delta: 0,
    pressX: 0,
    pos: 0,
    isPressed: false,
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    const w = window;
    const d = document;
    const documentElement = d.documentElement;
    const body = d.getElementsByTagName('body')[0];
    const width = w.innerWidth || documentElement.clientWidth || body.clientWidth;
    // const height = w.innerHeight || documentElement.clientHeight || body.clientHeight;

    this.setState({ width });
  }

  goNext = () => {
    this.setState({ current: this.state.current + 1 });
  }

  goPrev = () => {
    this.setState({ current: this.state.current - 1 });
  }

  handleMouseDown = (pressX, e) => {
    window.addEventListener('touchmove', this.handleTouchMove);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mouseup', this.handleMouseUp);

    this.setState({
      delta: e.pageX - pressX,
      pressX,
      pos: pressX,
      isPressed: true,
    });

    // this.props.onDragStart();
  }

  handleTouchStart = (e) => { this.handleMouseDown(e.touches[0]); }

  handleMouseMove = ({ pageX }) => {
    const { isPressed, delta } = this.state;
    if (isPressed) {
      const pos = pageX - delta;
      this.setState({
        pos,
      });

      // this.props.onDrag(value);
    }
  }
  handleTouchMove = (e) => { this.handleMouseMove(e.touches[0]); }

  handleMouseUp = (e) => {
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mouseup', this.handleMouseUp);

    this.setState({ isPressed: false, delta: 0 });

    const { pressX, pos } = this.state;

    if (Math.abs(pos - pressX) > TRESHOLD) {
      if (pos < pressX) {
        // go next
        this.goNext();
      } else {
        // go prev
        this.goPrev();
      }
    }

    // TODO: Not sure why, but this prevent double selectOption from touch devices
    e.preventDefault();
    e.stopPropagation();
  }

  handleTouchEnd = (e) => {
    this.handleMouseUp(e);
  }


  render() {
    const sliderWidth = this.state.width;

    const { pos, isPressed } = this.state;
    const style = {
      x: isPressed ? pos : spring(-1 * this.state.current * (sliderWidth - (2 * GUTTER)), springConfig),
    };

    return (
      <SliderWrapper>
        <Motion style={style}>
          {({ x }) => (
            <SliderBoard
              onMouseDown={e => this.handleMouseDown(x, e)}
              onTouchStart={e => this.handleTouchStart(x, e)}
              style={{
                transform: `translate3d(${x}px, 0, 0)`,
                WebkitTransform: `translate3d(${x}px, 0, 0)`,
              }}
            >
              {React.Children.map(this.props.children, (child, i) => (
                <SlideItem key={i} style={{ width: sliderWidth - (2 * GUTTER) }}>{React.cloneElement(child)}</SlideItem>
              ))}
            </SliderBoard>
        )}
        </Motion>
      </SliderWrapper>
    )
  }
}

export default Slider;
