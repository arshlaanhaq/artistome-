// ---------------------------------for-navbar-------------------------------
document.getElementsByClassName("fa")[4].addEventListener(
    "click", function () {
        document.getElementsByClassName("links")[0].classList.toggle
            ("showlinks")
    })

// ---------------------------------------slider 1----------------------------------------------------------
 let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

// ****************************************slider2**************************************
if (document.getElementById("slider--text")) {

    let slides = [
        "<h2>Amazing arts that will amaze your mind.<small>Home of Arts</small></h2>",
        "<h2>Greatest art work by an artist</h2>"


    ];

    let i = 0;

    const slider = () => {
        document.getElementById("slider--text").innerHTML = slides[i];
        document.getElementById("slider--text").classList.add('fade-in');

        (i < slides.length - 1) ? i++ : i = 0;
    };

    slider(); // Start slider immediately
    setInterval(slider, 4000); // Slide every 4 seconds
}
// ****************************************scrollTotop****************************************************************************
  var target = document.querySelector("footer");
  var scrollToTopBtn = document.querySelector(".scrollToTopBtn");
  var top = document.getElementById("#top");
  var rootElement = document.documentElement;
  
  function callback(entries, observer) {
    // The callback will return an array of entries, even if you are only observing a single item
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Show button
        scrollToTopBtn.classList.add("showBtn");
      } else {
        // Hide button
        scrollToTopBtn.classList.remove("showBtn");
      }
    });
  }
  function scrollToTop() {
    rootElement.scrollTo({
      top,
      behavior: "smooth"
    });
  }
  scrollToTopBtn.addEventListener("click", scrollToTop);
  let observer = new IntersectionObserver(callback);
  // Finally start observing the target element
  observer.observe(target);