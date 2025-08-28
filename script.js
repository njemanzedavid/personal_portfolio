const nav = document.querySelector(".nav");
const navMenu = document.querySelector(".nav-items");
const btnToggleNav = document.querySelector(".menu-btn");
const workEls = document.querySelectorAll(".work-box");
const workImgs = document.querySelectorAll(".work-img");
const mainEl = document.querySelector("main");
const yearEl = document.querySelector(".footer-text span");
const workTabBtns = document.querySelectorAll(".work-tab-btn");
const workTabContents = document.querySelectorAll(".work-tab-content");

const toggleNav = () => {
  nav.classList.toggle("hidden");

  // Prevent screen from scrolling when menu is opened
  document.body.classList.toggle("lock-screen");

  if (nav.classList.contains("hidden")) {
    btnToggleNav.textContent = "menu";
  } else {
    // When menu is opened after transition change text respectively
    setTimeout(() => {
      btnToggleNav.textContent = "close";
    }, 475);
  }
};

btnToggleNav.addEventListener("click", toggleNav);

navMenu.addEventListener("click", (e) => {
  if (e.target.localName === "a") {
    toggleNav();
  }
});

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !nav.classList.contains("hidden")) {
    toggleNav();
  }
});

// Animating work instances on scroll

workImgs.forEach((workImg) => workImg.classList.add("transform"));

let observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries;
    const [textbox, picture] = Array.from(entry.target.children);
    if (entry.isIntersecting) {
      picture.classList.remove("transform");
      Array.from(textbox.children).forEach(
        (el) => (el.style.animationPlayState = "running")
      );
    }
  },
  { threshold: 0.3 }
);

workEls.forEach((workEl) => {
  observer.observe(workEl);
});

// Toggle theme and store user preferred theme for future

const switchThemeEl = document.querySelector('input[type="checkbox"]');
const storedTheme = localStorage.getItem("theme");

switchThemeEl.checked = storedTheme === "dark" || storedTheme === null;

switchThemeEl.addEventListener("click", () => {
  const isChecked = switchThemeEl.checked;

  if (!isChecked) {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
    switchThemeEl.checked = false;
  } else {
    document.body.classList.add("dark");
    document.body.classList.remove("light");
    localStorage.setItem("theme", "dark");
  }
});

// Trap the tab when menu is opened

const lastFocusedEl = document.querySelector('a[data-focused="last-focused"]');

document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && document.activeElement === lastFocusedEl) {
    e.preventDefault();
    btnToggleNav.focus();
  }
});

// Rotating logos animation

const logosWrappers = document.querySelectorAll(".logo-group");

const sleep = (number) => new Promise((res) => setTimeout(res, number));

logosWrappers.forEach(async (logoWrapper, i) => {
  const logos = Array.from(logoWrapper.children);
  await sleep(1400 * i);
  setInterval(() => {
    let temp = logos[0];
    logos[0] = logos[1];
    logos[1] = logos[2];
    logos[2] = temp;
    logos[0].classList.add("hide", "to-top");
    logos[1].classList.remove("hide", "to-top", "to-bottom");
    logos[2].classList.add("hide", "to-bottom");
  }, 5600);
});

yearEl.textContent = new Date().getFullYear();

// Work tabs functionality
// After: initWorkTabs()
// Replaces the old inline work-tabs click-handler block
function initWorkTabsFixed() {
  const tabBtns = Array.from(document.querySelectorAll('.work-tab-btn'));
  const tabContents = Array.from(document.querySelectorAll('.work-tab-content'));
  
  if (!tabBtns.length || !tabContents.length) return;

  // Set default active tab
  tabBtns.forEach(b => b.classList.remove('active'));
  tabContents.forEach(c => c.classList.remove('active'));
  
  const aiBtn = document.querySelector('.work-tab-btn[data-tab="ai"]');
  const aiContent = document.getElementById('ai');
  
  if (aiBtn) aiBtn.classList.add('active');
  if (aiContent) aiContent.classList.add('active');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const target = btn.getAttribute('data-tab');
      if (!target) return;

      // Reset ALL tabs (both text AND images)
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => {
        c.classList.remove('active');
        
        // Reset text animations
        const workElements = c.querySelectorAll('.work-textbox h3, .work-text, .work-technologies, .work-links');
        workElements.forEach(el => {
          el.style.animationPlayState = "paused";
          el.style.transform = "translateY(45px)";
          el.style.opacity = "0";
        });
        
        // FIX: Reset image animations too
        const workImages = c.querySelectorAll('.work-img');
        workImages.forEach(img => {
          img.classList.add('transform'); // This resets the image animation
        });
      });

      // Activate selected tab
      btn.classList.add('active');
      const content = document.getElementById(target);
      if (content) {
        content.classList.add('active');
        
        // Trigger text animations immediately
        const workElements = content.querySelectorAll('.work-textbox h3, .work-text, .work-technologies, .work-links');
        workElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.animationPlayState = "running";
            el.style.transform = "none";
            el.style.opacity = "1";
          }, index * 100); // Stagger animations
        });
        
        // Trigger image animations immediately
        const workImages = content.querySelectorAll('.work-img');
        workImages.forEach(img => {
          setTimeout(() => {
            img.classList.remove('transform'); // This triggers the image animation
          }, 200); // Small delay after text starts
        });
      }
	  // ensure selected tab is visible on narrow screens
	  if (btn.scrollIntoView) {
	    // center the tab when possible
	    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
	  }
    });
  });
}

// Ensure it runs once on load
document.addEventListener('DOMContentLoaded', initWorkTabsFixed);

// Add to your JavaScript
const roleItems = document.querySelectorAll('.role-item');

// Set initial state
roleItems.forEach(item => {
  item.style.transform = 'translateY(45px)';
  item.style.opacity = '0';
  item.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
});

// Create observer for roles
const roleObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.opacity = '1';
      }, index * 150); // Staggered appearance
    }
  });
}, { threshold: 0.3 });

// Observe all role items
roleItems.forEach(item => roleObserver.observe(item));

// NETLIFY AJAX form submit (place at end of script.js)
(() => {
  const contactForm = document.querySelector('form[name="contact"]');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(contactForm);

    try {
      // POST to Netlify (the same origin). Netlify will capture the submission if data-netlify="true"
      const resp = await fetch('/', {
        method: 'POST',
        body: formData
      });

      if (resp.ok) {
        // success UI
        submitBtn.textContent = 'Sent ✓';
        contactForm.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (err) {
      console.error(err);
      submitBtn.textContent = 'Send';
      alert('There was an error sending your message. Try again or email oraelosikenny@gmail.com');
    } finally {
      submitBtn.disabled = false;
      // restore text after 2s if it was 'Sent ✓'
      setTimeout(() => {
        submitBtn.textContent = 'Send';
      }, 2000);
    }
  });
})();


