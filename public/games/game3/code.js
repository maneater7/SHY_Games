const PEER_ADVOCATE_URL = "#";

    const rawScenarios = [
      {
        "id": "s1",
        "title": "Asking before a hug",
        "scenario": "Someone asks for permission before hugging another person.",
        "correct": "green",
        "explanation": "Asking permission shows respect for another person’s boundaries.",
        "ifPickedInstead": {
          "yellow": "Asking first doesn’t need more context. It’s a clear sign of respect.",
          "red": "Asking first is a healthy habit, not a warning sign."
        },
        "takeaway": "Asking first shows respect."
      },
      {
        "id": "s2",
        "title": "Joking after being asked to stop",
        "scenario": "Someone keeps joking about another person’s boundaries after being asked to stop.",
        "correct": "red",
        "explanation": "Continuing after someone has clearly said they’re uncomfortable shows a lack of respect for their boundaries.",
        "ifPickedInstead": {
          "green": "The key detail is “after being asked to stop”. Once someone has said no, carrying on isn’t harmless.",
          "yellow": "The key detail is “after being asked to stop”. Once someone has said no, carrying on is not a misunderstanding."
        },
        "takeaway": "After someone says stop, carrying on is not a joke."
      },
      {
        "id": "s3",
        "title": "Going quiet when upset",
        "scenario": "A friend goes quiet whenever they’re upset and won’t say why.",
        "correct": "yellow",
        "explanation": "It needs context. Some people need time before they can talk, and the healthy response is to check in kindly and respect their pace. It becomes a concern if the silence is used to punish or control the other person.",
        "ifPickedInstead": {
          "green": "One situation alone doesn’t tell us enough to call it healthy. Check in kindly and see how they respond.",
          "red": "One situation alone doesn’t tell us enough to call it harmful. Some people just need time before they can talk."
        },
        "takeaway": "Silence can mean someone needs time. Check in kindly and respect their pace.",
        "branches": {
          "healthy": "You check in kindly, and they talk when they’re ready.",
          "concerning": "The silence is used to punish or control you."
        }
      },
      {
        "id": "s4",
        "title": "“Prove you trust me”",
        "scenario": "Someone you’re talking to says that if you trust them, you’ll send them private pictures.",
        "correct": "red",
        "explanation": "Trust doesn’t depend on sending private images. Using trust to pressure someone is manipulation, and consent must be freely given.",
        "ifPickedInstead": {
          "green": "Pressure is a warning sign even when it’s phrased as a compliment or a test of trust.",
          "yellow": "This isn’t a grey area. Consent must be freely given, and pressure to send pictures is a warning sign."
        },
        "takeaway": "Trust never requires sending private pictures."
      },
      {
        "id": "s5",
        "title": "Respecting topics you don’t want to discuss",
        "scenario": "A friend notices you don’t want to talk about certain topics and doesn’t push you.",
        "correct": "green",
        "explanation": "People have different comfort levels, and respecting them is part of healthy communication.",
        "ifPickedInstead": {
          "yellow": "Not pushing is respect, not avoidance, so it doesn’t need more context.",
          "red": "Not pushing is respect, not avoidance. It isn’t a warning sign."
        },
        "takeaway": "Respecting someone’s comfort level is part of healthy communication."
      },
      {
        "id": "s6",
        "title": "Time with friends",
        "scenario": "Your partner says they miss you when you see friends on weekends and asks you to spend more time with them.",
        "correct": "yellow",
        "explanation": "Wanting time together is normal. What matters is how they respond when you say no. Respecting your answer is healthy, while guilt-tripping or getting angry is a concern.",
        "ifPickedInstead": {
          "green": "Wanting time together is normal, but we can’t call it healthy until we see how they react to your answer.",
          "red": "Missing you isn’t a warning sign by itself. What matters is how they respond when you say no."
        },
        "takeaway": "Wanting time together is normal. How they respond to your “no” is what matters.",
        "branches": {
          "healthy": "They respect your answer when you say no.",
          "concerning": "They guilt-trip you or get angry."
        }
      },
      {
        "id": "s7",
        "title": "Changing your mind",
        "scenario": "Someone agreed to something earlier, then says they’ve changed their mind. The other person says, “But you already said yes.”",
        "correct": "red",
        "explanation": "Consent can be withdrawn at any time. Saying yes once doesn’t mean yes forever.",
        "ifPickedInstead": {
          "green": "Treating an earlier yes as binding ignores the other person’s right to change their mind.",
          "yellow": "This isn’t a grey area. Treating an earlier yes as binding ignores the other person’s right to change their mind."
        },
        "takeaway": "Consent can be withdrawn at any time."
      },
      {
        "id": "s8",
        "title": "Asking before sharing",
        "scenario": "A friend asks whether it’s okay before telling anyone else something you shared with them.",
        "correct": "green",
        "explanation": "Checking before sharing someone’s personal information respects their privacy and builds trust.",
        "ifPickedInstead": {
          "yellow": "Asking permission protects the other person’s privacy, so it doesn’t need more context.",
          "red": "Asking first is a good sign, not a warning sign. It protects the other person’s privacy."
        },
        "takeaway": "Asking before sharing builds trust."
      },
      {
        "id": "s9",
        "title": "Personal questions from someone online",
        "scenario": "Someone you met online keeps asking where you live and where you study, and gets annoyed when you don’t answer.",
        "correct": "red",
        "explanation": "Pressing for personal details and getting upset about boundaries is a safety risk. Don’t share your location or where you study, and tell someone you trust.",
        "ifPickedInstead": {
          "green": "Annoyance at your “no” is the warning sign here, not the questions alone.",
          "yellow": "Getting annoyed at your “no” while asking where you live is more than a grey area. It’s a safety risk."
        },
        "takeaway": "If someone gets upset when you keep personal details private, step back and tell someone you trust."
      },
      {
        "id": "s10",
        "title": "Choosing where to meet",
        "scenario": "A friend usually decides where you meet without asking what you’d like.",
        "correct": "yellow",
        "explanation": "It could be habit rather than disrespect. It’s worth saying something like “Can I pick next time?” If they ignore a clear request, it becomes a red flag.",
        "ifPickedInstead": {
          "green": "It could be habit, but we can’t call it healthy until they hear a clear request. Try saying something.",
          "red": "Small patterns like this are a chance to communicate, not an automatic red flag."
        },
        "takeaway": "Small patterns are a chance to speak up. A clear request that’s ignored is a red flag.",
        "branches": {
          "healthy": "They listen when you say “Can I pick next time?”",
          "concerning": "They ignore a clear request."
        }
      }
    ];

    function getDuckAvatarSVG(character = 'pip', size = 32) {
      if (character === 'pip') {
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 40 40">
            <ellipse cx="20" cy="26" rx="10" ry="7" fill="#FFE0A8" stroke="#2B2350" stroke-width="1.8"/>
            <circle cx="23" cy="16" r="6.5" fill="#FFE0A8" stroke="#2B2350" stroke-width="1.8"/>
            <path d="M23 8 C18 4 21 2 25 5 C27 3 31 5 26 9 Z" fill="#86E0AE" stroke="#2B2350" stroke-width="1.2"/>
            <circle cx="25" cy="15" r="1.3" fill="#2B2350" class="duck-eye-blink"/>
            <path d="M28 15 Q33 16 31 18 Z" fill="#FF8F80" stroke="#2B2350" stroke-width="1.4"/>
            <line x1="12" y1="8" x2="12" y2="28" stroke="#2B2350" stroke-width="1.8"/>
            <polygon points="12,8 4,12 12,16" fill="#86E0AE" stroke="#2B2350" stroke-width="1.4"/>
          </svg>
        `;
      } else if (character === 'quill') {
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 40 40">
            <ellipse cx="20" cy="26" rx="10" ry="7" fill="#FFE0A8" stroke="#2B2350" stroke-width="1.8"/>
            <circle cx="18" cy="16" r="6.5" fill="#FFE0A8" stroke="#2B2350" stroke-width="1.8"/>
            <circle cx="16" cy="15.5" r="2.4" fill="none" stroke="#2B2350" stroke-width="1.4"/>
            <circle cx="16" cy="15.5" r="1.1" fill="#2B2350" class="duck-eye-blink"/>
            <path d="M12 15 Q8 16 10 18 Z" fill="#FF8F80" stroke="#2B2350" stroke-width="1.4"/>
            <line x1="28" y1="8" x2="28" y2="28" stroke="#2B2350" stroke-width="1.8"/>
            <polygon points="28,8 36,12 28,16" fill="#FFD95A" stroke="#2B2350" stroke-width="1.4"/>
          </svg>
        `;
      } else {
        return `
          <svg width="${size}" height="${size}" viewBox="0 0 40 40">
            <ellipse cx="20" cy="26" rx="10" ry="7" fill="#FFE0A8" stroke="#2B2350" stroke-width="1.8"/>
            <circle cx="17" cy="16" r="6.5" fill="#FFE0A8" stroke="#2B2350" stroke-width="1.8"/>
            <circle cx="16" cy="15.5" r="1.3" fill="#2B2350" class="duck-eye-blink"/>
            <path d="M11 15 Q7 16 9 18 Z" fill="#FF8F80" stroke="#2B2350" stroke-width="1.4"/>
            <line x1="28" y1="8" x2="28" y2="28" stroke="#2B2350" stroke-width="1.8"/>
            <polygon points="28,8 36,12 28,16" fill="#FF8F80" stroke="#2B2350" stroke-width="1.4"/>
          </svg>
        `;
      }
    }

    function getPondSwimmerSVG(size = 32) {
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 38 34" class="duck-float-green">
          <ellipse cx="18" cy="22" rx="11" ry="8" fill="#FFE0A8" stroke="#2B2350" stroke-width="2"/>
          <path d="M13 22 Q18 19 21 22" fill="none" stroke="#2B2350" stroke-width="1.8"/>
          <circle cx="24" cy="14" r="6.5" fill="#FFE0A8" stroke="#2B2350" stroke-width="2"/>
          <circle cx="25.5" cy="13" r="1.4" fill="#2B2350" class="duck-eye-blink"/>
          <circle cx="26" cy="12.4" r="0.6" fill="#FFFFFF"/>
          <path d="M29.5 13 Q34 14 32 17 Z" fill="#FF8F80" stroke="#2B2350" stroke-width="1.6"/>
          <path d="M8 29 Q14 26 20 29 T32 29" fill="none" stroke="#4DEBE3" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `;
    }

    function triggerDuckRain() {
      const rainContainer = document.getElementById('duck-rain-container');
      rainContainer.innerHTML = '';
      const duckCount = 6;
      const flagColors = ['#86E0AE', '#FFD95A', '#FF8F80'];
      for (let i = 0; i < duckCount; i++) {
        const duckEl = document.createElement('div');
        duckEl.setAttribute('aria-hidden', 'true');
        duckEl.className = 'absolute duck-rain-item pointer-events-none';
        const leftPos = 8 + Math.floor(Math.random() * 84);
        const delay = (i * 0.16 + Math.random() * 0.1).toFixed(2);
        const rot = (-15 + Math.random() * 30).toFixed(0);
        const rotEnd = (-12 + Math.random() * 24).toFixed(0);
        duckEl.style.left = `${leftPos}%`;
        duckEl.style.top = `-60px`;
        duckEl.style.animationDelay = `${delay}s`;
        duckEl.style.setProperty('--fall-rot', `${rot}deg`);
        duckEl.style.setProperty('--fall-rot-end', `${rotEnd}deg`);

        duckEl.innerHTML = `
          <svg width="72" height="72" viewBox="0 0 44 44" class="filter drop-shadow-[2px_2px_0px_#2B2350]">
            <ellipse cx="22" cy="27" rx="11" ry="8" fill="#FFE0A8" stroke="#2B2350" stroke-width="2.2"/>
            <path d="M12 25 C8 15 14 12 17 22" fill="#FFD95A" stroke="#2B2350" stroke-width="2"/>
            <path d="M32 25 C36 15 30 12 27 22" fill="#FFD95A" stroke="#2B2350" stroke-width="2"/>
            <circle cx="22" cy="16" r="7" fill="#FFE0A8" stroke="#2B2350" stroke-width="2.2"/>
            <circle cx="19.5" cy="15" r="1.3" fill="#2B2350" class="duck-eye-blink"/>
            <circle cx="24.5" cy="15" r="1.3" fill="#2B2350" class="duck-eye-blink"/>
            <path d="M19 19 Q22 23 25 19 Z" fill="#FF8F80" stroke="#2B2350" stroke-width="1.8"/>
            <line x1="11" y1="8" x2="11" y2="31" stroke="#2B2350" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M11 8 Q23 11 11 16 Z" fill="${flagColors[i % flagColors.length]}" stroke="#2B2350" stroke-width="1.5"/>
          </svg>
        `;
        rainContainer.appendChild(duckEl);
      }
      setTimeout(() => { rainContainer.innerHTML = ''; }, 4200);
    }

    // -------------------------------------------------------------
    // App State
    // -------------------------------------------------------------
    let gameScenarios = [];

    function shuffle(items) {
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }
      return items;
    }
    let currentIndex = 0;
    let cardIsSelected = false;
    let userAnswers = {};

    const screenWelcome = document.getElementById('screen-welcome');
    const screenPlay = document.getElementById('screen-play');
    const screenFeedback = document.getElementById('screen-feedback');
    const screenCompletion = document.getElementById('screen-completion');
    const headerExitContainer = document.getElementById('header-exit-container');

    const btnStart = document.getElementById('btn-start');
    const btnExit = document.getElementById('btn-exit');
    const btnSkip = document.getElementById('btn-skip');
    const btnContinue = document.getElementById('btn-continue');
    const btnRestart = document.getElementById('btn-restart');
    const peerAdvocateLink = document.getElementById('peer-advocate-link');

    const scenarioCard = document.getElementById('scenario-card');
    const scenarioTitle = document.getElementById('scenario-title');
    const scenarioBody = document.getElementById('scenario-body');
    const scenarioTopicTag = document.getElementById('scenario-topic-tag');
    const cardIndexTag = document.getElementById('card-index-tag');
    const selectionIndicator = document.getElementById('selection-indicator');
    const progressBadge = document.getElementById('progress-badge');
    const pegsTrack = document.getElementById('pegs-track');

    const feedbackDuckReactionAvatar = document.getElementById('feedback-duck-reaction-avatar');
    const feedbackFlagPill = document.getElementById('feedback-flag-pill');
    const feedbackFlagIcon = document.getElementById('feedback-flag-icon');
    const feedbackFlagLabel = document.getElementById('feedback-flag-label');
    const feedbackMatchStatus = document.getElementById('feedback-match-status');
    const feedbackScenarioTitle = document.getElementById('feedback-scenario-title');
    const feedbackWrongBox = document.getElementById('feedback-wrong-box');
    const feedbackWrongText = document.getElementById('feedback-wrong-text');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const feedbackTakeaway = document.getElementById('feedback-takeaway');
    const yellowForkContainer = document.getElementById('yellow-fork-container');
    const forkHealthyText = document.getElementById('fork-healthy-text');
    const forkConcerningText = document.getElementById('fork-concerning-text');

    const completionStats = document.getElementById('completion-stats');
    const yellowHighlightStat = document.getElementById('yellow-highlight-stat');
    const takeawaysList = document.getElementById('takeaways-list');
    const duckPondWater = document.getElementById('duck-pond-water');
    const duckPondCount = document.getElementById('duck-pond-count');
    const skipToast = document.getElementById('skip-toast');

    if (PEER_ADVOCATE_URL && PEER_ADVOCATE_URL !== "#") {
      peerAdvocateLink.href = PEER_ADVOCATE_URL;
    } else {
      peerAdvocateLink.style.display = "none";
    }

    function renderPegs() {
      pegsTrack.innerHTML = '';
      for (let i = 0; i < 10; i++) {
        const peg = document.createElement('div');
        peg.className = "flex-1 flex flex-col items-center";

        let bgClass = "bg-[#FFF8ED] border-ink/40";
        let content = `<span class="text-[9px] font-black text-ink/40">${i + 1}</span>`;

        if (i < currentIndex) {
          const item = gameScenarios[i];
          const ans = userAnswers[item.id];
          if (ans) {
            if (ans.chosen === 'green') {
              bgClass = "bg-[#86E0AE] border-ink shadow-[1px_1px_0px_#2B2350]";
              content = `<span class="text-[9px]">🦆</span>`;
            } else if (ans.chosen === 'yellow') {
              bgClass = "bg-[#FFD95A] border-ink shadow-[1px_1px_0px_#2B2350]";
              content = `<span class="text-[9px]">?</span>`;
            } else if (ans.chosen === 'red') {
              bgClass = "bg-[#FF8F80] border-ink shadow-[1px_1px_0px_#2B2350]";
              content = `<span class="text-[9px]">!</span>`;
            } else {
              bgClass = "bg-[#FFE0A8] border-ink";
              content = `<span class="text-[8px] font-bold text-ink">↷</span>`;
            }
          }
        } else if (i === currentIndex) {
          bgClass = "bg-[#4DEBE3] border-ink scale-110 shadow-[1.5px_1.5px_0px_#2B2350]";
          content = `<span class="text-[9px] font-black text-ink">★</span>`;
        }

        peg.innerHTML = `
          <div class="w-5 h-6 rounded-md border-[1.5px] ${bgClass} flex items-center justify-center transition-all">
            ${content}
          </div>
        `;
        pegsTrack.appendChild(peg);
      }
    }

    function showScreen(screen) {
      [screenWelcome, screenPlay, screenFeedback, screenCompletion].forEach(s => s.classList.add('hidden'));
      screen.classList.remove('hidden');

      if (screen === screenWelcome || screen === screenCompletion) {
        headerExitContainer.classList.add('hidden');
      } else {
        headerExitContainer.classList.remove('hidden');
      }

      lucide.createIcons();
    }

    // Results go to the parent hub, which sends anonymous totals; this frame holds no keys.
    function notifyHub(message) {
      if (window.parent !== window) window.parent.postMessage(message, window.location.origin);
    }

    function initGame() {
      notifyHub({ type: "shy:game-start" });
      gameScenarios = shuffle([...rawScenarios]);
      currentIndex = 0;
      cardIsSelected = false;
      userAnswers = {};
      loadScenario(currentIndex);
      showScreen(screenPlay);
    }

    function loadScenario(index) {
      if (index >= gameScenarios.length) {
        showCompletionScreen();
        return;
      }

      const item = gameScenarios[index];
      notifyHub({ type: "shy:game-progress", questionId: item.id });
      progressBadge.innerHTML = `<i class="w-3.5 h-3.5" data-lucide="layers"></i> Card ${index + 1} of 10`;
      scenarioTopicTag.textContent = `SCENARIO #${index + 1}`;
      cardIndexTag.textContent = `CARD ${index + 1}/10`;

      scenarioTitle.textContent = item.title;
      scenarioBody.textContent = item.scenario;

      cardIsSelected = false;
      scenarioCard.classList.remove('ring-4', 'ring-[#4DEBE3]', 'bg-[#FFF8ED]');
      scenarioCard.classList.add('bg-white');
      scenarioCard.style.transform = '';
      scenarioCard.setAttribute('aria-grabbed', 'false');
      selectionIndicator.classList.add('hidden');

      renderPegs();
      lucide.createIcons();
    }

    function toggleCardSelection() {
      cardIsSelected = !cardIsSelected;
      if (cardIsSelected) {
        scenarioCard.classList.add('ring-4', 'ring-[#4DEBE3]', 'bg-[#FFF8ED]');
        scenarioCard.classList.remove('bg-white');
        scenarioCard.setAttribute('aria-grabbed', 'true');
        selectionIndicator.classList.remove('hidden');
      } else {
        scenarioCard.classList.remove('ring-4', 'ring-[#4DEBE3]', 'bg-[#FFF8ED]');
        scenarioCard.classList.add('bg-white');
        scenarioCard.setAttribute('aria-grabbed', 'false');
        selectionIndicator.classList.add('hidden');
      }
    }

    function handleClassification(chosenFlag) {
      if (currentIndex >= gameScenarios.length) return;
      const current = gameScenarios[currentIndex];
      const isCorrect = current.correct === chosenFlag;

      userAnswers[current.id] = {
        chosen: chosenFlag,
        isCorrect: isCorrect
      };

      if (window.onEvent) {
        window.onEvent({
          scenarioId: current.id,
          action: "classified",
          chosen: chosenFlag
        });
      }

      const targetStation = document.getElementById(`station-${chosenFlag}`);
      if (targetStation) {
        targetStation.classList.add('animate-duck-hop');
        setTimeout(() => targetStation.classList.remove('animate-duck-hop'), 600);
      }

      if (isCorrect) {
        triggerDuckRain();
      }

      renderFeedback(current, chosenFlag);
      showScreen(screenFeedback);
    }

    function handleSkip() {
      if (currentIndex >= gameScenarios.length) return;
      const current = gameScenarios[currentIndex];
      userAnswers[current.id] = {
        chosen: 'skipped',
        isCorrect: false
      };

      if (window.onEvent) {
        window.onEvent({
          scenarioId: current.id,
          action: "skipped"
        });
      }

      skipToast.classList.remove('hidden');
      setTimeout(() => {
        skipToast.classList.add('hidden');
      }, 1000);

      currentIndex++;
      if (currentIndex < gameScenarios.length) {
        loadScenario(currentIndex);
      } else {
        showCompletionScreen();
      }
    }

    function renderFeedback(scenario, chosenFlag) {
      feedbackScenarioTitle.textContent = `“${scenario.title}”`;

      let char = 'pip';
      if (scenario.correct === 'yellow') char = 'quill';
      if (scenario.correct === 'red') char = 'barnaby';

      feedbackDuckReactionAvatar.innerHTML = getDuckAvatarSVG(char, 32);

      feedbackFlagPill.className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border-[2px] border-ink text-xs font-black uppercase text-ink shadow-[1px_1px_0px_#2B2350]";

      if (scenario.correct === 'green') {
        feedbackFlagPill.style.backgroundColor = '#86E0AE';
        feedbackFlagIcon.innerHTML = `<i data-lucide="shield-check" class="w-3.5 h-3.5 stroke-[3]"></i>`;
        feedbackFlagLabel.textContent = "Green Flag (Pip)";
      } else if (scenario.correct === 'yellow') {
        feedbackFlagPill.style.backgroundColor = '#FFD95A';
        feedbackFlagIcon.innerHTML = `<i data-lucide="help-circle" class="w-3.5 h-3.5 stroke-[3]"></i>`;
        feedbackFlagLabel.textContent = "Yellow Flag (Quill)";
      } else {
        feedbackFlagPill.style.backgroundColor = '#FF8F80';
        feedbackFlagIcon.innerHTML = `<i data-lucide="alert-octagon" class="w-3.5 h-3.5 stroke-[3]"></i>`;
        feedbackFlagLabel.textContent = "Red Flag (Barnaby)";
      }

      const isCorrect = scenario.correct === chosenFlag;
      if (isCorrect) {
        feedbackMatchStatus.textContent = "✓ Spot on! (Collected)";
        feedbackMatchStatus.className = "text-xs font-black text-ink uppercase px-2.5 py-1 rounded-xl bg-[#86E0AE] border-[2px] border-ink brutal-shadow-sm";
        feedbackWrongBox.classList.add('hidden');
      } else {
        feedbackMatchStatus.textContent = `Sorted to ${chosenFlag} flag`;
        feedbackMatchStatus.className = "text-xs font-black text-ink uppercase px-2.5 py-1 rounded-xl bg-[#FFE0A8] border-[2px] border-ink";
        feedbackWrongBox.classList.remove('hidden');
        const wrongMessage = scenario.ifPickedInstead && scenario.ifPickedInstead[chosenFlag];
        feedbackWrongText.textContent = wrongMessage || "Here is why context and perspective help unpack this situation:";
      }

      feedbackExplanation.textContent = scenario.explanation;
      feedbackTakeaway.textContent = scenario.takeaway;

      if (scenario.branches) {
        yellowForkContainer.classList.remove('hidden');
        forkHealthyText.textContent = scenario.branches.healthy;
        forkConcerningText.textContent = scenario.branches.concerning;
      } else {
        yellowForkContainer.classList.add('hidden');
      }

      lucide.createIcons();
    }

    function showCompletionScreen() {
      const answers = {};
      const skippedQuestionIds = [];
      Object.entries(userAnswers).forEach(([id, ans]) => {
        if (ans.chosen === 'skipped') skippedQuestionIds.push(id);
        else answers[id] = ans.chosen;
      });
      notifyHub({ type: "shy:game-complete", answers, skippedQuestionIds });

      let totalClassified = 0;
      let totalSkipped = 0;
      let correctGreen = 0;
      let totalGreen = 0;
      let correctYellow = 0;
      let totalYellow = 0;
      let correctRed = 0;
      let totalRed = 0;
      let totalCorrect = 0;

      rawScenarios.forEach(sc => {
        if (sc.correct === 'green') totalGreen++;
        if (sc.correct === 'yellow') totalYellow++;
        if (sc.correct === 'red') totalRed++;

        const ans = userAnswers[sc.id];
        if (ans) {
          if (ans.chosen === 'skipped') {
            totalSkipped++;
          } else {
            totalClassified++;
            if (ans.isCorrect) {
              totalCorrect++;
              if (sc.correct === 'green') correctGreen++;
              if (sc.correct === 'yellow') correctYellow++;
              if (sc.correct === 'red') correctRed++;
            }
          }
        }
      });

      yellowHighlightStat.textContent = `You spotted ${correctYellow} of ${totalYellow} “it depends” situations!`;
      duckPondCount.textContent = `${totalCorrect} Happy Duck${totalCorrect === 1 ? '' : 's'}`;
      duckPondWater.innerHTML = '';

      if (totalCorrect === 0) {
        duckPondWater.innerHTML = `
          <div class="flex items-center gap-2 text-xs font-bold text-ink/75 py-1">
            ${getPondSwimmerSVG(28)}
            <span>Pip, Quill, and Barnaby are waiting here happily whenever you want to try again!</span>
          </div>
        `;
      } else {
        for (let i = 0; i < totalCorrect; i++) {
          const duckDiv = document.createElement('div');
          duckDiv.className = 'inline-flex items-center justify-center p-1 rounded-xl bg-white border-[2px] border-ink shadow-[1px_1px_0px_#2B2350] hover:scale-110 transition-transform';
          duckDiv.setAttribute('title', `Pond Duck #${i + 1}`);
          duckDiv.innerHTML = getPondSwimmerSVG(30);
          duckPondWater.appendChild(duckDiv);
        }
      }

      completionStats.innerHTML = `
        <div class="flex justify-between items-center py-1 border-b-[1.5px] border-ink/15">
          <span class="text-ink/80">Cards classified:</span>
          <span class="font-black bg-white px-2 py-0.5 rounded-lg border border-ink">${totalClassified} of ${rawScenarios.length}</span>
        </div>
        ${totalSkipped > 0 ? `
          <div class="flex justify-between items-center py-1 border-b-[1.5px] border-ink/15">
            <span class="text-ink/80">Cards skipped:</span>
            <span class="font-black bg-[#FFE0A8] px-2 py-0.5 rounded-lg border border-ink">${totalSkipped}</span>
          </div>
        ` : ''}
        <div class="flex justify-between items-center py-1 border-b-[1.5px] border-ink/15">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-md bg-[#86E0AE] border border-ink inline-block"></span>
            Green flags:
          </span>
          <span class="font-black">You spotted ${correctGreen} of ${totalGreen} healthy signs</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b-[1.5px] border-ink/15">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-md bg-[#FFD95A] border border-dashed border-ink inline-block"></span>
            Yellow flags:
          </span>
          <span class="font-black">You spotted ${correctYellow} of ${totalYellow} “it depends” situations</span>
        </div>
        <div class="flex justify-between items-center py-1">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-3 rounded-md bg-[#FF8F80] border border-ink inline-block"></span>
            Red flags:
          </span>
          <span class="font-black">You spotted ${correctRed} of ${totalRed} boundary concerns</span>
        </div>
      `;

      takeawaysList.innerHTML = rawScenarios.map((sc, i) => {
        let badgeColor = "#86E0AE";
        let badgeText = "Green Flag";
        if (sc.correct === 'yellow') {
          badgeColor = "#FFD95A";
          badgeText = "Yellow Flag";
        } else if (sc.correct === 'red') {
          badgeColor = "#FF8F80";
          badgeText = "Red Flag";
        }

        return `
          <div class="p-3 rounded-2xl bg-[#FFF8ED] border-[2px] border-ink text-xs brutal-shadow-sm flex items-start gap-2.5">
            <div class="w-6 h-6 rounded-lg border border-ink flex items-center justify-center font-black text-[10px] shrink-0" style="background-color: ${badgeColor};">
              #${i + 1}
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-1 mb-0.5">
                <span class="font-black text-ink uppercase tracking-wide text-[11px]">${sc.title}</span>
                <span class="text-[9px] font-black px-1.5 py-0.2 rounded border border-ink uppercase" style="background-color: ${badgeColor};">${badgeText}</span>
              </div>
              <span class="font-bold text-ink/85 leading-snug block">${sc.takeaway}</span>
            </div>
          </div>
        `;
      }).join('');

      showScreen(screenCompletion);
    }

    // -------------------------------------------------------------
    // Drag & Drop & Direct Click Logic
    // -------------------------------------------------------------
    const dropzones = document.querySelectorAll('.dropzone');

    function checkDropCollision(x, y) {
      for (const zone of dropzones) {
        const rect = zone.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return zone.getAttribute('data-flag');
        }
      }
      return null;
    }

    // HTML5 Drag and Drop handlers on card
    scenarioCard.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', 'duck-card');
      e.dataTransfer.effectAllowed = 'move';
      scenarioCard.classList.add('card-dragging');
    });

    scenarioCard.addEventListener('dragend', () => {
      scenarioCard.classList.remove('card-dragging');
      dropzones.forEach(z => z.classList.remove('drop-target-active'));
    });

    // Dropzone listeners for HTML5 drag-and-drop & clicks
    dropzones.forEach(zone => {
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drop-target-active');
      });

      zone.addEventListener('dragenter', (e) => {
        e.preventDefault();
        zone.classList.add('drop-target-active');
      });

      zone.addEventListener('dragleave', (e) => {
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('drop-target-active');
        }
      });

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drop-target-active');
        const flag = zone.getAttribute('data-flag');
        if (flag) {
          handleClassification(flag);
        }
      });

      // Clicking anywhere on the drop zone container evaluates answer
      zone.addEventListener('click', (e) => {
        // Clicks anywhere on the station (including its button) classify the card.
        {
          const flag = zone.getAttribute('data-flag');
          if (flag) {
            handleClassification(flag);
          }
        }
      });
    });

    // Touch and Pointer Drag Support for smooth cross-device action
    let activePointerId = null;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    scenarioCard.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      activePointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      isDragging = false;

      function onPointerMove(moveEvent) {
        if (moveEvent.pointerId !== activePointerId) return;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        if (!isDragging && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
          isDragging = true;
          scenarioCard.classList.add('card-dragging');
        }

        if (isDragging) {
          scenarioCard.style.setProperty('--drag-x', `${dx}px`);
          scenarioCard.style.setProperty('--drag-y', `${dy}px`);
          const hoveredFlag = checkDropCollision(moveEvent.clientX, moveEvent.clientY);
          dropzones.forEach(z => {
            if (z.getAttribute('data-flag') === hoveredFlag) {
              z.classList.add('drop-target-active');
            } else {
              z.classList.remove('drop-target-active');
            }
          });
        }
      }

      function onPointerUp(upEvent) {
        if (upEvent.pointerId !== activePointerId) return;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
        window.removeEventListener('pointercancel', onPointerUp);

        scenarioCard.style.removeProperty('--drag-x');
        scenarioCard.style.removeProperty('--drag-y');
        scenarioCard.classList.remove('card-dragging');
        dropzones.forEach(z => z.classList.remove('drop-target-active'));

        if (isDragging) {
          isDragging = false;
          const droppedFlag = checkDropCollision(upEvent.clientX, upEvent.clientY);
          if (droppedFlag) {
            handleClassification(droppedFlag);
          }
        } else {
          toggleCardSelection();
        }
        activePointerId = null;
      }

      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);
    });

    scenarioCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardSelection();
      }
    });

    // -------------------------------------------------------------
    // Button Event Listeners
    // -------------------------------------------------------------
    btnStart.addEventListener('click', initGame);
    btnRestart.addEventListener('click', initGame);

    btnExit.addEventListener('click', () => {
      const current = gameScenarios[currentIndex];
      if (current) notifyHub({ type: "shy:game-exit", questionId: current.id });
      showScreen(screenWelcome);
    });

    btnSkip.addEventListener('click', handleSkip);

    btnContinue.addEventListener('click', () => {
      currentIndex++;
      if (currentIndex < gameScenarios.length) {
        loadScenario(currentIndex);
        showScreen(screenPlay);
      } else {
        showCompletionScreen();
      }
    });

    // Start in game play mode by default
    initGame();
