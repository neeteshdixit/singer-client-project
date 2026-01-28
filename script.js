// document.querySelector('.fa-pause').addEventListener('click', function() {
//     this.classList.toggle('fa-pause');
//     this.classList.toggle('fa-play');
// });

// // Scroll effect for header
// window.addEventListener('scroll', () => {
//     const header = document.querySelector('header');
//     if (window.scrollY > 50) {
//         header.style.background = 'rgba(16, 8, 24, 0.95)';
//     } else {
//         header.style.background = 'rgba(0,0,0,0.4)';
//     }
// });

// // Intersection Observer for Reveal on Scroll
// const observerOptions = {
//     threshold: 0.1
// };

// const revealObserver = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             entry.target.style.opacity = "1";
//             entry.target.style.transform = "translateY(0)";
//             revealObserver.unobserve(entry.target); // Only animate once
//         }
//     });
// }, observerOptions);

// // Select all sections and cards to animate
// document.querySelectorAll('.glass-card, .video-thumb, .ornament-title').forEach(el => {
//     el.style.opacity = "0";
//     el.style.transform = "translateY(40px)";
//     el.style.transition = "all 0.8s ease-out";
//     revealObserver.observe(el);
// });