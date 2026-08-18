// Shared browser behavior for all pages.

document.addEventListener('DOMContentLoaded', function () {
  setupMobileNavigation();
  setupProductFilters();
  setupContactFormValidation();
  setupSignUpValidation();
  setupSignInValidation();
});

function setupMobileNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (!navToggle || !mainNav) {
    return;
  }

  navToggle.addEventListener('click', function () {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupProductFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productItems = document.querySelectorAll('.product-item');

  if (!filterButtons.length || !productItems.length) {
    return;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach(function (btn) {
        btn.classList.toggle('active', btn === button);
      });

      productItems.forEach(function (item) {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        item.classList.toggle('hidden', !shouldShow);
      });
    });
  });
}

function setupContactFormValidation() {
  const form = document.getElementById('contactForm');
  const messageBox = document.getElementById('contactMessage');

  if (!form || !messageBox) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !subject || !message) {
      showMessage(messageBox, 'Please fill in all required fields.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageBox, 'Please enter a valid email address.', 'error');
      return;
    }

    if (message.length < 5) {
      showMessage(messageBox, 'Message must be at least 5 characters long.', 'error');
      return;
    }

    showMessage(messageBox, 'Thank you! Your message has been sent successfully.', 'success');
    form.reset();
  });
}

function setupSignUpValidation() {
  const form = document.getElementById('signUpForm');
  const messageBox = document.getElementById('signUpMessage');

  if (!form || !messageBox) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('signupName').value.trim();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!fullName) {
      showMessage(messageBox, 'Full name is required.', 'error');
      return;
    }

    if (!username) {
      showMessage(messageBox, 'Username is required.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showMessage(messageBox, 'Please enter a valid email address.', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage(messageBox, 'Password must be at least 6 characters long.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage(messageBox, 'Passwords do not match.', 'error');
      return;
    }

    const userData = {
      fullName: fullName,
      username: username,
      email: email,
      password: password
    };

    localStorage.setItem('novaworksUser', JSON.stringify(userData));
    showMessage(messageBox, 'Account created successfully! You can now sign in.', 'success');
    form.reset();
  });
}

function setupSignInValidation() {
  const form = document.getElementById('signInForm');
  const messageBox = document.getElementById('signInMessage');

  if (!form || !messageBox) {
    return;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!identifier || !password) {
      showMessage(messageBox, 'Please enter both email/username and password.', 'error');
      return;
    }

    const storedUser = localStorage.getItem('novaworksUser');

    if (!storedUser) {
      showMessage(messageBox, 'No account found. Please sign up first.', 'error');
      return;
    }

    const user = JSON.parse(storedUser);
    const matchesEmail = user.email === identifier || user.username === identifier;

    if (!matchesEmail || user.password !== password) {
      showMessage(messageBox, 'Incorrect login information. Please try again.', 'error');
      return;
    }

    showMessage(messageBox, 'Login successful! Redirecting to home page...', 'success');

    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1200);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(element, text, type) {
  element.textContent = text;
  element.className = 'form-message ' + type;
}
