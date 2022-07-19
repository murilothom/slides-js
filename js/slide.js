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

  moveSlide = (positionX) => {
    this.slide.style.transform = `translate3d(${positionX}px, 0, 0)`;
  };

  updatePosition = (clientX) => {
    this.dist.movement = (this.dist.startX - clientX) * 1.3;
    return this.dist.moved - this.dist.movement;
  };

  onStart = (e) => {
    let moveType;
    if (e.type === "mousedown") {
      e.preventDefault();
      this.dist.startX = e.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = e.changedTouches[0].clientX;
      moveType = "touchmove";
    }
    this.wrapper.addEventListener(moveType, this.onMove);
  };

  onMove = (e) => {
    const pointerPosition =
      e.type === "mousemove" ? e.clientX : e.changedTouches[0].clientX;
    this.dist.finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(this.dist.finalPosition);
  };

  onEnd = (e) => {
    const moveType = e.type === "mouseup" ? "mousemove" : "touchmove";
    this.wrapper.removeEventListener(moveType, this.onMove);
    this.dist.moved = this.dist.finalPosition;
  };

  addSlideEvents = () => {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  };

  // configuracao slides

  slidePosition = (slide) => {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  };

  slidesConfig = () => {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  };

  slideIndexNav = (index) => {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: !index ? undefined : index - 1,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  };

  changeSlide = (index) => {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.moved = activeSlide.position;
  };

  init = () => {
    this.addSlideEvents();
    this.slidesConfig();
    return this;
  };
}
