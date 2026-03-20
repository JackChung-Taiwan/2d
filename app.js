const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const pSpriteUrl = "https://raw.githubusercontent.com/JackChung-Taiwan/2d/main/you";
const bSpriteUrl = "https://raw.githubusercontent.com/JackChung-Taiwan/2d/main/jack";

const pState = { name: "翊華學員", hp: 150, maxHp: 150, atk: 700 };
const bState = { name: "大魔王黑傑克", hp: 10000, maxHp: 10000, atk: 35 };

let round = 1;
let bossStunned = false;

// 招式冷卻時間狀態
const cooldowns = { heavy: 0, stun: 0 };

const terminalContent = document.getElementById('text-content');
const prologueArena = document.getElementById('prologue-arena');
const prologueImg = document.getElementById('prologue-image');
const arena = document.getElementById('arena');
const commandPanel = document.getElementById('command-panel');

const btnAttack = document.getElementById('btn-attack');
const btnHeavy = document.getElementById('btn-heavy');
const btnStun = document.getElementById('btn-stun');
const btnHeal = document.getElementById('btn-heal');

function updateHpUI(target, current, max) {
    const percent = Math.max(0, (current / max) * 100);
    const fill = document.getElementById(`${target}-hp-fill`);
    const text = document.getElementById(`${target}-hp-text`);
    
    fill.style.width = `${percent}%`;
    text.innerText = `${Math.floor(Math.max(0, current))}/${max}`;

    if (target === 'player') {
        fill.style.backgroundColor = percent > 50 ? '#0f0' : percent > 20 ? '#ff0' : '#f00';
    }
}

async function typeWriter(text, color = "var(--term-green)") {
    const p = document.createElement('div');
    p.style.color = color;
    p.style.marginBottom = "5px";
    terminalContent.appendChild(p);

    let i = 0;
    while (i < text.length) {
        p.innerHTML += text.charAt(i);
        terminalContent.scrollTop = terminalContent.scrollHeight;
        await sleep(20); 
        i++;
    }
    await sleep(300); 
}

function updateButtonsState() {
    btnAttack.disabled = false;
    btnHeal.disabled = false;
    
    // 更新高傷害技能狀態
    if (cooldowns.heavy > 0) {
        btnHeavy.disabled = true;
        btnHeavy.innerText = `> sudo rm -rf / [CD:${cooldowns.heavy}]`;
    } else {
        btnHeavy.disabled = false;
        btnHeavy.innerText = `> sudo rm -rf /`;
    }

    // 更新中斷技能狀態
    if (cooldowns.stun > 0) {
        btnStun.disabled = true;
        btnStun.innerText = `> Ctrl+C [CD:${cooldowns.stun}]`;
    } else {
        btnStun.disabled = false;
        btnStun.innerText = `> Ctrl+C (中斷)`;
    }
}

function disableAllButtons() {
    btnAttack.disabled = true;
    btnHeavy.disabled = true;
    btnStun.disabled = true;
    btnHeal.disabled = true;
}

async function startPrologue() {
    terminalContent.innerHTML = '';
    
    prologueImg.src = pSpriteUrl;
    prologueImg.style.opacity = '1';
    prologueImg.style.filter = 'drop-shadow(0 0 10px rgba(0,255,0,0.5))';
    await typeWriter("> 終端機系統啟動...");
    await typeWriter("> 載入翊華補習班中央伺服器日誌...");
    await typeWriter("> 那是一個平常的夜晚，程式設計課堂上，學員們正如火上地撰寫著程式碼...");
    await sleep(800);

    prologueImg.style.opacity = '0';
    await sleep(800);
    prologueImg.src = bSpriteUrl; 
    prologueImg.style.opacity = '1';
    prologueImg.style.filter = 'drop-shadow(0 0 20px var(--boss-red)) brightness(0.8)';
    
    await typeWriter("> [警告]: 偵測到代碼層級入侵！系統核心正在崩潰！", "var(--boss-red)");
    await typeWriter("> 一個惡意的數據實體正在將教室吞噬...", "var(--boss-red)");
    await sleep(800);

    prologueArena.style.display = 'none'; 
    arena.style.display = 'flex'; 
    commandPanel.style.display = 'grid'; 
    
    await typeWriter("> 唯一的生存路徑，就是除錯。", "var(--term-green)");
    await typeWriter("> 大魔王黑傑克已降臨。請輸入指令完成決戰。", "#0f0");
    
    updateHpUI('player', pState.hp, pState.maxHp);
    updateHpUI('boss', bState.hp, bState.maxHp);
    updateButtonsState();
}

async function executeAction(actionType) {
    disableAllButtons();
    terminalContent.innerHTML = ''; 
    await typeWriter(`> 第 ${round} 回合 / 對戰大魔王黑傑克`);

    // 玩家行動處理
    if (actionType === 'attack') {
        await typeWriter(`> 執行 std::attack()，輸出基礎攻擊程式碼！`);
        await playAnimation('player', 'boss', 'dash-right', 'glitch-damage');
        let dmg = Math.floor(pState.atk * (0.9 + Math.random() * 0.2));
        await typeWriter(`> 造成 ${dmg} 點傷害。`);
        bState.hp -= dmg;

    } else if (actionType === 'heavy') {
        cooldowns.heavy = 3; // 設定 2 回合冷卻 (回合結束時會-1)
        await typeWriter(`> 取得系統最高權限！執行 sudo rm -rf / 進行根目錄破壞！`, "#ff0");
        await playAnimation('player', 'boss', 'dash-right', 'glitch-damage');
        let dmg = Math.floor(pState.atk * (2.2 + Math.random() * 0.5));
        await typeWriter(`> 致命暴擊！黑傑克受到 ${dmg} 點巨大傷害！`, "var(--boss-red)");
        bState.hp -= dmg;

    } else if (actionType === 'stun') {
        cooldowns.stun = 4; // 設定 3 回合冷卻
        await typeWriter(`> 傳送中斷訊號！執行 Ctrl+C！`, "#0ff");
        await playAnimation('player', 'boss', 'dash-right', 'glitch-damage');
        let dmg = Math.floor(pState.atk * 0.3); // 傷害極低
        bossStunned = true;
        await typeWriter(`> 造成 ${dmg} 點微弱傷害，但成功癱瘓了魔王的進程！`);
        bState.hp -= dmg;

    } else if (actionType === 'heal') {
        const healAmt = 60;
        pState.hp = Math.min(pState.maxHp, pState.hp + healAmt);
        await typeWriter(`> 執行 debug_heal() 修復子系統...`);
        await typeWriter(`> 成功回復了 ${healAmt} 點 HP。`, "#0ff");
    }

    updateHpUI('boss', bState.hp, bState.maxHp);
    updateHpUI('player', pState.hp, pState.maxHp);

    if (bState.hp <= 0) {
        await handleWin();
        return;
    }

    await sleep(800);

    // 魔王回合處理
    if (bossStunned) {
        await typeWriter(`> 大魔王黑傑克觸發 KeyboardInterrupt！本回合無法行動！`, "#0ff");
        bossStunned = false; // 解除癱瘓狀態
    } else {
        const bossMoves = [
            "使出【致命邏輯錯誤】攻擊！程式碼出現 Bug...",
            "發動【記憶體洩漏】！可用資源耗盡...",
            "植入【木馬病毒】！系統核心遭到篡改！"
        ];
        const moveStr = bossMoves[Math.floor(Math.random() * bossMoves.length)];
        
        await typeWriter(`> 警告！黑傑克${moveStr}`, "var(--boss-red)");
        await playAnimation('boss', 'player', 'dash-left', 'glitch-damage');

        let bossDmg = Math.floor(bState.atk * (0.8 + Math.random() * 0.4));
        pState.hp -= bossDmg;
        updateHpUI('player', pState.hp, pState.maxHp);
        await typeWriter(`> 系統受損！HP 下降了 ${bossDmg} 點！`, "var(--boss-red)");
    }

    if (pState.hp <= 0) {
        await handleLose();
        return;
    }

    // 回合結束，冷卻時間遞減
    if (cooldowns.heavy > 0) cooldowns.heavy--;
    if (cooldowns.stun > 0) cooldowns.stun--;

    round++;
    updateButtonsState();
}

async function playAnimation(attacker, defender, dashAnim, hitAnim) {
    const atkSprite = document.getElementById(`${attacker}-sprite`);
    const defSprite = document.getElementById(`${defender}-sprite`);

    atkSprite.style.animation = 'none';
    void atkSprite.offsetWidth; 
    atkSprite.style.animation = `${dashAnim} 0.5s ease-in-out`;
    
    await sleep(250); 

    defSprite.style.animation = 'none';
    void defSprite.offsetWidth;
    defSprite.style.animation = `${hitAnim} 0.5s`;

    await sleep(400);
    atkSprite.style.animation = 'none';
    defSprite.style.animation = 'none';
}

async function handleWin() {
    await sleep(500);
    const bossSprite = document.getElementById('boss-sprite');
    bossSprite.style.animation = 'delete-drop 1.5s forwards'; 
    
    await typeWriter(`> ...`, "var(--term-green)");
    await typeWriter(`> 【大魔王黑傑克】 核心系統崩潰... 遭到強制刪除。`, "var(--term-green)");
    await typeWriter(`> [SYSTEM]: 恭喜學員！你成功清除病毒，維護了補習班伺服器的安全！`, "#0f0");
}

async function handleLose() {
    await sleep(500);
    const playerSprite = document.getElementById('player-sprite');
    playerSprite.style.animation = 'delete-drop 1.5s forwards';
    
    await typeWriter(`> ...`, "var(--boss-red)");
    await typeWriter(`> 致命錯誤！系統已離線。`, "var(--boss-red)");
    await typeWriter(`> [GAME OVER] 你的靈魂將永遠留在翊華補習班除錯...`, "var(--boss-red)");
}

window.onload = () => {
    btnAttack.addEventListener('click', () => executeAction('attack'));
    btnHeavy.addEventListener('click', () => executeAction('heavy'));
    btnStun.addEventListener('click', () => executeAction('stun'));
    btnHeal.addEventListener('click', () => executeAction('heal'));
    
    startPrologue();
};