// year
document.getElementById("year").textContent = new Date().getFullYear();

// scroll reveal animation
const elems = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.2 }
);

elems.forEach(el => observer.observe(el));

// Live Clock Logic
function updateClock() {
    const now = new Date();
    
    // Formats date and time for UK locale (e.g., 22/01/2026, 16:30:05)
    const options = { 
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    };
    
    const displayString = now.toLocaleString('en-GB', options);
    const clockElement = document.getElementById('live-clock');
    
    if (clockElement) {
        clockElement.textContent = displayString;
    }
}

// Refresh the time every 1 second (1000ms)
setInterval(updateClock, 1000);

//Initialise immediately so there is no 1-second delay on load
updateClock();
