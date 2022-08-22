let isMobile = false;
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

if (isMobile) {
  $('.branding-text').css("display", "none");
  $('#menu-viz-horizontal-labels-container').css("display", "none");
  $('#close-menu-bt').click(()=> {
    closeMenuUI();
  });
}

// Event handler
function handleEventListeners(evt) {
  const logger = document.getElementById("carousel-picker-logger");
  logger.innerHTML = evt.target.getAttribute("id");
}

function handleNavbarMaskAnim(evt) {
  evt.target.velocity({ opacity: 0 }, { display: "none" });
}

function closeMenuUI() {
  $menuVizInterfaceUI.removeClass( "menu-visualization-interface-bg-show" );   
  $(".navbar").css("bottom", "0px");        
}

function animateSelector($sel, currPositionLeft, currMenuIndex) {
  // Move and animate the selector
  $sel.animate({
    opacity: 1,
    bottom: 0,
    left: currPositionLeft,
    easing: "easein",
    duration: "slow"
  }, 30, function() {
    // Animation complete.
  });
  // Teleportation call:          
  // $sel.css("left", currentPositionLeft);
}

function animateShutter(currMenuIndex) {
  // Open the corresponding image shutter
  // console.log("Searching for current menu index: " + "#shutter-image-" + currMenuIndex);
  $("#shutter-image-" + currMenuIndex).addClass("image-shutter-open");        
}

// Attach event listeners
const carouselCells = document.getElementsByClassName("carousel-cell");

for(let i=0; i<carouselCells.length; i++) {
  carouselCells[i].addEventListener("mouseenter", handleEventListeners);
} 

// We want to pop-up a full screen thing with a totally different interface and menu at the bottom
// Menu viz interface UI
const $menuVizInterfaceUI = $("#menu-viz");
let count = 0;
const horizontalMenuItemWidth = $(".menu-viz-horizontal-row-container").width();
const horizontalMenuFlexGap = parseInt($("#menu-viz-horizontal-labels-container").css("gap"));
//const horizontalMenuItemMaxWidth = parseInt($(".menu-viz-horizontal-row-container").css("width"));

// console.log("Flex gap: " + horizontalMenuFlexGap);
// console.log("Item width with width(): " + horizontalMenuItemWidth);
// console.log("horizontal menu item max width: " + horizontalMenuItemMaxWidth);

$( ".navbar" ).click(function(event) {
    // Position the horizontal menu's first element at the center of the screen
    $("#menu-viz-horizontal-labels-container").css('transform', 'translateX(' + window.innerWidth/2 - horizontalMenuItemWidth/2 + 'px)');
    $menuVizInterfaceUI.toggleClass( "menu-visualization-interface-bg-show", true );
    ++count;           
    $(".navbar").css("bottom", "-100px");
  }
);

$menuVizInterfaceUI.click(function(event) {
  if (!isMobile) {
    closeMenuUI();
  }
});

// We want to attach onhover events on the keyboard nav menu at the bottom center to displace the indicator
// Handler
let $sel = $(".selection-indicator");
$sel.css("opacity", 0); // hide it at first, reveal if hover over keyboard keys
const containerOriginY = -768;
const currentPositionBottom = containerOriginY;
const centerOfScreen = window.innerWidth/2; // where the horizontal labels start
const indicatorOffsetWidth = 200; // Can tweak this to adjust moveTo speed
const $rotatedBoxContainer = $("#menu-viz-rotated-boxes-container");
let aspectRatio = 1;

window.addEventListener('resize', () => {
  aspectRatio = (window.outerWidth - 8) / window.innerWidth;
});

$(".keyboard-rectangle").each(function( index ) {

  const $rect = $( this );
  const currentPositionLeft = $rect[0].getBoundingClientRect().x;
  const retrievedID = $rect[0].getAttribute("id");
  const currentKeyMenuIndex = retrievedID.charAt(retrievedID.length - 1);
  let moveTo;

  if (!isMobile) {

    $rect.mouseover( (evt) => {
      
      // We want to offset the bottom position of the squares in the nice menu
      // using the indexing from the keyboard keys (parseInt on the id to retrieve each key's index)
      // containerOriginY = window.getComputedStyle($rotatedBoxContainer[0]).getPropertyValue('y');
      moveTo = currentPositionBottom + currentKeyMenuIndex * indicatorOffsetWidth;
      $("#menu-viz-rotated-boxes-container").css('transform', 'rotate(35deg) translateY(' + moveTo + 'px)');

      // Translate the labels left from right
      const trueCenter = (window.innerWidth/2 - horizontalMenuItemWidth/2);
      const _offsetToNextCenter = horizontalMenuItemWidth * (currentKeyMenuIndex);
      const _gap = horizontalMenuFlexGap * (currentKeyMenuIndex);
      const moveToH = trueCenter - _offsetToNextCenter - _gap;

      //$("#menu-viz-horizontal-labels-container").css('transform', 'translateX(' + moveToH + 'px)');

      $("#menu-viz-horizontal-labels-container").animate({
        opacity: 1,
        bottom: "42vh",
        left: moveToH,
        easing: "easein",
        duration: "slow"
      }, 100, function() {
        // Animation complete.
      });

      // Animate selector
      animateSelector($sel, currentPositionLeft, currentKeyMenuIndex);

      // Open the corresponding image shutter
      animateShutter(currentKeyMenuIndex);

    });

    $rect.mouseout( () => {
      $("#shutter-image-" + currentKeyMenuIndex).removeClass("image-shutter-open");
    });
    
  } else {

    $rect.click( () => {            

      moveTo = currentPositionBottom + currentKeyMenuIndex * indicatorOffsetWidth;
      $("#menu-viz-rotated-boxes-container").css('transform', 'translateY(' + moveTo + 'px)');            
      animateSelector($sel, currentPositionLeft, currentKeyMenuIndex);
      animateShutter(currentKeyMenuIndex);

      setTimeout(()=> {
        $("#shutter-image-" + currentKeyMenuIndex).removeClass("image-shutter-open");
      }, 3000);

      clearTimeout();

    });

  }

});

const $mainUnit = $( '.main-unit' );
const $identityEl = $('.identity-el');

// Attach vertical sliders behaviour
$('.home-screen-calendar').click(function(evt) {
  // Prevent both parent and child to be activated
  evt.stopImmediatePropagation();

  $( '.main-unit' ).removeClass( "is-translatingY-down" );
  $( '.main-unit' ).addClass( "is-translatingY-up" );
  // set-opacity-up
  $( '.vertical-slide-target' ).removeClass( "set-opacity-down" );
  $( '.vertical-slide-target' ).addClass( "set-opacity-up" );

  // Alternatively use mouseover event to check which .main-unit-id is being currently translated/seen in the carousel
  // and only translate up that one, not the other ones
  
  $('.main-carousel').one("click", function(evt) {

    $( '.main-unit' ).removeClass( "is-translatingY-up" );
    $( '.main-unit' ).addClass( "is-translatingY-down" );
    $( '.vertical-slide-target' ).removeClass( "set-opacity-up" );
    $( '.vertical-slide-target' ).addClass( "set-opacity-down" );

  });

});
      
$identityEl.hover(function(evt) {
  $( this ).addClass('identity-el-animate');
});

$identityEl.mouseout(function(evt) {
  $( this ).removeClass('identity-el-animate');
})

let globalUnityInstance;

window.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  // Flickity events
  var elem = document.querySelector('#the-carousel');
  var pageTurnAudioSrc = document.getElementById('page-turn');

  elem.addEventListener('mouseup', function(e) {
    e.stopImmediatePropagation();
    pageTurnAudioSrc.play();
  });

  // elem.addEventListener("mouseup", function() {
  //   pageTurnAudioSrc.play();
  // });

  var container = document.querySelector("#unity-container");
  var canvas = document.querySelector("#unity-canvas");
  var loadingBar = document.querySelector("#unity-loading-bar");
  var progressBarFull = document.querySelector("#unity-progress-bar-full");
  var fullscreenButton = document.querySelector("#unity-fullscreen-button");
  var warningBanner = document.querySelector("#unity-warning");

  // Shows a temporary message banner/ribbon for a few seconds, or
  // a permanent error message on top of the canvas if type=='error'.
  // If type=='warning', a yellow highlight color is used.
  // Modify or remove this function to customize the visually presented
  // way that non-critical warnings and error messages are presented to the
  // user.
  function unityShowBanner(msg, type) {
      function updateBannerVisibility() {
        warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
      }
      var div = document.createElement('div');
      div.innerHTML = msg;
      warningBanner.appendChild(div);
      if (type == 'error') div.style = 'background: red; padding: 10px;';
      else {
      if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
      setTimeout(function() {
          warningBanner.removeChild(div);
          updateBannerVisibility();
      }, 5000);
      }
      updateBannerVisibility();
  }

  var buildUrl = "./assets/chathomes/Build";
  var loaderUrl = buildUrl + "/v0.2.loader.js";
  var config = {
      dataUrl: buildUrl + "/v0.2.data.unityweb",
      frameworkUrl: buildUrl + "/v0.2.framework.js.unityweb",
      codeUrl: buildUrl + "/v0.2.wasm.unityweb",
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "ChatHomes3D",
      productVersion: "0.1",
      showBanner: unityShowBanner,
  };

  // By default Unity keeps WebGL canvas render target size matched with
  // the DOM size of the canvas element (scaled by window.devicePixelRatio)
  // Set this to false if you want to decouple this synchronization from
  // happening inside the engine, and you would instead like to size up
  // the canvas DOM size and WebGL render target sizes yourself.
  // config.matchWebGLToCanvasSize = false;
  if (canvas === null) {
    return;
  }
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Mobile device style: fill the whole browser client area with the game canvas:
      var meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
      document.getElementsByTagName('head')[0].appendChild(meta);
      container.className = "unity-mobile";

      // To lower canvas resolution on mobile devices to gain some
      // performance, uncomment the following line:
      // config.devicePixelRatio = 1;

      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';

      unityShowBanner('WebGL builds are not supported on mobile devices.');
  } else {
      // Desktop style: Render the game canvas in a window that can be maximized to fullscreen:

      canvas.style.width = "960px";
      canvas.style.height = "600px";
  }

  loadingBar.style.display = "block";

  var script = document.createElement("script");
  script.src = loaderUrl;
  script.onload = () => {
      createUnityInstance(canvas, config, (progress) => {
        progressBarFull.style.width = 100 * progress + "%";
      }).then((unityInstance) => {
        loadingBar.style.display = "none";
        fullscreenButton.onclick = () => {
        unityInstance.SetFullscreen(1);
        globalUnityInstance = unityInstance;
        console.log(globalUnityInstance);
        globalUnityInstance.SendMessage();
      };
      }).catch((message) => {
        alert(message);
      });
    };
  document.body.appendChild(script);
});

// Function which sends the message to Unity
function sendMessageToUnity() {
  // Get the input field
  const txtMessage = document.getElementById("txtMessage");
  // Get the message
  const message = txtMessage.value;
  // Clear the input field
  txtMessage.value = "";
  // Send message to the Unity scene
  // Params: "Target object in the scene", "Function name", "Parameters"
  if (unityInstance !== undefined) {
    unityInstance.SendMessage("[Bridge]", "ReceiveMessageFromPage", message);
  } else {
    console.log("Unity instance is undefined.");
  }
}

// // Function which receives a message from Unity
// function receiveMessageFromUnity(txt) {
//   // Get element to assign the message
//   const lblMessage = document.getElementById("lblMessage");
//   // Assign received from Unity message
//   lblMessage.innerText = txt;
// }

// export { globalUnityInstance, sendMessageToUnity, receiveMessageFromUnity };