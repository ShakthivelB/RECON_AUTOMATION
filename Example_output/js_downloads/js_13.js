$( document ).ready(function() {

  /* ----------------------------------------------------
	  Navbar: highlighting nav behavior
  ----------------------------------------------------*/
  $('.left-nav .nav-item').on("mouseover", function () {
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');
      $(this).mouseout(function() {
        $(this).removeClass('active');
      });
    }
  });


  /* ----------------------------------------------------
    Navbar: Dropdown Behavior
  ----------------------------------------------------*/

  const $dropdown = $(".dropdown");
  const $dropdownToggle = $(".dropdown-toggle");
  const $dropdownMenu = $(".dropdown-menu");
  const showClass = "show";

  $(window).on("load resize", function() {
    if (this.matchMedia("(min-width: 992px)").matches) {
      $dropdown.hover(
        function() {
          const $this = $(this);
          $this.addClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "true");
          $this.find($dropdownMenu).addClass(showClass);
        },
        function() {
          const $this = $(this);
          $this.removeClass(showClass);
          $this.find($dropdownToggle).attr("aria-expanded", "false");
          $this.find($dropdownMenu).removeClass(showClass);
        }
      );
    } else {
      $dropdown.off("mouseenter mouseleave");

      const helpDropdown = $('#help-dropdown');
      const aboutDropdown = $('#about-dropdown');
      const toggleClass = "dropdown-toggle";

      helpDropdown.addClass(toggleClass);
      aboutDropdown.addClass(toggleClass);
    }
  });

  /* ----------------------------------------------------
	  Animated Scroll To Anchor
  ----------------------------------------------------*/
  $('.scroll').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') || location.hostname == this.hostname) {
      var hashStr = this.hash.slice(1);
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + hashStr +']');

      if (target.length) {
        $('html,body').animate({ scrollTop: target.offset().top - 80}, 500);
        window.location.hash = hashStr;
        return false;
      }
    }
  });


  /* ----------------------------------------------------
	  Search
  ----------------------------------------------------*/
  var searchInputEl = $("#search-select input");
  var searchInputLabel = $("label[for='search-query']");

  $("#search-select").keypress(function(event) {
    pressedKey = event.which || event.keyCode || event.charCode;
    enterKey = 13 // ASCII code for ENTER key
    if (pressedKey == enterKey) {
        event.preventDefault();
        $("#search-select").submit();
    }
  });

  searchInputEl.keyup(function(){
    if (!searchInputEl.val()) {
      searchInputEl.css("padding-left", "30px")
      searchInputLabel.show();
    } else {
      searchInputLabel.hide();
      searchInputEl.css("padding-left", "10px");
    }
  });

  // Used when rendering page of search results
  if (searchInputEl.val()) {
    searchInputLabel.hide();
    searchInputEl.css("padding-left", "10px");
  }

  /* ----------------------------------------------------
    Card Details
  ----------------------------------------------------*/
  /* Card Details: show or hide menu */
  $(".card-options-trigger").on("click", function(event) {

    var el = $(this).find('.card-options');
    if (el) {
      if (el.hasClass('open')) {
        el.removeClass("open");
        el.hide();
      } else {
        el.addClass("open");
        el.show();
      }

    }
  });

  /*  Card Details: Hide menu if use clicks somewhere else on page */
  $(document).click(function(event) {
    var cardOptionsClicked = event.target.closest('.card-options.open');
    var triggerClicked = event.target.closest('.card-options-trigger');

    if (!cardOptionsClicked && !triggerClicked) {
      var el = $(this).find('.card-options.open');
      el.removeClass("open");
      el.hide();
    }
  });

  /* Card Details: hovering behavior for menu */
  $( ".card-option" ).hover(
    function() {
      $(this).find('a').css('color', '#EF7C00');
    }, function() {
      $(this).find('a').css('color', '#000000');
    }
  );

  /* Card Details: allow clicking near the link to work like clicking link */
  $( ".card-option" ).click(function(e) {
    var clickTarget = $(e.target).attr("href");
    var clickTargetLink = $(this).find(".card-option-link");

    if (e.currentTarget === e.target) {
      clickTargetLink[0].click();
    } else {
      if (clickTarget!==undefined && clickTarget == "#") {
      e.preventDefault();
      }
    }
  });

});
