var game = document.getElementById('game');
var player = document.getElementById('player');
var scoreElement = document.getElementById('score');
var levelElement = document.getElementById('level-text');
var level = 1;
var score = 0;
var speed = 0.0;
var prevScore = 0;
var lose = false;
var eIntervalId;
var sIntervalId;
var spawn = 1000;
var player_speed = 5;

// Audio elements
var mainMusic = new Audio('In-Game audio.wav');
var gameMusic = new Audio('Game Menu audio.wav');
var gameOverMusic = new Audio('Game Over audio.wav');

mainMusic.loop = true;
gameMusic.loop = true;

function createEnemy() {
    var enemy = document.createElement('img');
    var enemy_speed_mult = star_speed_mult = 1;
    enemy.src='asteroid2.png';
    enemy.classList.add('enemy');
    game.appendChild(enemy);
    
    // Varying size based on the current score
    var enemySize = (Math.random() * 6)+4; // Adjust the size range as needed
    enemy.style.width = enemySize + '%';
    enemy.style.height = enemy.style.width;

    // Varying speed based on the current score 
    var enemyLeft = Math.random() * (game.offsetWidth - enemySize);
    enemy.style.left = enemyLeft + 'px';
    if (score >= prevScore + 5)
            {
                prevScore = score;
                level++;
                levelElement.textContent = "LEVEL: " + level;
                enemy_speed_mult += 15;
                // star_speed_mult += 2;
                clearInterval(eIntervalId);
                eIntervalId = null;
                eIntervalId = setInterval(createEnemy,spawn - 25 * (level -1));
            }

    function step() {
        var speed = Math.random() * 2 * enemy_speed_mult + 1;
        enemy.style.top = (enemy.offsetTop + speed) + 'px';
        if(!lose){
            if (enemy.offsetTop > game.offsetHeight) {
                enemy.remove();
                score++;
                scoreElement.textContent = score;
            }
            if (!isColliding(player, enemy)) {
                requestAnimationFrame(step);
            } else {
                player_speed = 0;
                lose = true;
                return;
            }
        }
    }
 
    if(!lose){
        step();
    }else{
        on();
        player_speed = 0;
        enemy.remove();
        return;
    }
}
if(lose){
    clearInterval(eIntervalId);
    clearInterval(sIntervalId);
    eIntervalId = null;
    sIntervalId = null;
}else{
    eIntervalId = setInterval(createEnemy,spawn);
}

function on() {
    mainMusic.pause();
    gameMusic.currentTime = 0;
    gameOverMusic.play();//something
    
    document.getElementById('modal-level-value').textContent = level;
    document.getElementById('modal-score').textContent = score;
    
    document.getElementById("overlay").style.display = "block";
}



function restart(){
    gameOverMusic.pause();
    gameOverMusic.currentTime = 0;

    gameMusic.play();

    lose=false;

    off();

    window.location.reload();
}
  
function off() {
    gameOverMusic.pause();
    
    gameOverMusic.currentTime = 0;

    document.getElementById("overlay").style.display = "none";
} 

function isColliding(div1, div2) {
    var rect1 = div1.getBoundingClientRect();
    
     var rect2 =
     div2.getBoundingClientRect();

     return !(rect1.right < rect2.left ||
             rect1.left > rect2.right ||
             rect1.bottom < rect2.top ||
             rect1.top > rect2.bottom);
}

window.addEventListener('keydown', function(event) {
     if (event.key === 'ArrowLeft') {
         speed =
         -player_speed; // Move left
     } else if (event.key === 'ArrowRight') {    
         speed =
         player_speed; // Move right
     }
});

window.addEventListener('keyup', function(event) {
     if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
         speed =
         0; // Stop moving when key is released
     }
});

function animate() { //animate function
     var left =
     player.offsetLeft;

     player.style.left =
     Math.max(Math.min(left + speed, game.offsetWidth - player.offsetWidth), 0) + 'px';

     requestAnimationFrame(animate);
}

animate();
// New JavaScript code with laser shooting feature

var speed = 0; // Initialize speed
var isShooting = false; // Flag to track if the laser button is held down
var laserCooldown = 1000; // Delay between laser shots (1 second)
var lastShotTime = 0; // Timestamp of the last laser shot

// Handle rocket movement using arrow keys
window.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        speed = -player_speed; // Move left
    } else if (event.key === 'ArrowRight') {
        speed = player_speed; // Move right
    }
});

window.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        speed = 0; // Stop moving when key is released
    }
});

function animate() {
    var left = player.offsetLeft;
    player.style.left = Math.max(Math.min(left + speed, game.offsetWidth - player.offsetWidth), 0) + 'px';
    requestAnimationFrame(animate);
}

animate();

// Function to create lasers
function createLaser() {
    var laser = document.createElement('div');
    laser.classList.add('laser');
    game.appendChild(laser);
    laser.style.left = (player.offsetLeft + player.offsetWidth / 2) + 'px';
    laser.style.top = player.offsetTop + 'px';
    return laser;
}

// Function to move lasers and check for collisions with asteroids
function moveLaser(laser) {
    function step() {
        if (laser) {
            laser.style.top = (laser.offsetTop - 5) + 'px';
        }
        if (laser && laser.offsetTop < 0) {
            laser.remove();
        } else if (laser) {
            let enemies = document.querySelectorAll('.enemy');
            let hitEnemy = false;
            enemies.forEach(enemy => {
                if (laser && enemy && isColliding(laser, enemy)) {
                    // Asteroid hit by a laser
                    laser.remove();
                    enemy.style.animation = 'explode 0.5s'; // Cool explosion animation
                    setTimeout(() => {
                        enemy.remove();
                    }, 500);
                    // Increase score or perform other actions here
                    hitEnemy = true;
                }
            });
            if (hitEnemy) {
                return; // Don't continue checking if an enemy was hit
            } else {
                requestAnimationFrame(step);
            }
        }
    }
    step();
}

// Handle laser shooting when the Space key is pressed
window.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (!isShooting) {
            isShooting = true;
            var currentTime = Date.now();
            if (currentTime - lastShotTime >= laserCooldown) {
                lastShotTime = currentTime;
                var laser = createLaser();
                moveLaser(laser);
            }
        }
    }
});

// Stop shooting when the Space key is released
window.addEventListener('keyup', function(event) {
    if (event.code === 'Space') {
        isShooting = false;
    }
});


// Start the main music
mainMusic.play();