<script>
  let apps = [
    { id: "tiktok", name: "TikTok", usage: { daily: 120, weekly: 540 }, x: 50, y: 55 },
    { id: "instagram", name: "Instagram", usage: { daily: 75, weekly: 360 }, x: 30, y: 35 },
    { id: "snapchat", name: "Snapchat", usage: { daily: 45, weekly: 240 }, x: 75, y: 32 },
    { id: "youtube", name: "YouTube", usage: { daily: 90, weekly: 420 }, x: 25, y: 70 },
    { id: "facebook", name: "Facebook", usage: { daily: 20, weekly: 120 }, x: 78, y: 73 },
    { id: "discord", name: "Discord", usage: { daily: 35, weekly: 180 }, x: 40, y: 20 }
  ];

  let activeView = "dashboard";
  let selectedRange = "daily";

  const quotes = [
    { text: "Your attention is your most valuable resource.", author: "Unknown" },
    { text: "Every minute on your phone is a minute you’re not in your life.", author: "Unknown" },
    { text: "You don’t have to respond to everything right away.", author: "Unknown" },
    { text: "Small choices today shape your future habits.", author: "Unknown" }
  ];

  const todayIndex = new Date().getDate() % quotes.length;
  const dailyQuote = quotes[todayIndex];

  $: currentUsage = apps.map(a => ({ ...a, minutes: a.usage[selectedRange] }));
  $: maxUsage = Math.max(...currentUsage.map(a => a.minutes), 1);
  $: totalMinutes = currentUsage.reduce((sum, a) => sum + a.minutes, 0);
  $: sortedApps = [...currentUsage].sort((a, b) => b.minutes - a.minutes);

  function bubbleSize(min) {
    const minSize = 60;
    const maxSize = 140;
    return minSize + (min / maxUsage) * (maxSize - minSize);
  }

  function formatMinutes(m) {
    const hrs = Math.floor(m / 60);
    const mins = m % 60;
    if (hrs === 0) return `${mins} min`;
    if (mins === 0) return `${hrs} h`;
    return `${hrs} h ${mins} min`;
  }

  function realityCheck(minutes) {
    const hours = minutes / 60;
    if (hours < 1) return "That's about one TV episode.";
    if (hours < 3) return "That's longer than a full class period.";
    if (hours < 5) return "That's the same as a part-time work shift.";
    return "That's a huge chunk of your day. Even 1 less hour helps.";
  }
</script>

<main class="app">
  <header class="header">
    <h1 class="title">Digital Addiction</h1>

    <div class="range-row">
      <span>Showing</span>
      <select bind:value={selectedRange} class="range-select">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>
    </div>
  </header>

  <section class="content">
    {#if activeView === "dashboard"}
      <section class="card">
        <h2 class="section-title">App Usage Bubbles</h2>
        <p class="helper">Bigger bubbles = more time spent.</p>

        <div class="bubble-area">
          {#each currentUsage as app (app.id)}
            <div
              class="bubble"
              style={`width:${bubbleSize(app.minutes)}px; height:${bubbleSize(app.minutes)}px; left:${app.x}%; top:${app.y}%;`}
            >
              <span class="bubble-name">{app.name}</span>
              <span class="bubble-minutes">{formatMinutes(app.minutes)}</span>
            </div>
          {/each}
        </div>

        <div class="top-list">
          <h3 class="small-heading">Top Apps</h3>
          {#each sortedApps.slice(0, 3) as app, i}
            <div class="top-row">
              <span class="rank">{i + 1}.</span>
              <span>{app.name}</span>
              <span>{formatMinutes(app.minutes)}</span>
            </div>
          {/each}
        </div>

        <div class="quote-block">
          <p class="quote-text">“{dailyQuote.text}”</p>
          <p class="quote-author">— {dailyQuote.author}</p>
        </div>
      </section>
    {:else}
      <section class="card">
        <h2 class="section-title">
          {selectedRange === "daily" ? "Today's Summary" : "This Week's Summary"}
        </h2>

        <p class="summary-main">
          Total time: <strong>{formatMinutes(totalMinutes)}</strong>
        </p>

        <div class="summary-block">
          <h3 class="small-heading">By App</h3>
          {#each sortedApps as app}
            <div class="summary-row">
              <span>{app.name}</span>
              <div class="bar-wrapper">
                <div class="bar-fill" style={`width:${(app.minutes / maxUsage) * 100}%`}></div>
              </div>
              <span>{formatMinutes(app.minutes)}</span>
            </div>
          {/each}
        </div>

        <div class="reality-block">
          <h3 class="small-heading">Reality Check</h3>
          <p>{realityCheck(totalMinutes)}</p>
        </div>
      </section>
    {/if}
  </section>

  <nav class="bottom-nav">
    <button class:active={activeView === "dashboard"} on:click={() => activeView = "dashboard"}>Usage</button>
    <button class:active={activeView === "summary"} on:click={() => activeView = "summary"}>Summary</button>
  </nav>
</main>

<style>
  /* everything is styled — identical to working version */
  :global(body) { margin: 0; }

  .app {
    max-width: 480px;
    margin: auto;
    padding-bottom: 4rem;
    min-height: 100vh;
  }

  .header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .title {
    margin: 0;
    font-weight: 700;
  }

  .range-select {
    border-radius: 20px;
    padding: 4px 8px;
  }

  .card {
    background: white;
    padding: 1rem;
    margin: 1rem;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }

  .bubble-area {
    position: relative;
    height: 260px;
    border-radius: 16px;
    background: #eef2ff;
    overflow: hidden;
  }

  .bubble {
    position: absolute;
    transform: translate(-50%, -50%);
    background: #4f46e5;
    color: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 4px;
  }

  .bubble-name { font-size: 12px; }
  .bubble-minutes { font-size: 11px; opacity: 0.9; }

  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: 480px;
    margin: auto;
    display: flex;
    padding: 8px;
    background: #ffffffcc;
    backdrop-filter: blur(8px);
  }

  .bottom-nav button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 999px;
  }

  .bottom-nav button.active {
    background: #4f46e5;
    color: white;
  }
</style>
