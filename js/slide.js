export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
      moved: 0,
    };
  }

  moveSlide = () => {
    this.slide.style.transform = `translate3d(${this.dist.finalPosition}px, 0, 0)`;
  };

  updatePosition = (clientX) => {
    this.dist.movement = (this.dist.startX - clientX) * 1.3;
    return this.dist.moved - this.dist.movement;
  };

  onStart = (e) => {
    e.preventDefault();
    this.dist.startX = e.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
  };

  onMove = (e) => {
    this.dist.finalPosition = this.updatePosition(e.clientX);
    this.moveSlide(this.dist.finalPosition);
  };

  onEnd = (e) => {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.dist.moved = this.dist.finalPosition;
  };

  addSlideEvents = () => {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  };

  init = () => {
    this.addSlideEvents();
    return this;
  };
}
