
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Chass Tag Parkour - Compteur EPS</title>
    <meta name="theme-color" content="#1a1a2e">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Chass Tag Parkour">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        html, body {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
        }

        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            background-attachment: fixed;
            min-height: 100vh;
            padding: 10px;
            position: relative;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                repeating-linear-gradient(
                    90deg,
                    rgba(255, 215, 0, 0.03) 0px,
                    rgba(255, 215, 0, 0.03) 2px,
                    transparent 2px,
                    transparent 4px
                );
            pointer-events: none;
            z-index: 1;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
            width: 100%;
        }

        .header {
            text-align: center;
            color: #ffd700;
            margin-bottom: 20px;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
        }

        .header h1 {
            font-size: clamp(1.5em, 8vw, 3.5em);
            margin-bottom: 10px;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        .header p {
            font-size: clamp(0.9em, 4vw, 1.2em);
            color: #00d4ff;
        }

        .config-section {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: clamp(15px, 5vw, 25px);
            margin-bottom: 20px;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), inset 0 0 10px rgba(0, 212, 255, 0.1);
        }

        .config-section h2 {
            color: #ffd700;
            margin-bottom: 20px;
            border-bottom: 2px solid #00d4ff;
            padding-bottom: 12px;
            font-size: clamp(1.2em, 5vw, 1.5em);
            text-transform: uppercase;
        }

        .config-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 15px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-weight: bold;
            color: #00d4ff;
            margin-bottom: 8px;
            font-size: clamp(0.8em, 3vw, 0.95em);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .form-group input,
        .form-group select {
            padding: clamp(10px, 3vw, 12px);
            border: 2px solid #ffd700;
            border-radius: 8px;
            font-size: clamp(0.9em, 3vw, 1em);
            background: rgba(255, 255, 255, 0.95);
            color: #1a1a2e;
            transition: all 0.3s;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #00d4ff;
            box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
            background: white;
        }

        .team-config {
            background: rgba(20, 20, 40, 0.8);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            border: 2px solid #333;
        }

        .team-config h3 {
            color: white;
            padding: 10px 12px;
            border-radius: 5px;
            margin-bottom: 12px;
            font-size: clamp(1em, 4vw, 1.2em);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .team-1 h3 {
            background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
            box-shadow: 0 4px 8px rgba(255, 71, 87, 0.3);
        }

        .team-2 h3 {
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            box-shadow: 0 4px 8px rgba(0, 212, 255, 0.3);
        }

        .team-name-input {
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
            align-items: center;
            flex-wrap: wrap;
        }

        .team-name-input input {
            flex: 1;
            min-width: 120px;
            padding: 10px;
            border: 2px solid #ffd700;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.95);
            color: #1a1a2e;
            font-weight: bold;
            font-size: clamp(0.9em, 3vw, 1em);
        }

        .team-name-input label {
            color: #00d4ff;
            font-weight: bold;
            font-size: clamp(0.8em, 3vw, 0.95em);
            white-space: nowrap;
        }

        .players-input {
            background: rgba(255, 255, 255, 0.9);
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
        }

        .player-input-row {
            display: flex;
            gap: 10px;
            margin-bottom: 8px;
            align-items: center;
            font-size: clamp(0.85em, 3vw, 0.95em);
        }

        .player-input-row input {
            flex: 1;
            min-width: 80px;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: clamp(0.85em, 3vw, 0.9em);
        }

        .player-input-row span {
            color: #666;
            min-width: 40px;
            font-weight: bold;
        }

        .button-group {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }

        button {
            padding: clamp(12px, 3vw, 14px) clamp(20px, 4vw, 28px);
            border: none;
            border-radius: 8px;
            font-size: clamp(0.85em, 3vw, 1em);
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            min-height: 44px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #1a1a2e;
            flex: 1;
            min-width: 120px;
        }

        .btn-primary:active {
            transform: scale(0.98);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
            color: white;
        }

        .btn-warning {
            background: linear-gradient(135deg, #ffa502 0%, #ff8c00 100%);
            color: white;
        }

        .btn-danger {
            background: #555;
            color: white;
            padding: 8px 16px;
            font-size: clamp(0.75em, 3vw, 0.9em);
        }

        .game-section {
            display: none;
        }

        .game-section.active {
            display: block;
        }

        .game-header {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: clamp(15px, 5vw, 20px);
            margin-bottom: 20px;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }

        .manche-info {
            text-align: center;
            color: #ffd700;
            font-size: clamp(1.2em, 5vw, 1.5em);
            font-weight: bold;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .mode-info {
            text-align: center;
            color: #00d4ff;
            font-size: clamp(0.95em, 4vw, 1.2em);
            margin-bottom: 15px;
            padding: 12px;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 8px;
            border: 1px solid #00d4ff;
            text-transform: uppercase;
        }

        .scores-display {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
            text-align: center;
        }

        .score-box {
            padding: clamp(15px, 4vw, 20px);
            border-radius: 10px;
            color: white;
            font-size: clamp(1.5em, 5vw, 2em);
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .team-1-score {
            background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
            box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
        }

        .team-2-score {
            background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
            box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        }

        .current-match {
            text-align: center;
            font-size: clamp(1em, 4vw, 1.3em);
            color: #ffd700;
            padding: 15px;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 8px;
            margin-bottom: 15px;
            border: 2px solid #ffd700;
            text-transform: uppercase;
            word-break: break-word;
        }

        .match-progress {
            text-align: center;
            font-size: clamp(0.85em, 3vw, 1em);
            color: #00d4ff;
            padding: 10px;
            background: rgba(0, 212, 255, 0.1);
            border-radius: 8px;
            margin-bottom: 15px;
            border: 1px solid #00d4ff;
        }

        .timer-section {
            text-align: center;
            background: linear-gradient(135deg, #000000 0%, #1a1a2e 100%);
            color: #ffd700;
            padding: clamp(20px, 5vw, 30px);
            border-radius: 15px;
            margin-bottom: 20px;
            border: 3px solid #ffd700;
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
        }

        .timer-section > div:first-child {
            font-size: clamp(1em, 4vw, 1.3em);
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .timer-display {
            font-size: clamp(3em, 15vw, 5em);
            font-weight: bold;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
            color: #ffd700;
            text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
        }

        .timer-controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn-timer {
            padding: clamp(12px, 3vw, 15px) clamp(15px, 4vw, 30px);
            font-size: clamp(0.8em, 3vw, 1.1em);
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #1a1a2e;
            font-weight: bold;
            min-height: 44px;
        }

        .btn-timer.stop {
            background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
            color: white;
        }

        .game-board {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .team-board {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
            border-radius: 15px;
            padding: clamp(15px, 4vw, 20px);
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }

        .team-1 {
            border-top: 5px solid #ff4757;
        }

        .team-2 {
            border-top: 5px solid #00d4ff;
        }

        .team-title {
            font-size: clamp(1.3em, 5vw, 1.8em);
            font-weight: bold;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            text-transform: uppercase;
            letter-spacing: 1px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .team-1 .team-title {
            color: #ff4757;
        }

        .team-2 .team-title {
            color: #00d4ff;
        }

        .role-badge {
            font-size: clamp(0.6em, 2vw, 0.7em);
            padding: 6px 12px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            text-transform: uppercase;
            white-space: nowrap;
        }

        .chat-badge {
            background: linear-gradient(135deg, #ff4757 0%, #ee5a6f 100%);
        }

        .souris-badge {
            background: linear-gradient(135deg, #2ed573 0%, #26de81 100%);
        }

        .players-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .player-button {
            padding: clamp(10px, 3vw, 12px);
            border: 2px solid #333;
            background: rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            cursor: pointer;
            font-size: clamp(0.85em, 3vw, 1em);
            transition: all 0.3s;
            text-align: left;
            color: white;
            min-height: 44px;
        }

        .team-1 .player-button {
            border-color: #ff4757;
        }

        .team-1 .player-button:hover:not(.disabled):not(.played),
        .team-1 .player-button:active:not(.disabled):not(.played) {
            background: rgba(255, 71, 87, 0.3);
            border-color: #ff4757;
            transform: translateX(5px);
        }

        .team-2 .player-button {
            border-color: #00d4ff;
        }

        .team-2 .player-button:hover:not(.disabled):not(.played),
        .team-2 .player-button:active:not(.disabled):not(.played) {
            background: rgba(0, 212, 255, 0.3);
            border-color: #00d4ff;
            transform: translateX(5px);
        }

        .player-button.disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .player-button.played {
            opacity: 0.5;
            background: rgba(100, 100, 100, 0.3);
            border-color: #666;
            cursor: not-allowed;
        }

        .player-name {
            font-weight: bold;
            font-size: clamp(0.95em, 3vw, 1.1em);
            margin-bottom: 3px;
            color: white;
        }

        .player-stats {
            font-size: clamp(0.75em, 2vw, 0.85em);
            color: #aaa;
        }

        .stats-section {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: clamp(15px, 5vw, 25px);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            margin-bottom: 20px;
            display: none;
        }

        .stats-section.active {
            display: block;
        }

        .stats-section h2 {
            color: #ffd700;
            margin-bottom: 20px;
            border-bottom: 2px solid #00d4ff;
            padding-bottom: 12px;
            font-size: clamp(1.2em, 5vw, 1.5em);
            text-transform: uppercase;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }

        .player-stat-card {
            background: rgba(255, 255, 255, 0.08);
            border-left: 4px solid;
            padding: clamp(12px, 3vw, 15px);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .team-1 .player-stat-card {
            border-left-color: #ff4757;
        }

        .team-2 .player-stat-card {
            border-left-color: #00d4ff;
        }

        .stat-name {
            font-weight: bold;
            font-size: clamp(0.95em, 3vw, 1.1em);
            margin-bottom: 10px;
            color: #ffd700;
            text-transform: uppercase;
        }

        .stat-line {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: clamp(0.85em, 2vw, 0.95em);
            color: #ccc;
        }

        .stat-value {
            font-weight: bold;
            color: #00d4ff;
        }

        .ranking-section {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
            border: 2px solid #00d4ff;
            border-radius: 15px;
            padding: clamp(15px, 5vw, 25px);
            box-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
            margin-bottom: 20px;
            display: none;
        }

        .ranking-section.active {
            display: block;
        }

        .ranking-section h2 {
            color: #00d4ff;
            margin-bottom: 20px;
            border-bottom: 2px solid #ffd700;
            padding-bottom: 12px;
            font-size: clamp(1.2em, 5vw, 1.5em);
            text-transform: uppercase;
        }

        .ranking-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }

        .ranking-card {
            background: rgba(255, 255, 255, 0.08);
            border: 2px solid;
            border-radius: 10px;
            padding: 15px;
        }

        .ranking-card h3 {
            color: #ffd700;
            margin-bottom: 15px;
            font-size: clamp(1em, 4vw, 1.2em);
            text-transform: uppercase;
            text-align: center;
        }

        .ranking-list {
            list-style: none;
        }

        .ranking-list li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 5px;
            color: white;
            font-size: clamp(0.85em, 2vw, 0.95em);
        }

        .ranking-position {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .ranking-medal {
            font-size: clamp(1.2em, 4vw, 1.5em);
            min-width: 30px;
        }

        .ranking-name {
            color: #00d4ff;
            font-weight: bold;
        }

        .ranking-time {
            color: #ffd700;
            font-weight: bold;
        }

        .results-section {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: clamp(15px, 5vw, 25px);
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            margin-bottom: 20px;
            display: none;
        }

        .results-section.active {
            display: block;
        }

        .results-section h2 {
            color: #ffd700;
            margin-bottom: 20px;
            border-bottom: 2px solid #00d4ff;
            padding-bottom: 12px;
            font-size: clamp(1.5em, 6vw, 2em);
            text-transform: uppercase;
            text-align: center;
        }

        .results-content {
            background: rgba(0, 212, 255, 0.1);
            padding: clamp(15px, 4vw, 20px);
            border-radius: 8px;
            border: 2px solid #00d4ff;
            color: #ccc;
            font-size: clamp(1em, 3vw, 1.2em);
            text-align: center;
            line-height: 1.8;
        }

        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.8);
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .modal-content {
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 40, 0.98) 100%);
            padding: clamp(20px, 5vw, 40px);
            border-radius: 15px;
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
            max-width: 600px;
            width: 100%;
            text-align: center;
            max-height: 90vh;
            overflow-y: auto;
            border: 2px solid #ffd700;
        }

        .modal h2 {
            color: #ffd700;
            margin-bottom: 20px;
            font-size: clamp(1.5em, 5vw, 2em);
            text-transform: uppercase;
        }

        .modal-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .view-toggle {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .view-btn {
            padding: clamp(10px, 3vw, 12px) clamp(15px, 4vw, 20px);
            border: 2px solid #ffd700;
            background: rgba(255, 215, 0, 0.1);
            color: #ffd700;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            text-transform: uppercase;
            font-size: clamp(0.8em, 2vw, 0.95em);
            transition: all 0.3s;
            min-height: 44px;
        }

        .view-btn.active {
            background: #ffd700;
            color: #1a1a2e;
        }

        @media (max-width: 768px) {
            .game-board {
                grid-template-columns: 1fr;
                gap: 10px;
            }

            .config-row {
                grid-template-columns: 1fr;
            }

            .team-title {
                flex-direction: column;
                align-items: flex-start;
            }

            .role-badge {
                margin-top: 8px;
            }

            .scores-display {
                grid-template-columns: 1fr;
                gap: 10px;
            }

            .ranking-grid,
            .stats-grid {
                grid-template-columns: 1fr;
            }

            .modal-content {
                margin: 0 10px;
            }
        }

        @supports (padding: max(0px)) {
            body {
                padding-left: max(10px, env(safe-area-inset-left));
                padding-right: max(10px, env(safe-area-inset-right));
                padding-top: max(10px, env(safe-area-inset-top));
                padding-bottom: max(10px, env(safe-area-inset-bottom));
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏃‍♂️ CHASS TAG PARKOUR 🏃‍♀️</h1>
            <p>🌃 Urban Challenge - Jeu d'EPS</p>
        </div>

        <!-- CONFIG SECTION -->
        <div class="config-section" id="configSection">
            <h2>⚙️ Configuration</h2>

            <div class="config-row">
                <div class="form-group">
                    <label for="matchFormat">Format de jeu :</label>
                    <select id="matchFormat" onchange="updatePlayerInputs()">
                        <option value="1v1">1 contre 1</option>
                        <option value="2v2">2 contre 2</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="nbManches">Nombre de manches :</label>
                    <input type="number" id="nbManches" min="1" max="20" value="3">
                </div>
                <div class="form-group">
                    <label for="mancheDuration">Durée affrontement (sec) :</label>
                    <input type="range" id="mancheDuration" min="10" max="30" value="20">
                    <div style="text-align: center; color: #ffd700; font-weight: bold; margin-top: 5px;">
                        <span id="durationDisplay">20</span>s
                    </div>
                </div>
            </div>

            <div class="config-row">
                <div class="form-group">
                    <label for="gameMode">Mode de jeu :</label>
                    <select id="gameMode">
                        <option value="random">🎲 Aléatoire</option>
                        <option value="challenge">🎯 Défi (Ordre)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="roleMode">Rôles :</label>
                    <select id="roleMode">
                        <option value="fixed">🔒 Fixe par manche</option>
                        <option value="alternate">🔄 Alternance</option>
                    </select>
                </div>
            </div>

            <div class="team-config team-1">
                <h3>🔴 ÉQUIPE 1</h3>
                <div class="team-name-input">
                    <label for="team1Name">Nom :</label>
                    <input type="text" id="team1Name" placeholder="Équipe 1" value="Équipe 1">
                </div>
                <div class="players-input" id="team1Players"></div>
            </div>

            <div class="team-config team-2">
                <h3>🔵 ÉQUIPE 2</h3>
                <div class="team-name-input">
                    <label for="team2Name">Nom :</label>
                    <input type="text" id="team2Name" placeholder="Équipe 2" value="Équipe 2">
                </div>
                <div class="players-input" id="team2Players"></div>
            </div>

            <div class="button-group">
                <button class="btn-primary" onclick="addPlayerRow(1)">+ Équipe 1</button>
                <button class="btn-primary" onclick="addPlayerRow(2)">+ Équipe 2</button>
            </div>

            <div class="button-group" style="margin-top: 20px;">
                <button class="btn-primary" onclick="startGame()" style="background: linear-gradient(135deg, #2ed573 0%, #26de81 100%); font-size: clamp(1em, 4vw, 1.3em);">
                    ▶️ DÉMARRER
                </button>
            </div>
        </div>

        <!-- GAME SECTION -->
        <div class="game-section" id="gameSection">
            <div class="game-header">
                <div class="manche-info">
                    Manche <span id="mancheCounter">1</span> / <span id="mancheTotal">3</span>
                </div>
                <div class="mode-info" id="modeDisplay"></div>
                
                <div class="scores-display">
                    <div class="score-box team-1-score">
                        <span id="team1DisplayName">Équipe 1</span><br>
                        <span id="team1Score">0</span>
                    </div>
                    <div class="score-box team-2-score">
                        <span id="team2DisplayName">Équipe 2</span><br>
                        <span id="team2Score">0</span>
                    </div>
                </div>

                <div class="match-progress" id="matchProgress"></div>
                <div class="current-match" id="currentMatch"></div>
            </div>

            <div class="timer-section">
                <div>⏱️ Temps restant</div>
                <div class="timer-display" id="timerDisplay">00:20</div>
                <div class="timer-controls">
                    <button class="btn-timer" id="btnStartTimer" onclick="toggleTimer()">▶️ DÉMARRER</button>
                    <button class="btn-timer stop" id="btnStopTimer" onclick="stopTimer()" style="display:none;">⏹️ ARRÊTER</button>
                    <button class="btn-timer" onclick="resetTimer()">🔄 RESET</button>
                </div>
            </div>

            <div class="game-board">
                <div class="team-board team-1">
                    <div class="team-title">
                        <span id="team1TitleName">Équipe 1</span>
                        <span class="role-badge chat-badge" id="team1Role">CHAT</span>
                    </div>
                    <div class="players-list" id="team1GamePlayers"></div>
                </div>

                <div class="team-board team-2">
                    <div class="team-title">
                        <span id="team2TitleName">Équipe 2</span>
                        <span class="role-badge souris-badge" id="team2Role">SOURIS</span>
                    </div>
                    <div class="players-list" id="team2GamePlayers"></div>
                </div>
            </div>

            <div class="button-group">
                <button class="btn-primary" onclick="nextMatch()" style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #1a1a2e;">
                    ▶️ AFFRONTEMENT SUIVANT
                </button>
                <button class="btn-warning" onclick="undoLastTouch()" style="display:none;" id="btnUndo">
                    ↩️ ANNULER
                </button>
                <button class="btn-secondary" onclick="endManche()">🏁 FIN MANCHE</button>
            </div>

            <!-- VIEW TOGGLE BUTTONS -->
            <div class="view-toggle">
                <button class="view-btn active" onclick="showStats()">📊 Statistiques</button>
                <button class="view-btn" onclick="showRankings()">🏆 Classements</button>
                <button class="view-btn" onclick="showResults()">🏁 Résultats</button>
            </div>

            <!-- STATS SECTION -->
            <div class="stats-section active" id="statsSection">
                <h2>📊 Statistiques Individuelles</h2>
                <div class="stats-grid" id="statsGrid"></div>
            </div>

            <!-- RANKINGS SECTION -->
            <div class="ranking-section" id="rankingSection">
                <h2>🏆 Classements</h2>
                <div class="ranking-grid" id="rankingGrid"></div>
            </div>

            <!-- RESULTS SECTION -->
            <div class="results-section" id="resultsSection">
                <h2>🏁 RÉSULTATS FINAUX</h2>
                <div class="results-content" id="resultsContent"></div>
            </div>

            <div class="button-group">
                <button class="btn-secondary" onclick="backToConfig()">← RETOUR CONFIG</button>
            </div>
        </div>
    </div>

    <script>
        // Service Worker pour fonctionnement hors ligne
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('data:application/javascript;base64,CnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCBmdW5jdGlvbihldmVudCkgewogIGV2ZW50LnJlc3BvbmRXaXRoKGZldGNoKGV2ZW50LnJlcXVlc3QpLmNhdGNoKGZ1bmN0aW9uKCkgewogICAgcmV0dXJuIG5ldyBSZXNwb25zZSgnQ2FjaGUnKTsKICB9KSk7Cn0pOw==').catch(() => {});
        }

        // Son de fin
        function playEndSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch(e) {}
        }

        let gameData = {
            config: {
                matchFormat: '1v1',
                nbManches: 3,
                mancheDuration: 20,
                gameMode: 'random',
                roleMode: 'fixed'
            },
            teams: {
                1: { name: 'Équipe 1', players: [], score: 0, playedPlayers: [] },
                2: { name: 'Équipe 2', players: [], score: 0, playedPlayers: [] }
            },
            currentManche: 1,
            currentMatch: null,
            currentMatchTouches: 0,
            lastTouch: null,
            timer: {
                timeLeft: 0,
                isRunning: false,
                interval: null
            }
        };

        document.getElementById('matchFormat').addEventListener('change', (e) => {
            gameData.config.matchFormat = e.target.value;
            updatePlayerInputs();
        });

        document.getElementById('mancheDuration').addEventListener('input', (e) => {
            gameData.config.mancheDuration = parseInt(e.target.value);
            document.getElementById('durationDisplay').textContent = e.target.value;
        });

        document.getElementById('nbManches').addEventListener('input', (e) => {
            gameData.config.nbManches = parseInt(e.target.value);
        });

        document.getElementById('gameMode').addEventListener('change', (e) => {
            gameData.config.gameMode = e.target.value;
        });

        document.getElementById('roleMode').addEventListener('change', (e) => {
            gameData.config.roleMode = e.target.value;
        });

        function updatePlayerInputs() {
            const format = gameData.config.matchFormat;
            const requiredPlayers = format === '1v1' ? 1 : 2;

            document.getElementById('team1Players').innerHTML = '';
            document.getElementById('team2Players').innerHTML = '';

            for (let i = 0; i < requiredPlayers; i++) {
                addPlayerRow(1);
                addPlayerRow(2);
            }
        }

        function addPlayerRow(teamId) {
            const container = document.getElementById(`team${teamId}Players`);
            const playerCount = container.children.length + 1;
            
            const row = document.createElement('div');
            row.className = 'player-input-row';
            row.innerHTML = `
                <span>#${playerCount}</span>
                <input type="text" placeholder="Prénom" class="player-prenom">
                <button class="btn-danger" onclick="this.parentElement.remove()">✕</button>
            `;
            container.appendChild(row);
        }

        updatePlayerInputs();

        function startGame() {
            gameData.teams[1].name = document.getElementById('team1Name').value || 'Équipe 1';
            gameData.teams[2].name = document.getElementById('team2Name').value || 'Équipe 2';

            gameData.teams[1].players = getPlayersFromInput(1);
            gameData.teams[2].players = getPlayersFromInput(2);

            if (gameData.teams[1].players.length === 0 || gameData.teams[2].players.length === 0) {
                alert('Veuillez ajouter au moins un joueur par équipe !');
                return;
            }

            initializeStats();
            document.getElementById('configSection').style.display = 'none';
            document.getElementById('gameSection').classList.add('active');

            document.getElementById('team1DisplayName').textContent = gameData.teams[1].name;
            document.getElementById('team2DisplayName').textContent = gameData.teams[2].name;
            document.getElementById('team1TitleName').textContent = gameData.teams[1].name;
            document.getElementById('team2TitleName').textContent = gameData.teams[2].name;

            startNewManche();
        }

        function getPlayersFromInput(teamId) {
            const container = document.getElementById(`team${teamId}Players`);
            const players = [];
            
            container.querySelectorAll('.player-input-row').forEach((row, index) => {
                const prenom = row.querySelector('.player-prenom').value.trim();
                
                if (prenom) {
                    players.push({
                        id: index,
                        prenom: prenom,
                        role: null,
                        totalPoints: 0,
                        timeInAttack: 0,
                        timeInDefense: 0,
                        manches: {}
                    });
                }
            });
            
            return players;
        }

        function initializeStats() {
            [1, 2].forEach(teamId => {
                gameData.teams[teamId].score = 0;
                gameData.teams[teamId].playedPlayers = [];
                gameData.teams[teamId].players.forEach(player => {
                    player.totalPoints = 0;
                    player.timeInAttack = 0;
                    player.timeInDefense = 0;
                    player.manches = {};
                });
            });
        }

        function startNewManche() {
            gameData.currentManche = 1;
            gameData.teams[1].playedPlayers = [];
            gameData.teams[2].playedPlayers = [];
            gameData.lastTouch = null;
            
            assignRoles();
            selectNextMatch();
            updateGameDisplay();
            resetTimer();
        }

        function assignRoles() {
            const mancheIndex = gameData.currentManche - 1;
            let isTeam1Chat;

            if (gameData.config.roleMode === 'fixed') {
                isTeam1Chat = mancheIndex % 2 === 0;
            } else {
                if (gameData.config.nbManches % 2 === 1) {
                    isTeam1Chat = mancheIndex % 2 === 0;
                } else {
                    isTeam1Chat = mancheIndex % 2 === 0;
                }
            }

            gameData.teams[1].players.forEach(p => {
                p.role = isTeam1Chat ? 'chat' : 'souris';
            });
            gameData.teams[2].players.forEach(p => {
                p.role = isTeam1Chat ? 'souris' : 'chat';
            });
        }

        function selectNextMatch() {
            if (gameData.config.gameMode === 'random') {
                selectRandomMatch();
            } else {
                selectChallengeMatch();
            }
        }

        function selectRandomMatch() {
            const availablePlayers1 = gameData.teams[1].players.filter(p => !gameData.teams[1].playedPlayers.includes(p.id));
            const availablePlayers2 = gameData.teams[2].players.filter(p => !gameData.teams[2].playedPlayers.includes(p.id));

            if (availablePlayers1.length === 0 || availablePlayers2.length === 0) {
                endManche();
                return;
            }

            const player1 = availablePlayers1[Math.floor(Math.random() * availablePlayers1.length)];
            const player2 = availablePlayers2[Math.floor(Math.random() * availablePlayers2.length)];
            
            gameData.currentMatch = {
                team1Player: player1,
                team2Player: player2
            };

            gameData.currentMatchTouches = 0;
            gameData.lastTouch = null;
            gameData.teams[1].playedPlayers.push(player1.id);
            gameData.teams[2].playedPlayers.push(player2.id);
        }

        function selectChallengeMatch() {
            const availablePlayers1 = gameData.teams[1].players.filter(p => !gameData.teams[1].playedPlayers.includes(p.id));
            const availablePlayers2 = gameData.teams[2].players.filter(p => !gameData.teams[2].playedPlayers.includes(p.id));

            if (availablePlayers1.length === 0 || availablePlayers2.length === 0) {
                endManche();
                return;
            }

            const player1 = availablePlayers1[0];
            const player2 = availablePlayers2[0];
            
            gameData.currentMatch = {
                team1Player: player1,
                team2Player: player2
            };

            gameData.currentMatchTouches = 0;
            gameData.lastTouch = null;
            gameData.teams[1].playedPlayers.push(player1.id);
            gameData.teams[2].playedPlayers.push(player2.id);
        }

        function updateGameDisplay() {
            document.getElementById('mancheCounter').textContent = gameData.currentManche;
            document.getElementById('mancheTotal').textContent = gameData.config.nbManches;

            const modeText = gameData.config.gameMode === 'random' 
                ? '🎲 Aléatoire' 
                : '🎯 Défi';
            document.getElementById('modeDisplay').textContent = modeText;

            document.getElementById('team1Score').textContent = gameData.teams[1].score;
            document.getElementById('team2Score').textContent = gameData.teams[2].score;

            const progress1 = gameData.teams[1].playedPlayers.length;
            const progress2 = gameData.teams[2].playedPlayers.length;
            const total1 = gameData.teams[1].players.length;
            const total2 = gameData.teams[2].players.length;
            document.getElementById('matchProgress').innerHTML = `
                Affrontement ${progress1}/${total1} (${gameData.teams[1].name}) vs ${progress2}/${total2} (${gameData.teams[2].name})
            `;

            if (gameData.currentMatch) {
                const p1 = gameData.currentMatch.team1Player;
                const p2 = gameData.currentMatch.team2Player;
                const roleTeam1 = gameData.teams[1].players[0].role.toUpperCase();
                const roleTeam2 = gameData.teams[2].players[0].role.toUpperCase();

                document.getElementById('currentMatch').innerHTML = `
                    <strong>#${p1.id + 1} ${p1.prenom}</strong> (${roleTeam1})
                    vs
                    <strong>#${p2.id + 1} ${p2.prenom}</strong> (${roleTeam2})
                `;

                document.getElementById('team1Role').textContent = roleTeam1;
                document.getElementById('team1Role').className = roleTeam1 === 'CHAT' ? 'role-badge chat-badge' : 'role-badge souris-badge';

                document.getElementById('team2Role').textContent = roleTeam2;
                document.getElementById('team2Role').className = roleTeam2 === 'CHAT' ? 'role-badge chat-badge' : 'role-badge souris-badge';
            }

            document.getElementById('btnUndo').style.display = gameData.lastTouch ? 'block' : 'none';

            updatePlayersDisplay();
            updateStats();
            updateRankings();
            updateResults();
        }

        function updatePlayersDisplay() {
            updateTeamDisplay(1);
            updateTeamDisplay(2);
        }

        function updateTeamDisplay(teamId) {
            const container = document.getElementById(`team${teamId}GamePlayers`);
            container.innerHTML = '';

            gameData.teams[teamId].players.forEach(player => {
                const btn = document.createElement('button');
                btn.className = 'player-button';
                
                const isInMatch = (player === gameData.currentMatch.team1Player && teamId === 1) ||
                                  (player === gameData.currentMatch.team2Player && teamId === 2);
                
                const hasPlayed = gameData.teams[teamId].playedPlayers.includes(player.id);

                btn.innerHTML = `
                    <div class="player-name">#${player.id + 1} ${player.prenom}</div>
                    <div class="player-stats">
                        Points: ${player.totalPoints}
                    </div>
                `;

                if (isInMatch) {
                    btn.onclick = () => markPlayerTouched(teamId, player);
                } else if (hasPlayed) {
                    btn.classList.add('played');
                    btn.disabled = true;
                } else {
                    btn.classList.add('disabled');
                    btn.disabled = true;
                }

                container.appendChild(btn);
            });
        }

        function markPlayerTouched(teamId, player) {
            const maxTouches = gameData.config.matchFormat === '1v1' ? 1 : 2;

            if (gameData.currentMatchTouches >= maxTouches) {
                alert(`⚠️ Max ${maxTouches} touche(s) !`);
                return;
            }

            const otherTeamId = teamId === 1 ? 2 : 1;
            const otherPlayer = teamId === 1 ? gameData.currentMatch.team2Player : gameData.currentMatch.team1Player;

            if (player.role === 'chat') {
                const timeUsed = gameData.config.mancheDuration - gameData.timer.timeLeft;
                
                player.totalPoints++;
                otherPlayer.totalPoints++;
                
                gameData.teams[teamId].score++;
                gameData.currentMatchTouches++;

                player.timeInAttack += timeUsed;
                otherPlayer.timeInDefense += timeUsed;

                gameData.lastTouch = {
                    teamId: teamId,
                    player: player,
                    otherPlayer: otherPlayer,
                    timeUsed: timeUsed
                };

                if (!player.manches[gameData.currentManche]) {
                    player.manches[gameData.currentManche] = { points: 0 };
                }
                player.manches[gameData.currentManche].points++;

                if (!otherPlayer.manches[gameData.currentManche]) {
                    otherPlayer.manches[gameData.currentManche] = { points: 0 };
                }
                otherPlayer.manches[gameData.currentManche].points++;

                alert(`✅ Touche !`);
                
                if (gameData.currentMatchTouches >= maxTouches) {
                    setTimeout(() => nextMatch(), 500);
                } else {
                    updateGameDisplay();
                }
            }
        }

        function undoLastTouch() {
            if (!gameData.lastTouch) return;

            const { teamId, player, otherPlayer, timeUsed } = gameData.lastTouch;

            player.totalPoints--;
            otherPlayer.totalPoints--;
            gameData.teams[teamId].score--;
            gameData.currentMatchTouches--;

            player.timeInAttack -= timeUsed;
            otherPlayer.timeInDefense -= timeUsed;

            if (player.manches[gameData.currentManche]) {
                player.manches[gameData.currentManche].points--;
            }
            if (otherPlayer.manches[gameData.currentManche]) {
                otherPlayer.manches[gameData.currentManche].points--;
            }

            gameData.lastTouch = null;
            alert('↩️ Dernière touche annulée !');
            updateGameDisplay();
        }

        function handleTimeUp() {
            playEndSound();
            
            const p1 = gameData.currentMatch.team1Player;
            const p2 = gameData.currentMatch.team2Player;

            let sourisTeamId = p1.role === 'souris' ? 1 : 2;
            const sourisPlayer = sourisTeamId === 1 ? p1 : p2;
            const chatPlayer = sourisTeamId === 1 ? p2 : p1;
            const timeUsed = gameData.config.mancheDuration;
            
            gameData.teams[sourisTeamId].score++;
            sourisPlayer.totalPoints++;
            chatPlayer.totalPoints++;

            sourisPlayer.timeInDefense += timeUsed;
            chatPlayer.timeInAttack += timeUsed;

            if (!sourisPlayer.manches[gameData.currentManche]) {
                sourisPlayer.manches[gameData.currentManche] = { points: 0 };
            }
            sourisPlayer.manches[gameData.currentManche].points++;

            if (!chatPlayer.manches[gameData.currentManche]) {
                chatPlayer.manches[gameData.currentManche] = { points: 0 };
            }
            chatPlayer.manches[gameData.currentManche].points++;

            gameData.lastTouch = null;
            alert(`⏰ Temps écoulé ! Souris survit !`);
            
            nextMatch();
        }

        function nextMatch() {
            stopTimer();
            selectNextMatch();
            if (gameData.currentMatch) {
                updateGameDisplay();
                resetTimer();
            }
        }

        function endManche() {
            stopTimer();
            
            if (gameData.currentManche < gameData.config.nbManches) {
                if (confirm(`✅ Manche ${gameData.currentManche} terminée !\n\nPasser à la manche suivante ?`)) {
                    gameData.currentManche++;
                    gameData.teams[1].playedPlayers = [];
                    gameData.teams[2].playedPlayers = [];
                    assignRoles();
                    selectNextMatch();
                    updateGameDisplay();
                    resetTimer();
                }
            } else {
                showResults();
                alert('🏁 Jeu terminé ! Consultez les résultats..');
            }
        }

        function resetTimer() {
            stopTimer();
            gameData.timer.timeLeft = gameData.config.mancheDuration;
            updateTimerDisplay();
        }

        function toggleTimer() {
            if (gameData.timer.isRunning) {
                stopTimer();
            } else {
                startTimer();
            }
        }

        function startTimer() {
            if (gameData.timer.isRunning) return;
            
            gameData.timer.isRunning = true;
            document.getElementById('btnStartTimer').style.display = 'none';
            document.getElementById('btnStopTimer').style.display = 'inline-block';

            gameData.timer.interval = setInterval(() => {
                gameData.timer.timeLeft--;
                updateTimerDisplay();

                if (gameData.timer.timeLeft <= 0) {
                    handleTimeUp();
                }
            }, 1000);
        }

        function stopTimer() {
            gameData.timer.isRunning = false;
            clearInterval(gameData.timer.interval);
            document.getElementById('btnStartTimer').style.display = 'inline-block';
            document.getElementById('btnStopTimer').style.display = 'none';
        }

        function updateTimerDisplay() {
            const minutes = Math.floor(gameData.timer.timeLeft / 60);
            const seconds = gameData.timer.timeLeft % 60;
            document.getElementById('timerDisplay').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }

        function updateStats() {
            const statsGrid = document.getElementById('statsGrid');
            statsGrid.innerHTML = '';

            [1, 2].forEach(teamId => {
                gameData.teams[teamId].players.forEach(player => {
                    const card = document.createElement('div');
                    card.className = `player-stat-card team-${teamId}`;

                    const totalPoints = player.totalPoints;
                    const timeAttack = player.timeInAttack;
                    const timeDefense = player.timeInDefense;

                    card.innerHTML = `
                        <div class="stat-name">#${player.id + 1} ${player.prenom}</div>
                        
                        <div class="stat-line" style="background: rgba(255, 215, 0, 0.2); padding: 8px; border-radius: 4px; margin-bottom: 10px;">
                            <span>POINTS CUMULÉS</span>
                            <span class="stat-value" style="font-size: 1.3em;">${totalPoints}</span>
                        </div>

                        <div class="stat-line">
                            <span>Temps en Attaque :</span>
                            <span class="stat-value">${timeAttack}s</span>
                        </div>
                        <div class="stat-line">
                            <span>Temps en Défense :</span>
                            <span class="stat-value">${timeDefense}s</span>
                        </div>
                    `;

                    statsGrid.appendChild(card);
                });
            });
        }

        function updateRankings() {
            const rankingGrid = document.getElementById('rankingGrid');
            rankingGrid.innerHTML = '';

            const allPlayers = [];
            [1, 2].forEach(teamId => {
                gameData.teams[teamId].players.forEach(player => {
                    allPlayers.push({ ...player, teamId });
                });
            });

            const attackers = allPlayers.filter(p => p.timeInAttack > 0).sort((a, b) => a.timeInAttack - b.timeInAttack);
            const defenders = allPlayers.filter(p => p.timeInDefense > 0).sort((a, b) => b.timeInDefense - a.timeInDefense);

            const attackCard = document.createElement('div');
            attackCard.className = 'ranking-card';
            attackCard.style.borderColor = '#ff4757';
            attackCard.innerHTML = '<h3>🔴 Meilleur Attaquant (Plus Rapide)</h3>';
            
            const attackList = document.createElement('ul');
            attackList.className = 'ranking-list';
            attackers.slice(0, 5).forEach((player, index) => {
                const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="ranking-position">
                        <span class="ranking-medal">${medals[index]}</span>
                        <span class="ranking-name">#${player.id + 1} ${player.prenom}</span>
                    </div>
                    <span class="ranking-time">${player.timeInAttack}s</span>
                `;
                attackList.appendChild(li);
            });
            attackCard.appendChild(attackList);
            rankingGrid.appendChild(attackCard);

            const defenseCard = document.createElement('div');
            defenseCard.className = 'ranking-card';
            defenseCard.style.borderColor = '#2ed573';
            defenseCard.innerHTML = '<h3>🟢 Meilleur Défenseur (Plus Loin)</h3>';
            
            const defenseList = document.createElement('ul');
            defenseList.className = 'ranking-list';
            defenders.slice(0, 5).forEach((player, index) => {
                const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="ranking-position">
                        <span class="ranking-medal">${medals[index]}</span>
                        <span class="ranking-name">#${player.id + 1} ${player.prenom}</span>
                    </div>
                    <span class="ranking-time">${player.timeInDefense}s</span>
                `;
                defenseList.appendChild(li);
            });
            defenseCard.appendChild(defenseList);
            rankingGrid.appendChild(defenseCard);
        }

        function updateResults() {
            const winner = gameData.teams[1].score > gameData.teams[2].score 
                ? gameData.teams[1].name 
                : gameData.teams[2].score > gameData.teams[1].score 
                    ? gameData.teams[2].name 
                    : 'ÉGALITÉ ⚖️';

            const resultsText = `
${gameData.teams[1].name} : ${gameData.teams[1].score} points
${gameData.teams[2].name} : ${gameData.teams[2].score} points
<br><br>
🏆 GAGNANT : ${winner}
            `;

            document.getElementById('resultsContent').innerHTML = resultsText;
        }

        function showStats() {
            document.getElementById('statsSection').classList.add('active');
            document.getElementById('rankingSection').classList.remove('active');
            document.getElementById('resultsSection').classList.remove('active');
            document.querySelectorAll('.view-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === 0);
            });
        }

        function showRankings() {
            document.getElementById('statsSection').classList.remove('active');
            document.getElementById('rankingSection').classList.add('active');
            document.getElementById('resultsSection').classList.remove('active');
            document.querySelectorAll('.view-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === 1);
            });
        }

        function showResults() {
            document.getElementById('statsSection').classList.remove('active');
            document.getElementById('rankingSection').classList.remove('active');
            document.getElementById('resultsSection').classList.add('active');
            document.querySelectorAll('.view-btn').forEach((btn, i) => {
                btn.classList.toggle('active', i === 2);
            });
        }

        function backToConfig() {
            stopTimer();
            document.getElementById('gameSection').classList.remove('active');
            document.getElementById('configSection').style.display = 'block';
            gameData.currentManche = 1;
        }
    </script>
