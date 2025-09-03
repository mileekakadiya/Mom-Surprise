const slideshow = document.getElementById('slideshow');
const slides = slideshow.querySelectorAll('img');
const notes = document.querySelectorAll('.note');
const finalMessage = document.getElementById('finalMessage');
const bgMusic = document.getElementById('bgMusic');

let currentSlide = 0;
let currentNote = 0;

// Create instruction div
const instructions = document.createElement('div');
instructions.id = "instructions";
instructions.innerText = "👉 Drag the note to reveal the next one 💌";
document.body.appendChild(instructions);

// START SURPRISE (Intro click)
function startSurprise() {
  document.getElementById('intro').style.display = 'none';
  document.getElementById('greeting').style.display = 'block';
  bgMusic.play();
  setTimeout(startSlideshow, 1500);
}

// START SLIDESHOW
function startSlideshow() {
  document.getElementById('greeting').style.display = 'none';
  slideshow.style.display = 'block';
  updateSlide();
  autoSlide();
}

// SHOW CURRENT SLIDE
function updateSlide() {
  slides.forEach((slide, i) => slide.style.opacity = i === currentSlide ? '1' : '0');
}

// AUTO SLIDESHOW TIMER (5s)
function autoSlide() {
  const interval = setInterval(() => {
    currentSlide++;
    if (currentSlide >= slides.length) {
      clearInterval(interval);
      startNotes();
    } else {
      updateSlide();
    }
  }, 5000);
}

// START NOTES
function startNotes() {
  slideshow.style.display = 'none';
  notes[currentNote].style.display = 'block';
  instructions.style.display = 'block';
  notes.forEach(note => makeDraggable(note));
}

// MAKE NOTES DRAGGABLE
function makeDraggable(note) {
  note.addEventListener('mousedown', function(e) {
    let shiftX = e.clientX - note.getBoundingClientRect().left;
    let shiftY = e.clientY - note.getBoundingClientRect().top;

    function moveAt(pageX, pageY) { note.style.left = pageX - shiftX + 'px'; note.style.top = pageY - shiftY + 'px'; }
    function onMouseMove(e) { moveAt(e.pageX, e.pageY); }

    document.addEventListener('mousemove', onMouseMove);

    note.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      note.onmouseup = null;

      if (currentNote < notes.length - 1) {
        currentNote++;
        notes[currentNote].style.display = 'block';
      } else {
        instructions.style.display = 'none';
        launchConfetti();
        finalMessage.style.display = 'block';
      }
    };
  });
  note.ondragstart = () => false;
}

// CONFETTI
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  for(let i=0;i<150;i++){
    pieces.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height- canvas.height,size:Math.random()*10+5,speed:Math.random()*3+2,color:`hsl(${Math.random()*360},100%,70%)`});
  }

  function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      p.y+=p.speed;
      if(p.y>canvas.height)p.y=-10;
      ctx.fillStyle=p.color;
      ctx.fillRect(p.x,p.y,p.size,p.size);
    });
    requestAnimationFrame(update);
  }
  update();
}
