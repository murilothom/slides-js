import debounce from "./debounce.js";

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = {
      finalPosition: 0,
      startX: 0,
      movement: 0,
      moved: 0,
    };
    this.activeClass = "active";
    this.changeEvent = new Event("changeEvent");
  }

  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
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
    this.transition(false);
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
    this.transition(true);
    this.changeSlideOnEnd();
  };

  changeSlideOnEnd = () => {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  };

  addSlideEvents = () => {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  };

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
    this.changeActiveClass();
    this.wrapper.dispatchEvent(this.changeEvent);
  };

  changeActiveClass = () => {
    this.slideArray.forEach((slide) => {
      slide.element.classList.remove(this.activeClass);
    });
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  };

  activePrevSlide = () => {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  };

  activeNextSlide = () => {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  };

  onResize = () => {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 500);
  };

  addResizeEvent = () => {
    window.addEventListener("resize", debounce(this.onResize, 200));
  };

  init = () => {
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0);
    return this;
  };
}

export class SlideNav extends Slide {
  addArrow = (prev, next) => {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  };

  addArrowEvent = () => {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  };

  createControl = () => {
    const control = document.createElement("ul");
    control.dataset.control = "slide";

    this.slideArray.forEach((slide, index) => {
      control.innerHTML += `<li><a href="#slide${index + 1}">${
        index + 1
      }</a></li>`;
    });
    this.wrapper.appendChild(control);
    return control;
  };

  eventControl = (item, index) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      this.changeSlide(index);
    });
    this.wrapper.addEventListener("changeEvent", this.activeControlItem);
  };

  activeControlItem = () => {
    this.controlArray.forEach((item) => {
      item.classList.remove(this.activeClass);
    });
    this.controlArray[this.index.active].classList.add(this.activeClass);
  };

  addControl = (customControl) => {
    this.control =
      document.querySelector(customControl) || this.createControl();
    this.controlArray = [...this.control.children];

    this.activeControlItem();
    this.controlArray.forEach((item, index) => {
      this.eventControl(item, index);
    });
  };
}
