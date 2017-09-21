var navbarButton = document.getElementById('navbar-toggle');
var navMain = document.getElementById('navbar-entries');
var navbarToggle = false;

console.log(navMain);

var toggleNav = function() {
    navbarToggle = !navbarToggle;
    console.log(navbarToggle);

    if (navbarToggle) {
        navMain.classList.add('navbar__entries--active');
    }
    else {
        navMain.classList.remove('navbar__entries--active');
    }
}

navbarButton.addEventListener('click', toggleNav);
