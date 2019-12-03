  const UP = 0;
  const DOWN = 1;
  const LEFT = 2;
  const RIGHT = 3;
  const NONE = -1;
  const DIRSTR = ['上','下','左','右'];
  let mv = null;
  window.ui = {
  state: 'loading',
  readyToCollect: false,
  nExamples: 0,
  dirExamples:[0,0,0,0],
  nTrainings: 0,

  getImgList: function()
  {
      return 'imglist'+mv.hotdir;
  },
  setContent: function(key, value) {
    // Set an element's content based on the data-content key.
    $('[data-content="' + key + '"]').html(value);
  },

  showInfo: function(text, dontFlash) {
    // Show info and beep / flash.
    text += '<img id="preview" src=""></img>';
    this.setContent('info', text);
    if (!dontFlash) {
      $('#info').addClass('flash');
      new Audio('hint.mp3').play();
      setTimeout(function() {
        $('#info').removeClass('flash');
      }, 1000);
    }
  },

  onWebcamEnabled: function() {
    this.state = 'finding face';
    this.showInfo("Thanks! Now let's find your face! 🤨", true);
  },

  onFoundFace: function() {
    if (this.state == 'finding face') {
      this.state = 'collecting';
      this.readyToCollect = true;
      this.showInfo(
        "<h3>Let's start!</h3>" +
          'Collect data points by moving your mouse over the screen, following the cursor with your eyes and hitting the space key repeatedly 👀',
        true,
      );
    }
  },

  onAddExample: function(nTrain, nVal) {
    // Call this when an example is added.
    this.nExamples = nTrain + nVal;
    this.setContent('n-train', nTrain);
    this.setContent('n-val', nVal);
    if (nTrain >= 2) {
      $('#start-training').prop('disabled', false);
    }
    if (this.state == 'collecting' && this.nExamples == 5) {
      this.showInfo(
        '<h3>Keep going!</h3>' +
          'You need to collect at least 20 data points to start seeing results.',
      );
    }
    if (this.state == 'collecting' && this.nExamples == 25) {
      this.showInfo(
        '<h3>Great job! 👌</h3>' +
          "Now that you have a handful of examples, let's train the neural network!<br> " +
          'Hit the training button in the top right corner!',
      );
    }
    if (this.state == 'trained' && this.nExamples == 50) {
      this.showInfo(
        '<h3>Fantastic 👏</h3>' +
          "You've collected lots of examples. Let's try training again!",
      );
    }
    if (nTrain > 0 && nVal > 0) {
      $('#store-data').prop('disabled', false);
    }
  },

  onFinishTraining: function() {
    // Call this when training is finished.
    this.nTrainings += 1;
    $('#target').css('opacity', '0.9');
    $('#draw-heatmap').prop('disabled', false);
    $('#reset-model').prop('disabled', false);
    $('#store-model').prop('disabled', false);

    if (this.nTrainings == 1) {
      this.state = 'trained';
      this.showInfo(
        '<h3>Awesome! 😍</h3>' +
          'The green target should start following your eyes around.<br>' +
          "I guess it's still very bad... 😅<br>" +
          "Let's collect more training data! Keep following the mouse cursor and hitting space.",
      );
    } else if (this.nTrainings == 2) {
      this.state = 'trained_twice';
      this.showInfo(
        '<h3>Getting better! 🚀</h3>' +
          'Keep collecting and retraining!<br>' +
          'You can also draw a heatmap that shows you where your ' +
          'model has its strong and weak points.',
      );
    } else if (this.nTrainings == 3) {
      this.state = 'trained_thrice';
      this.showInfo(
        'If your model is overfitting, remember you can reset it anytime 👻',
      );
    } else if (this.nTrainings == 4) {
      this.state = 'trained_thrice';
      this.showInfo(
        '<h3>Have fun!</h3>' +
          'Check out more of my stuff at <a href="https://cpury.github.io/" target="_blank">cpury.github.io</a> 😄',
      );
    }
  },
};

  
 mv = new Vue({
      el: '#mainview',
      data: {
          hotdir:NONE,
          samples:[0,0,0,0]          
      },
      methods:
      {
          onDirBtn:function(dir)
          {
              if(ui.readyToCollect)
              {
                this.hotdir = dir;
                ui.showInfo("采集数据 "+DIRSTR[dir]);
                dataset.captureExample();
                this.samples[dir]++;
              }
              else
              {
                ui.showInfo("首先请激活摄像头，其次请将脸部朝向摄像头.<br>推荐使用Chrome浏览器<br>不知道怎么激活请F5刷新页面，弹出窗口点击【允许】");
              }
          }
      }
  });
