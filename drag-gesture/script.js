"use strict";
const slideContainer = document.querySelector('.slide-container');
const slideItem = document.getElementsByClassName('slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

function slide(slideContainer, slideItem, prev, next) {
    let slideWidth = slideItem[0].offsetWidth;
    let slideLength = slideItem.length;
    let initialPos = "-" + slideLength;
    let currentPos = slideContainer.style.left;
    let threshold = 130;
    let index = 0;
    let firstSlide = slideItem[0];
    let lastSlide = slideItem[slideLength - 1];
    let cloneFirst = firstSlide.cloneNode(true);
    let cloneLast = lastSlide.cloneNode(true);
    let allowShift = true;
    let posX1, posX2, posFinal;

    slideContainer.appendChild(cloneFirst);
    slideContainer.insertBefore(cloneLast, firstSlide);

    // mouse event
    slideContainer.addEventListener('mousedown', dragStart);

    // touch events
    slideContainer.addEventListener('touchstart', dragStart);
    slideContainer.addEventListener('touchmove', dragAction);
    slideContainer.addEventListener('touchend', dragEnd);

    // click events
    next.addEventListener('click', function() { shift(1) });
    prev.addEventListener('click', function() { shift(-1) });

    // transition event
    slideContainer.addEventListener('transitionend', checkIndex);

    function shift(status, action) {
    	if (allowShift) {
    		if (action) {
    			slideContainer.classList.add("shift");
				if (currentPos === '') {
				    currentPos = -400;
				}
				
				if (status === 1) {
				    currentPos = currentPos - 400 + posFinal;
				    slideContainer.style.left = currentPos + "px";
				    index++;
				} else if (status === -1) {
				    currentPos = currentPos + 400 + posFinal;
				    slideContainer.style.left = currentPos + "px";
				    index--;
				} else if (status === 0) {
					currentPos = currentPos + posFinal;
				    slideContainer.style.left = currentPos + "px";
				}
    		} else {
				slideContainer.classList.add("shift");
				if (currentPos === '') {
				    currentPos = -400;
				}
				
				if (status === 1) {
				    currentPos = currentPos - 400;
				    slideContainer.style.left = currentPos + "px";
				    index++;
				} else if (status === -1) {
				    currentPos = currentPos + 400;
				    slideContainer.style.left = currentPos + "px";
				    index--;
				}
    		}
    	}
    	allowShift = false;
    }

    function checkIndex() {
		slideContainer.classList.remove('shift');
		if (index === -1) {
		    index = slideLength - 1;
		    currentPos = 0 - (slideLength * slideWidth);
		    slideContainer.style.left = currentPos + "px";
		} else if (index === slideLength) {
		    index = 0;
		    currentPos = 0 - slideWidth;
		    slideContainer.style.left = currentPos + "px";
		}

		allowShift = true;
    }

    function dragStart(e) {
    	e = e || window.event;

    	posFinal = 0;

    	e.preventDefault();
    	initialPos = slideContainer.offsetLeft;

    	if (e.type == 'touchstart') {
    		posX1 = e.touches[0].clientX;
    	} else {
    		posX1 = e.clientX;
			document.addEventListener('mousemove', dragAction);
			document.addEventListener('mouseup', dragEnd);
    	}
    }

    function dragAction(e) {
    	e = e || window.event;

    	if (currentPos == '') {
    		currentPos = -400;
    	}
		if (e.type == 'touchmove') {
			posX2 = posX1 - e.touches[0].clientX;
			posX1 = e.touches[0].clientX;
			posFinal = posFinal + posX2;
		} else {
			posX2 = posX1 - e.clientX;
			posX1 = e.clientX;
			posFinal = posFinal + posX2;
		}
		currentPos = currentPos - posX2;
		slideContainer.style.left = currentPos + "px";
    }

    function dragEnd(e) {
		if (posFinal > threshold) {
			shift(1, 'drag');
		} else if (posFinal < -threshold) {
			shift(-1, 'drag');
		} else if (posFinal < threshold || posFinal > -threshold) {
			shift(0, 'drag');
		}

		document.removeEventListener('mousemove', dragAction);
		document.removeEventListener('mouseup', dragEnd);
    }
}

slide(slideContainer, slideItem, prev, next);
