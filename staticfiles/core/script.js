/* Hitesh Shah — portfolio behaviour
   Header state, mobile menu, Nepal clock, contact form feedback. */

(() => {
    const header = document.querySelector('.site-header');
    const hero = document.querySelector('.hero');
    const nav = document.getElementById('site-nav');
    const menuBtn = document.querySelector('.menu-btn');

    /* Header: transparent over the hero, solid once the hero has scrolled past */
    if (header && hero) {
        let ticking = false;
        const update = () => {
            const past = window.scrollY > hero.offsetHeight - header.offsetHeight;
            header.classList.toggle('is-scrolled', past);
            ticking = false;
        };
        update();
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(update);
            }
        }, { passive: true });
        window.addEventListener('resize', update);
    }

    /* Mobile menu */
    if (header && nav && menuBtn) {
        const setOpen = (open) => {
            nav.classList.toggle('is-open', open);
            header.classList.toggle('menu-open', open);
            document.body.classList.toggle('menu-open', open);
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.textContent = open ? 'Close' : 'Menu';
        };
        menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
        nav.addEventListener('click', (e) => {
            if (e.target.closest('a')) setOpen(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('is-open')) {
                setOpen(false);
                menuBtn.focus();
            }
        });
        window.matchMedia('(min-width: 820px)').addEventListener('change', (e) => {
            if (e.matches) setOpen(false);
        });
    }

    /* Local time in Nepal, shown only when the browser can format it */
    const timeNote = document.getElementById('time-note');
    const timeEl = document.getElementById('nepal-time');
    if (timeNote && timeEl) {
        try {
            const fmt = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                timeZone: 'Asia/Kathmandu'
            });
            const tick = () => {
                timeEl.textContent = fmt.format(new Date());
            };
            tick();
            timeNote.hidden = false;
            window.setInterval(tick, 30000);
        } catch (err) {
            /* leave the note hidden */
        }
    }

    /* Contact form: show progress and block double submits */
    const form = document.querySelector('.form');
    if (form) {
        form.addEventListener('submit', () => {
            const button = form.querySelector('button[type="submit"]');
            const label = button && button.querySelector('.btn-label');
            if (!button) return;
            button.disabled = true;
            if (label) label.textContent = 'Sending…';
        });
    }

    /* Success toast: leave it up long enough to read, then remove */
    const toast = document.querySelector('.toast');
    if (toast) {
        window.setTimeout(() => {
            toast.classList.add('is-hiding');
            window.setTimeout(() => toast.remove(), 450);
        }, 4500);
    }

    /* Hero: a lightweight projected particle field creates depth without a
       library or a large asset payload. */
    const orbitCanvas = document.getElementById('hero-orbit');
    if (orbitCanvas) {
        const orbitContext = orbitCanvas.getContext('2d');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const particles = Array.from({ length: 74 }, (_, index) => ({
            x: (Math.random() - 0.5) * 2.4,
            y: (Math.random() - 0.5) * 1.5,
            z: Math.random() * 1.4 + 0.15,
            size: Math.random() * 1.8 + 0.5,
            phase: index * 0.37
        }));
        let orbitFrame;
        let orbitWidth = 0;
        let orbitHeight = 0;
        let pointerX = 0;
        let pointerY = 0;

        const resizeOrbit = () => {
            const rect = orbitCanvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            orbitWidth = rect.width;
            orbitHeight = rect.height;
            orbitCanvas.width = Math.round(rect.width * ratio);
            orbitCanvas.height = Math.round(rect.height * ratio);
            orbitContext.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        const drawOrbit = (time = 0) => {
            orbitContext.clearRect(0, 0, orbitWidth, orbitHeight);
            const centerX = orbitWidth * (0.66 + pointerX * 0.025);
            const centerY = orbitHeight * (0.45 + pointerY * 0.02);
            const projected = particles.map((particle) => {
                const depth = 1 / particle.z;
                return {
                    x: centerX + particle.x * orbitHeight * depth * 0.5,
                    y: centerY + particle.y * orbitHeight * depth * 0.5,
                    size: particle.size * depth * 0.8,
                    opacity: Math.max(0.08, 0.9 - particle.z * 0.45)
                };
            });

            projected.forEach((particle, index) => {
                const next = projected[(index + 7) % projected.length];
                if (Math.hypot(particle.x - next.x, particle.y - next.y) < orbitWidth * 0.16) {
                    orbitContext.strokeStyle = `rgba(183, 190, 255, ${particle.opacity * 0.14})`;
                    orbitContext.lineWidth = 1;
                    orbitContext.beginPath();
                    orbitContext.moveTo(particle.x, particle.y);
                    orbitContext.lineTo(next.x, next.y);
                    orbitContext.stroke();
                }
                orbitContext.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                orbitContext.beginPath();
                orbitContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                orbitContext.fill();
            });

            orbitContext.strokeStyle = 'rgba(255, 194, 26, 0.3)';
            orbitContext.lineWidth = 1;
            orbitContext.beginPath();
            orbitContext.ellipse(centerX, centerY, orbitHeight * 0.4, orbitHeight * 0.13, -0.22, 0, Math.PI * 2);
            orbitContext.stroke();

            if (!reducedMotion) {
                particles.forEach((particle) => {
                    particle.z -= 0.0016;
                    if (particle.z < 0.08) particle.z = 1.55;
                });
                orbitFrame = window.requestAnimationFrame(drawOrbit);
            }
        };

        resizeOrbit();
        drawOrbit();
        window.addEventListener('resize', resizeOrbit);
        window.addEventListener('pointermove', (event) => {
            pointerX = (event.clientX / window.innerWidth) * 2 - 1;
            pointerY = (event.clientY / window.innerHeight) * 2 - 1;
        }, { passive: true });
        if (reducedMotion && orbitFrame) window.cancelAnimationFrame(orbitFrame);
    }

    /* Small canvas lab with two modes: click targets or guide an auto-jumping
       character across floating platforms. */
    const gameCanvas = document.getElementById('signal-game');
    const startButton = document.getElementById('signal-start');
    const scoreEl = document.getElementById('signal-score');
    const gameTimeEl = document.getElementById('signal-time');
    const statusEl = document.getElementById('signal-status');
    const descriptionEl = document.getElementById('lab-description');
    const scoreLabelEl = document.getElementById('score-label');
    const modeButtons = document.querySelectorAll('[data-game-mode]');
    if (gameCanvas && startButton && scoreEl && gameTimeEl && statusEl) {
        const gameContext = gameCanvas.getContext('2d');
        const game = {
            active: false,
            mode: 'signal',
            score: 0,
            time: 20,
            target: { x: 360, y: 230, radius: 25 },
            player: { x: 80, y: 350, width: 28, height: 36, velocityY: 0, direction: 0 },
            coins: [],
            platforms: [
                { x: 30, y: 405, width: 180, height: 14 },
                { x: 250, y: 330, width: 150, height: 14 },
                { x: 475, y: 245, width: 180, height: 14 },
                { x: 315, y: 160, width: 130, height: 14 }
            ],
            timer: null,
            frame: null
        };
        const resetGame = () => {
            game.active = false;
            game.score = 0;
            game.time = game.mode === 'jumper' ? 30 : 20;
            game.player = { x: 80, y: 350, width: 28, height: 36, velocityY: 0, direction: 0 };
            game.coins = [
                { x: 145, y: 365, collected: false },
                { x: 300, y: 290, collected: false },
                { x: 540, y: 205, collected: false },
                { x: 375, y: 120, collected: false },
                { x: 610, y: 365, collected: false }
            ];
            window.clearInterval(game.timer);
            window.cancelAnimationFrame(game.frame);
            scoreEl.textContent = '0';
            gameTimeEl.textContent = String(game.time);
        };
        const finishGame = (message) => {
            game.active = false;
            window.clearInterval(game.timer);
            window.cancelAnimationFrame(game.frame);
            statusEl.textContent = message;
            startButton.textContent = 'Try again';
            drawGame();
        };
        const drawScene = () => {
            gameContext.fillStyle = '#0b1240';
            gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
            gameContext.fillStyle = 'rgba(255, 255, 255, 0.06)';
            for (let x = 0; x < gameCanvas.width; x += 48) {
                gameContext.fillRect(x, 0, 1, gameCanvas.height);
            }
            for (let y = 0; y < gameCanvas.height; y += 48) {
                gameContext.fillRect(0, y, gameCanvas.width, 1);
            }
        };
        const drawGame = (now = 0) => {
            if (game.active && game.mode === 'jumper') updateJumper();
            drawScene();
            if (game.mode === 'signal') {
                const target = game.target;
                const pulse = 1 + Math.sin(now / 170) * 0.1;
                gameContext.fillStyle = 'rgba(255, 194, 26, 0.12)';
                gameContext.beginPath();
                gameContext.arc(target.x, target.y, target.radius * 2.2 * pulse, 0, Math.PI * 2);
                gameContext.fill();
                gameContext.fillStyle = '#ffc21a';
                gameContext.beginPath();
                gameContext.arc(target.x, target.y, target.radius * pulse, 0, Math.PI * 2);
                gameContext.fill();
                gameContext.fillStyle = '#0b1240';
                gameContext.beginPath();
                gameContext.arc(target.x, target.y, 5, 0, Math.PI * 2);
                gameContext.fill();
            } else {
                gameContext.fillStyle = '#7784ff';
                game.platforms.forEach((platform) => gameContext.fillRect(platform.x, platform.y, platform.width, platform.height));
                game.coins.forEach((coin) => {
                    if (coin.collected) return;
                    gameContext.fillStyle = '#ffc21a';
                    gameContext.beginPath();
                    gameContext.arc(coin.x, coin.y, 9 + Math.sin(now / 150) * 2, 0, Math.PI * 2);
                    gameContext.fill();
                });
                const player = game.player;
                gameContext.fillStyle = '#fff';
                gameContext.fillRect(player.x, player.y, player.width, player.height);
                gameContext.fillStyle = '#ffc21a';
                gameContext.fillRect(player.x + 5, player.y + 8, 5, 5);
                gameContext.fillRect(player.x + 18, player.y + 8, 5, 5);
            }
            if (game.active) game.frame = window.requestAnimationFrame(drawGame);
        };
        const placeTarget = () => {
            game.target.x = 45 + Math.random() * (gameCanvas.width - 90);
            game.target.y = 55 + Math.random() * (gameCanvas.height - 125);
        };
        const updateJumper = () => {
            const player = game.player;
            player.x += player.direction * 4;
            player.x = Math.max(0, Math.min(gameCanvas.width - player.width, player.x));
            player.velocityY += 0.45;
            const previousBottom = player.y + player.height;
            player.y += player.velocityY;
            game.platforms.forEach((platform) => {
                const overlaps = player.x < platform.x + platform.width && player.x + player.width > platform.x;
                if (overlaps && player.velocityY > 0 && previousBottom <= platform.y && player.y + player.height >= platform.y) {
                    player.y = platform.y - player.height;
                    player.velocityY = -10;
                }
            });
            if (player.y > gameCanvas.height + 20) {
                player.x = 80;
                player.y = 350;
                player.velocityY = -10;
            }
            game.coins.forEach((coin) => {
                if (!coin.collected && Math.hypot(player.x + player.width / 2 - coin.x, player.y + player.height / 2 - coin.y) < 28) {
                    coin.collected = true;
                    game.score += 1;
                    scoreEl.textContent = String(game.score);
                    if (game.score >= game.coins.length) finishGame('Perfect route. All points collected.');
                }
            });
        };
        const startGame = () => {
            resetGame();
            game.active = true;
            statusEl.textContent = game.mode === 'jumper' ? 'Use ← → or A / D to steer. Jump automatically.' : 'Find the glowing signal.';
            startButton.textContent = 'Restart experiment';
            placeTarget();
            game.timer = window.setInterval(() => {
                game.time -= 1;
                gameTimeEl.textContent = String(game.time);
                if (game.time <= 0) finishGame(game.score === (game.mode === 'jumper' ? game.coins.length : 5) ? 'Signal complete. Nice work.' : 'Time’s up. Try another run.');
            }, 1000);
            game.frame = window.requestAnimationFrame(drawGame);
        };
        startButton.addEventListener('click', () => {
            startGame();
        });
        gameCanvas.addEventListener('pointerdown', (event) => {
            if (!game.active) return;
            if (game.mode === 'jumper') {
                gameCanvas.focus();
                game.player.velocityY = -11;
                return;
            }
            const rect = gameCanvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * gameCanvas.width / rect.width;
            const y = (event.clientY - rect.top) * gameCanvas.height / rect.height;
            if (Math.hypot(x - game.target.x, y - game.target.y) > game.target.radius * 1.8) return;
            game.score += 1;
            scoreEl.textContent = String(game.score);
            if (game.score >= 5) {
                finishGame('Signal complete. Nice work.');
            } else {
                placeTarget();
            }
        });
        window.addEventListener('keydown', (event) => {
            if (!game.active || game.mode !== 'jumper') return;
            if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') game.player.direction = -1;
            if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') game.player.direction = 1;
            if (event.key === ' ') game.player.velocityY = -11;
        });
        window.addEventListener('keyup', (event) => {
            if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key)) game.player.direction = 0;
        });
        modeButtons.forEach((button) => button.addEventListener('click', () => {
            game.mode = button.dataset.gameMode;
            modeButtons.forEach((modeButton) => {
                const active = modeButton === button;
                modeButton.classList.toggle('is-active', active);
                modeButton.setAttribute('aria-pressed', String(active));
            });
            if (game.mode === 'jumper') {
                descriptionEl.textContent = 'Guide a jumping character across floating platforms and collect every point before the clock runs out.';
                scoreLabelEl.textContent = '/ 5 points';
                gameCanvas.setAttribute('aria-label', 'Jumper game area. Use arrow keys or A and D to move.');
            } else {
                descriptionEl.textContent = 'Move through the field and collect five signals before the clock runs out. A tiny experiment in motion, focus, and fun.';
                scoreLabelEl.textContent = '/ 5 caught';
                gameCanvas.setAttribute('aria-label', 'Signal Catch game area');
            }
            resetGame();
            drawGame();
        }));
        drawGame();
    }
})();