$(document).ready(function () {
    /* ------- ROTATE LOGO 360 DEGREE ------ */
    let degree = 0;
    $('#logoImg').on('click', function() {
        $(this).toggleClass('animate-spin');
    });

    /* ---------------- LOGIN INPUT VALIDATION -------------- */
    var usernameInput = $('#usernameInput');
    var passwordInput = $('#passwordInput');

    var usernameError = $('#invalidUsername');
    var passwordError = $('#invalidPassword');

    let username = "";
    let password = "";

    usernameInput.on('input', validateUsername);
    passwordInput.on('input', validatePassword);

    /* ---------------- SHOW PASSWORD CHECKBOX ------------------ */
    $('#showPassword').on('change', function() {
        passwordInput.attr('type', this.checked ? 'text' : 'password');
    });

    /* ----------------- CAPS LOCK WARNING ---------------- */
    $('#usernameInput, #passwordInput').on('keyup keydown', function(e) {
        const capsLockOn = e.originalEvent.getModifierState("CapsLock");
        // add or remove 'hidden' class on #capslockWarning based on caps lock activation
        $('#capslockWarning').toggleClass('hidden', !capsLockOn)
    });

    /* ----------------- LOGIN VALIDATION ---------------- */ 
    function authLogin() {
        validateUsername();
        validatePassword();
    
        if (username !== "" && password !== "" && passwordError.css('display') === 'none') {
            authenticateUser();
        }
    }
    
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        authLogin();
    });
    
    $("#aboutLink").click(function(e) {
        e.preventDefault();
        authLogin();
    });

    function validateUsername() {
        username = $.trim(usernameInput.val());
        var usernameEmpty = username == ""; 

        if (usernameEmpty) {
            usernameInput.addClass('border-2 border-red-500');
            usernameError.removeClass('hidden');
        } else {
            usernameInput.removeClass('border-2 border-red-500');
            usernameError.addClass('hidden');
        }
    }

    function validatePassword() {
        password = $.trim(passwordInput.val());
        const isValid = isPasswordValid(password);
        var passwordEmpty = password == "";

        if (passwordEmpty || !isValid) {
            passwordError.text(passwordEmpty ? "Password must not be empty" : passwordError.text());
            passwordInput.addClass('border-2 border-red-500');
            passwordError.removeClass('hidden');
        } else {
            passwordInput.removeClass('border-2 border-red-500');
            passwordError.text("").addClass('hidden');
        }
        
    }
    
    function isPasswordValid(password) {
        var conditions = [
            { regex: /[A-Z]/, message: 'one uppercase letter' },
            { regex: /[a-z]/, message: 'one lowercase letter' },
            { regex: /\d/, message: 'one number' }
            // { regex: /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/, message: 'one symbol' }
        ];

        var unmetConditions = conditions.filter(function(condition) {
            return !condition.regex.test(password);
        });

        if (unmetConditions.length > 0) {
            var errorMessage = "Password need to have " + unmetConditions.map(function(cond) {
                return cond.message;
            }).join(', ').replace(/,([^,]*)$/, unmetConditions.length > 2 ? ', and$1' : ' and$1') + '.';

            passwordError.text(errorMessage);
            return false;
        } else {
            return true;
        }
    }

    // fetch data from API and authenticate user 
    const authenticateUser = async () => {
        const url = 'https://dummyjson.com/users';
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                const isValidUser = data.users.some(user => user.username === username && user.password === password);
        
                if (isValidUser) {
                    // Authentication success
                    const user = data.users.find(user => user.username === username && user.password === password);
                    const fullName = `${user.firstName} ${user.lastName}`;
                    alert(`Login Successful! Welcome ${fullName}`);
                    window.location.href = 'about.html';

                } else {
                    // Authentication failed
                    $('#failedLoginMessage').removeClass('hidden');
                    $('#usernameInput, #passwordInput').addClass('border-2 border-red-500');
                    const passwordEmpty = password === "";
                    if (passwordEmpty) {
                        passwordError.text("Please fill in the password correctly");
                        passwordError.addClass('hidden');
                    }
                }
            } else {
                throw new Error('Failed to fetch data');
            } 
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred during login. Please try again later.');
        }
    };

    /* -------- Additional jQuery Effects -------- */
    
    $("#promptLogin").hide(); 
    $("#promptLogin").slideDown(700); 

    $('#imgLogin').animate({
        scale: 1
    }, 1000)

    // animated letter spacing for logo title (Welcome)
    $("#logoTitle").on('click', function(){
        if ($(this).hasClass('animated')) {
            // If the element has the 'animated' class, remove it and animate back to the original state
            $(this).animate({
                marginLeft: '0',
                letterSpacing: '0'
            }, 1000).removeClass('animated');
        } else {
            // If the element doesn't have the 'animated' class, add it and animate
            $(this).animate({
                marginLeft: '10px',
                letterSpacing: '2px'
            }, 1000).addClass('animated');
        }}); 


    // $("#profileDescription").slideDown(1000);

    // show profile img
    $("#profileImg").hide();
    $("#profileImg").show(500);
    
    $("#profileDescription").slideDown(500);
    
    
    // The slideDown animation is complete
    var name = $("#name").text();
    var speed = 200;

    function typeWriter(text, i) {
        $("#name").text(text.substring(0, i + 1));

        if (i === text.length) {
            pointer.fadeToggle(speed, () => typeWriter(text, 0)); // Reset to start typing again
        } else {
            $("#name").fadeIn(speed, () => setTimeout(() => typeWriter(text, i + 1), speed));
        }
    }

    // Start typing effect after a delay
    setTimeout(() => typeWriter(name, 0), 100);
    
     /* ------ ANIMATED SECTION & SCROLL UP/DOWN BUTTONS ------ */
     var observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });

     $(".animated-section").each(function () {
         observer.observe(this);
     });
 
     // Initial state: hide scroll-up and scroll-down buttons
     $(".scroll-top, .scroll-bottom").hide();
 
     function handleIntersection(entries, observer) {
         entries.forEach(function (entry) {
             if (entry.isIntersecting) {
                 switch (entry.target.id) {
                     case "section-profile":
                         $(entry.target).animate({ opacity: 1 }, 500);
                         $(".scroll-bottom").show();
                         $(".scroll-top").hide();
                         break;
                     case "section-education":
                         // fade in and slide in from left
                         $(entry.target).animate({ opacity: 1, left: 0 }, 1000);
                         break;
                     case "section-work":
                         // fade in and scale up
                         $(entry.target).animate({ opacity: 1, scale: 1 }, 1000);
                         break;
                     case "section-motto":
                         // fade in and slide in from left
                         $(entry.target).animate({ opacity: 1, right: 0 }, 1000, function () {
                             // show the scroll-top button when the "section-motto" is reached
                             $(".scroll-top").fadeIn(200);
                             $(".scroll-bottom").hide();
                         });
                         break;
                 }
                 observer.unobserve(entry.target);
             }
         });
     }
 
     // scroll to the top when the scroll-top button is clicked
     $(".scroll-top").on("click", function () {
         $("#mainContainer").animate({ scrollTop: 0 }, 500);
         $(".scroll-top").hide(); // hide the button again after reaching the top
         $(".scroll-bottom").show();
     });
 
     // scroll to the bottom when the scroll-bottom button is clicked
     $(".scroll-bottom").on("click", function () {
         $("#mainContainer").animate({ scrollTop: $(document).height() }, "slow");
         $(".scroll-bottom").hide(); // hide the button again after reaching the bottom
         $(".scroll-top").fadeIn(200);
     });
 
});