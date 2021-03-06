

const   titleBar = document.querySelector(".title"),
        promoBar = document.querySelector(".promo"),
        promoLeft = document.querySelector(".promo__text--left"),
        promoRight = document.querySelector(".promo__text--right"),
        prevBtn = document.querySelector(".banner__prev-btn"),
        nextBtn = document.querySelector(".banner__next-btn"),
        bannerNav = document.querySelector(".banner__nav"),
        bannerSlider = document.querySelector(".banner__slider");
let     slides = document.querySelectorAll(".banner__slide"),
        slideSelectors = document.querySelectorAll(".banner__selector-btn");


//Styles and Presentation
class Present {

    moveSlider (index) {
        if(index === 0) {
            bannerSlider.style.opacity = "0";
            bannerSlider.style.marginLeft = "400%";
            setTimeout( () => bannerSlider.style.opacity = "1", 300);
        }
        if(index === 1) {
            bannerSlider.style.marginLeft = "200%";
        }
        if(index === 2) {
            bannerSlider.style.marginLeft = "0";
        }
        if(index === 3) {
            bannerSlider.style.marginLeft = "-200%";
        }
        if(index === 4) {
            bannerSlider.style.marginLeft = "-400%";
        }
    }
    removeActive () {
        for (let slideSelector of slideSelectors) {
            slideSelector.classList.remove("active");
        }
    }

    addActive (index) {
        slideSelectors[index].classList.add("active");
    }
}

window.addEventListener("load", () => {
    const   present = new Present();

    //for initial banner animation
    const   insTitleBar = () => titleBar.style.transform = "translate(0)",
            insPromoBar = () => promoBar.style.transform = "translate(0)",
            dropLeft = () => promoLeft.style.transform = "translate(0)",
            dropRight = () => promoRight.style.transform = "translate(0)";
    setTimeout(insTitleBar, 100);
    setTimeout(insPromoBar, 800);
    setTimeout(dropLeft, 1200);
    setTimeout(dropRight, 1700);

    slides = [...slides];
    const slideCount = slides.length;
    let index = 0;
    nextBtn.addEventListener("click", () => {
        present.removeActive();
        index++;
        if(index > (slideCount - 1)) {
            index = 0;
        }
        present.moveSlider(index);
        present.addActive(index);
    });
    prevBtn.addEventListener("click", () => {
        present.removeActive();
        index--;
        if(index < 0) {
            index = (slideCount - 1);
        }
        present.moveSlider(index);
        present.addActive(index);
    });

    slideSelectors.forEach((selector, index) => {
        selector.addEventListener("click", () => {
            present.removeActive();
            present.moveSlider(index);
            present.addActive(index);
        });
    });

    let setAuto;
    const slideAuto = () => {
        setAuto = setInterval(() => {
            present.removeActive();
            index++;
            if(index > (slideCount - 1)) {
            index = 0;
            }
            present.moveSlider(index);
            present.addActive(index);
        }, 4000);
    }
    slideAuto();

    bannerNav.addEventListener("mouseover", () => {
        clearInterval(setAuto);
        setAuto = 0;
    })

    bannerNav.addEventListener("mouseout", () => {
        slideAuto();
    })
});
