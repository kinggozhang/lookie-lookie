$(document).ready(function() {
  window.mouse = {
    mousePosX: 0.5,
    mousePosY: 0.5,

    handleMouseMove: function(event) {
        let bx = $('body').width();
        let by = $('body').height();
        let cx = event.clientX;
        let cy = event.clientY;        
      if(cy*bx < cx*by && (by-cy)*bx < cx*by)
      {
          mouse.mousePosX = 1;
          mouse.mousePosY = 0.5;
      }
      else if(cy*bx < cx*by && (by-cy)*bx > cx*by)
      {
          mouse.mousePosX = 0.5;
          mouse.mousePosY = 0.0;
      }
      else if(cy*bx > cx*by && (by-cy)*bx > cx*by)
      {
          mouse.mousePosX = 0.0;
          mouse.mousePosY = 0.5;
      }
      else
      {
          mouse.mousePosX = 0.5;
          mouse.mousePosY = 1;
      }
    },
    
    getMousePos: function() {
        console.log("x:"+mouse.mousePosX + " y:" + mouse.mousePosY);
      return [mouse.mousePosX, mouse.mousePosY];
    },
  };

  document.onmousemove = mouse.handleMouseMove;
});
