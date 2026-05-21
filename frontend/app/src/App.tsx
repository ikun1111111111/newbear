import { useEffect, useState } from "react";
import type { CSSProperties, SyntheticEvent } from "react";
import { useGameStore } from "./store/gameStore";
import "./styles/global.css";

type AuthMode = "login" | "register";
const MAP_IMAGE_SRC = "/assets/map_slices/map_layer_001_-1.png";
const SPEECH_BUBBLE_WIDTH = 170;
const SPEECH_ROTATE_MS = 5000;

const ACTOR_COLORS: Record<string, string> = {
  xionglaoban: "#6f4a2f",
  xiongjishu: "#3f5568",
  xiongshichang: "#4f7d4f",
  xiongxingzheng: "#9a6a45",
};

const ACTOR_ASSETS: Record<string, string> = {
  xionglaoban: "/assets/actors/xionglaoban/idle_front.webp",
  xiongjishu: "/assets/actors/xiongjishu/idle_front.webp",
  xiongshichang: "/assets/actors/xiongshichang/idle_front.webp",
  xiongxingzheng: "/assets/actors/xiongxingzheng/idle_front.webp",
};

function getActorAsset(actorId: string) {
  return ACTOR_ASSETS[actorId] || ACTOR_ASSETS.xionglaoban;
}

function getActorFormationOffset(index: number, total: number) {
  if (total <= 1) {
    return { x: 0, y: 0 };
  }

  const spacingX = 38;
  const spacingY = 10;
  const center = (total - 1) / 2;

  return {
    x: (index - center) * spacingX,
    y: (index % 2 === 0 ? -1 : 1) * spacingY,
  };
}

function getSpeechFormationOffset(index: number, total: number, anchorLeft: number) {
  const center = (total - 1) / 2;
  const row = index % 2;
  let edgeShift = 0;

  if (anchorLeft < 24) {
    edgeShift = 78;
  } else if (anchorLeft > 76) {
    edgeShift = -78;
  }

  return {
    x: edgeShift + (index - center) * SPEECH_BUBBLE_WIDTH,
    y: -88 - row * 70,
  };
}

function getSpeechBubblePosition(left: number, top: number, index: number, total: number) {
  const offset = getSpeechFormationOffset(index, total, left);

  if (top < 28) {
    return {
      ...offset,
      y: 72 + (index % 2) * 54,
      placement: "below",
    };
  }

  return {
    ...offset,
    placement: "above",
  };
}

function App() {
  const user = useGameStore((state) => state.user);
  const world = useGameStore((state) => state.world);
  const status = useGameStore((state) => state.status);
  const isSubmitting = useGameStore((state) => state.isSubmitting);
  const isBusy = useGameStore((state) => state.isBusy);
  const runStep = useGameStore((state) => state.runStep);
  const resetWorld = useGameStore((state) => state.resetWorld);
  const checkAuth = useGameStore((state) => state.checkAuth);
  const login = useGameStore((state) => state.login);
  const register = useGameStore((state) => state.register);
  const logout = useGameStore((state) => state.logout);

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("test01");
  const [password, setPassword] = useState("123456");
  const [affair, setAffair] = useState("");
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const mapLocations = world?.map?.semantics?.locations ?? [];
  const actors = world?.actors ?? [];
  const speakingActors = actors.filter((actor) => actor.last_speech?.trim());
  const selectedActor = actors.find((actor) => actor.actor_id === selectedActorId) ?? null;
  const [activeSpeechIndex, setActiveSpeechIndex] = useState(0);
  const activeSpeechActor =
    activeSpeechIndex >= 0 && activeSpeechIndex < speakingActors.length
      ? speakingActors[activeSpeechIndex % speakingActors.length]
      : null;
  const speechQueueKey = speakingActors
    .map((actor) => `${actor.actor_id}:${actor.last_speech}`)
    .join("|");

  const locationByName = new Map(
    mapLocations.map((location) => [location.name, location]),
  );
  const actorsByLocation = new Map<string, typeof actors>();

  for (const actor of actors) {
    const group = actorsByLocation.get(actor.location) ?? [];
    group.push(actor);
    actorsByLocation.set(actor.location, group);
  }

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    setActiveSpeechIndex(speakingActors.length > 0 ? 0 : -1);
  }, [speechQueueKey]);

  useEffect(() => {
    if (
      activeSpeechIndex < 0 ||
      speakingActors.length === 0 ||
      activeSpeechIndex >= speakingActors.length - 1
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setActiveSpeechIndex((current) => {
        const next = current + 1;
        return Math.min(next, speakingActors.length - 1);
      });
    }, SPEECH_ROTATE_MS);

    return () => window.clearTimeout(timer);
  }, [activeSpeechIndex, speakingActors.length, speechQueueKey]);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      return;
    }

    if (authMode === "login") {
      await login({ username, password });
    } else {
      await register({ username, password });
    }
  }

  async function handleLogout() {
    await logout();
  }
  async function handleRunStep() {
  await runStep(affair);
  setAffair("");
}

async function handleResetWorld() {
  await resetWorld();
}

  if (!user) {
    return (
      <main className="app-shell">
        <section className="mobile-frame auth-frame">
          <header className="app-header">
            <div>
              <p className="app-kicker">熊心壮职</p>
              <h1>{authMode === "login" ? "欢迎回来" : "创建身份"}</h1>
            </div>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-tabs">
              <button
                className={authMode === "login" ? "is-active" : ""}
                type="button"
                onClick={() => setAuthMode("login")}
              >
                登录
              </button>
              <button
                className={authMode === "register" ? "is-active" : ""}
                type="button"
                onClick={() => setAuthMode("register")}
              >
                注册
              </button>
            </div>

            <label className="input-box">
              <span>玩家名</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="例如：test01"
              />
            </label>

            <label className="input-box">
              <span>密码</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                type="password"
                placeholder="测试阶段可先随意填写"
              />
            </label>

            <p className="form-status">{status}</p>

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "处理中..."
                : authMode === "login"
                  ? "进入公司"
                  : "创建身份"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="mobile-frame">
        <header className="app-header">
          <div>
            <p className="app-kicker">{world?.company?.name || "熊心壮职"}</p>
            <h1>入职第一天</h1>
          </div>
          <button className="icon-button" type="button" onClick={handleLogout}>
            退
          </button>
        </header>

        <section className="scene-panel">
          <div className="world-map">
            <img className="world-map-image" src={MAP_IMAGE_SRC} alt="公司地图" />

            <div className="speech-layer">
              {activeSpeechActor ? (() => {
                const actor = activeSpeechActor;
                const location = locationByName.get(actor.location);

                if (!location?.anchor_x || !location?.anchor_y) {
                  return null;
                }

                const pixelWidth = world?.map?.world?.pixel_width || 1;
                const pixelHeight = world?.map?.world?.pixel_height || 1;
                const left = (location.anchor_x / pixelWidth) * 100;
                const top = (location.anchor_y / pixelHeight) * 100;
                const color = ACTOR_COLORS[actor.actor_id] || "#18212f";
                const group = actorsByLocation.get(actor.location) ?? [];
                const actorIndex = group.findIndex(
                  (item) => item.actor_id === actor.actor_id,
                );
                const speechPosition = getSpeechBubblePosition(
                  left,
                  top,
                  actorIndex,
                  group.length,
                );

                return (
                  <div
                    className={`floor-speech ${
                      speechPosition.placement === "below" ? "is-below" : ""
                    }`}
                    key={`${actor.actor_id}-speech`}
                    style={{
                      "--speech-anchor-x": `${left}%`,
                      "--speech-anchor-y": `${top}%`,
                      zIndex: 40,
                      borderColor: color,
                      "--speech-offset-x": `${speechPosition.x}px`,
                      "--speech-offset-y": `${speechPosition.y}px`,
                    } as CSSProperties}
                  >
                    <strong style={{ color }}>{actor.display_name}</strong>
                    <span>{actor.last_speech}</span>
                  </div>
                );
              })() : null}
            </div>

            <div className="actor-layer">
              {actors.map((actor, index) => {
                const location = locationByName.get(actor.location);

                if (!location?.anchor_x || !location?.anchor_y) {
                  return null;
                }

                const pixelWidth = world?.map?.world?.pixel_width || 1;
                const pixelHeight = world?.map?.world?.pixel_height || 1;
                const left = (location.anchor_x / pixelWidth) * 100;
                const top = (location.anchor_y / pixelHeight) * 100;
                const color = ACTOR_COLORS[actor.actor_id] || "#18212f";
                const group = actorsByLocation.get(actor.location) ?? [];
                const actorIndex = group.findIndex(
                  (item) => item.actor_id === actor.actor_id,
                );
                const formation = getActorFormationOffset(actorIndex, group.length);

                return (
                  <button
                    className={`actor-marker ${
                      selectedActorId === actor.actor_id ? "is-selected" : ""
                    }`}
                    key={actor.actor_id}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      zIndex: 10 + index,
                      "--actor-offset-x": `${formation.x}px`,
                      "--actor-offset-y": `${formation.y}px`,
                    } as CSSProperties}
                    type="button"
                    onClick={() => setSelectedActorId(actor.actor_id)}
                    title={`${actor.display_name} · ${actor.location}`}
                  >
                    <div className="floor-actor-body">
                      <div className="floor-actor-shadow" />
                      <img
                        className="floor-actor-image"
                        src={getActorAsset(actor.actor_id)}
                        alt={actor.display_name}
                      />
                      <div className="floor-actor-label" style={{ color, borderColor: color }}>
                        {actor.display_name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bottom-panel">
          {selectedActor ? (
            <article className="actor-detail">
              <header>
                <strong>{selectedActor.display_name}</strong>
                <button
                  className="mini-close-button"
                  type="button"
                  onClick={() => setSelectedActorId(null)}
                >
                  关闭
                </button>
              </header>

              <div className="actor-detail-grid">
                <span>位置：{selectedActor.location || "未知"}</span>
                <span>压力：{selectedActor.stress ?? "-"}</span>
                <span>精力：{selectedActor.energy ?? "-"}</span>
                <span>心情：{selectedActor.mood || "-"}</span>
              </div>

              {selectedActor.current_task ? (
                <p>任务：{selectedActor.current_task}</p>
              ) : null}

              {selectedActor.last_speech ? (
                <p>最近发言：{selectedActor.last_speech}</p>
              ) : null}
            </article>
          ) : null}

          <div className="status-row">
            <span>{status}</span>
            <span>{user.username}</span>
            <span>{world?.company?.clock || "09:00"}</span>
            <span>CNY {world?.company?.cash ?? 5000}</span>
          </div>

          <label className="input-box">
            <span>你想对同事说什么？</span>
           <input
              value={affair}
              onChange={(event) => setAffair(event.target.value)}
              placeholder="例如：我先了解一下大家手头的任务"
            />
          </label>

          <div className="action-row">
            <button type="button" onClick={handleRunStep} disabled={isBusy}>
              {isBusy ? "推进中..." : "推进 30 分钟"}
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={handleResetWorld}
              disabled={isBusy}
            >
              重置世界
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
