document.addEventListener("DOMContentLoaded", function() {
		const lazyImages = document.querySelectorAll(".lazy");

		function lazyLoad() {
				lazyImages.forEach(img => {
						if (img.getBoundingClientRect().top < window.innerHeight && img.getBoundingClientRect().bottom > 0) {
								img.src = img.dataset.src;
								img.classList.remove("lazy");
						}
				});
		}

		window.addEventListener("scroll", lazyLoad);
		lazyLoad();
});