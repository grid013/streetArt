   // Carousel *********
    // ------------------
    const slidesWrapper = document.querySelector(".carousel_slides-wrapper")
    const slides = Array.from(slidesWrapper.children)
    const nextBtn = document.querySelector(".carousel_button--right")
    const prevBtn = document.querySelector(".carousel_button--left")
    let slideWidth = slides[0].getBoundingClientRect().width

    const setSlidePosition = (array,slidesWrapper) =>{
        slideWidth = array[0].getBoundingClientRect().width //Get the new slide width
        array.forEach((sl,idx)=> sl.style.left = slideWidth * idx + "px")
        const currentSlide = document.querySelector(".current-slide")
        slidesWrapper.style.transform = `translateX(-${currentSlide.style.left})`
    }
    setSlidePosition(slides,slidesWrapper)

    const moveToSlide = (slidesWrapper, currentSlide, targetSlide, goToSlide)=>{
        if(slidesWrapper.style.transition === "none 0s ease 0s"){
            slidesWrapper.style.transition = "transform 0.25s ease";
        } //After resize set the transition back to normal

        if(targetSlide){
            const amountToMove = targetSlide.style.left
            slidesWrapper.style.transform = `translateX(-${amountToMove})`
            targetSlide.classList.add("current-slide")

        }else{ //If there is no next or previous slide go to this slide...

            const amountToMove = goToSlide.style.left
            slidesWrapper.style.transform = `translateX(-${amountToMove})`
            goToSlide.classList.add("current-slide")
        }

        currentSlide.classList.remove("current-slide")
        //After giving class to the new slide remove it from the old one.
    }

    const hideNotCurrSlides = () =>{
        const notCurrentSlides = document.querySelectorAll("li:not(.current-slide)")
        const currentSlide = document.querySelector(".current-slide")
        notCurrentSlides.forEach(el => el.style.opacity = 0)
        currentSlide.style.opacity = 1
    }


    nextBtn.addEventListener("click",()=>{
        const currentSlide = document.querySelector(".current-slide");
        const nextSlide = currentSlide.nextElementSibling;
        const firstSlide = slidesWrapper.firstElementChild
        moveToSlide(slidesWrapper,currentSlide,nextSlide,firstSlide)
        hideNotCurrSlides()
    })

    prevBtn.addEventListener("click",()=>{
        const currentSlide = document.querySelector(".current-slide");
        const prevSlide = currentSlide.previousElementSibling;
        const lastSlide = slidesWrapper.lastElementChild
        moveToSlide(slidesWrapper,currentSlide,prevSlide,lastSlide)
        hideNotCurrSlides()
    })

    const onResize = () =>{
        setSlidePosition(slides,slidesWrapper)
        // When resizing, transition must be "none" to avoid unnecessary movement of the slides -
        // when setting the new slidesWrapper position
        if(!(slidesWrapper.style.transition = "none")){
            slidesWrapper.style.transition = "none"
        }
    }

    window.addEventListener("resize",()=>{
        clearTimeout(window.resizedFinished)//Waits until resize is finished
        window.resizedFinished = setTimeout(function(){
            onResize()
        },100)
    })
    // ##############