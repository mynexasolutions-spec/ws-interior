

  // CUSTOM CURSOR REMOVED

  // NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  const scrollTop = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      scrollTop.classList.add('visible');
    } else {
      navbar.classList.remove('scrolled');
      scrollTop.classList.remove('visible');
    }
  });

  // MOBILE MENU
  function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }

  // REVEAL ON SCROLL
  const reveals = document.querySelectorAll('.reveal, .stat-item, .process-step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // COUNTER ANIMATION
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.textContent.includes('%') ? '%' : (el.textContent.includes('+') ? '+' : '');
    let count = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        count = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(count) + (target >= 98 ? '%' : '+');
    }, 25);
  }
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    statsObserver.observe(statsBar);
  }

  // TESTIMONIAL SLIDER
  const slider = document.getElementById('testimonialSlider');
  if (slider) {
    let currentSlide = 0;
    const cards = slider.querySelectorAll('.testimonial-card');
    const dotsContainer = document.getElementById('sliderDots');
    let slidesPerView = window.innerWidth >= 768 ? 3 : 1;

    function initSlider() {
      slidesPerView = window.innerWidth >= 768 ? 3 : 1;
      const totalSlides = Math.ceil(cards.length / slidesPerView);
      
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
          const dot = document.createElement('div');
          dot.className = 'dot' + (i === currentSlide ? ' active' : '');
          dot.onclick = () => goToSlide(i);
          dotsContainer.appendChild(dot);
        }
      }
      
      if (currentSlide >= totalSlides) currentSlide = 0;
      goToSlide(currentSlide);
    }

    function goToSlide(n) {
      const totalSlides = Math.ceil(cards.length / slidesPerView);
      if (n >= totalSlides) n = 0;
      if (n < 0) n = totalSlides - 1;
      currentSlide = n;
      
      const containerWidth = slider.parentElement.offsetWidth;
      slider.style.transform = `translateX(-${n * containerWidth}px)`;
      
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
          d.classList.toggle('active', i === n);
        });
      }
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }
    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    window.addEventListener('resize', initSlider);
    initSlider();
    setInterval(nextSlide, 5000);

    // Make functions global for inline onclick
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;
  }

  // PORTFOLIO TABS
  const tabBtns = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        // Update active btn
        tabBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.textContent.toLowerCase().trim();

        portfolioItems.forEach(item => {
          const itemCat = item.getAttribute('data-category');
          if (filter === 'all' || filter === itemCat) {
            item.style.display = 'block';
            // Re-trigger reveal animation if needed
            setTimeout(() => item.classList.add('visible'), 50);
          } else {
            item.style.display = 'none';
            item.classList.remove('visible');
          }
        });
      });
    });
  }

  // FORM SUBMIT (Refactored for Flask)
  async function handleSubmit() {
    const form = document.querySelector('.contact-form');
    const btn = document.querySelector('.submit-btn');
    
    // Get form data
    const firstName = form.querySelector('input[placeholder="Your first name"]').value;
    const lastName = form.querySelector('input[placeholder="Your last name"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const phone = form.querySelector('input[type="tel"]').value;
    const service = form.querySelector('select').value;
    const message = form.querySelector('textarea').value;

    if (!firstName || !email || !message) {
      alert("Please fill in required fields (Name, Email, Message)");
      return;
    }

    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.background = 'var(--gold-dark)';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName, lastName, email, phone, service, message
        }),
      });

      const result = await response.json();

      if (response.ok) {
        btn.textContent = '✓ Message Sent! We\'ll contact you soon.';
        btn.style.background = '#2d7a2d';
        form.reset();
      } else {
        btn.textContent = 'Error sending message';
        btn.style.background = '#8b0000';
      }
    } catch (error) {
      console.error('Error:', error);
      btn.textContent = 'Connection Error';
      btn.style.background = '#8b0000';
    } finally {
      setTimeout(() => {
        btn.textContent = 'Send Message →';
        btn.disabled = false;
        btn.style.background = '';
      }, 4000);
    }
  }

  // SMOOTH SCROLL FOR ALL ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
