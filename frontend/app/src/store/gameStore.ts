import { create } from "zustand";
import { getCurrentUser, login, logout, register } from "../api/auth";
import { fetchWorldState, resetWorld, runStep } from "../api/game";
import type { AuthPayload, AuthUser, WorldState } from "../types/api";
type GameStore = {
  user: AuthUser | null;
  world: WorldState | null;
  status: string;
  isSubmitting: boolean;
  isBusy: boolean;
  checkAuth: () => Promise<void>;
  fetchWorld: () => Promise<void>;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: AuthPayload) => Promise<void>;
  logout: () => Promise<void>;
  runStep: (affair: string) => Promise<void>;
  resetWorld: () => Promise<void>;
};

export const useGameStore = create<GameStore>((set) => ({
  user: null,
  world: null,
  status: "正在检查登录状态...",
  isSubmitting: false,
  isBusy: false,

  checkAuth: async () => {
  try {
    const data = await getCurrentUser();

    if (data.authenticated) {
      set({
        user: data.user,
        status: "已登录，正在读取世界状态...",
      });

      const worldData = await fetchWorldState();

      set({
        world: worldData.state,
        status: "已登录",
      });
    } else {
      set({
        user: null,
        world: null,
        status: "未登录",
      });
    }
  } catch (error) {
    set({
      status: error instanceof Error ? error.message : "接口请求失败",
    });
  }
},
  fetchWorld: async () => {
  try {
    const data = await fetchWorldState();

    set({
      world: data.state,
      status: "世界状态已更新",
    });
  } catch (error) {
    set({
      status: error instanceof Error ? error.message : "读取世界状态失败",
    });
  }
},

  login: async (payload) => {
    set({
      isSubmitting: true,
      status: "正在登录...",
    });

    try {
      const data = await login(payload);

      set({
        user: data.user,
        world: data.state,
        status: "登录成功",
      });
    } catch (error) {
      set({
        status: error instanceof Error ? error.message : "登录失败",
      });
    } finally {
      set({
        isSubmitting: false,
      });
    }
  },

  register: async (payload) => {
    set({
      isSubmitting: true,
      status: "正在注册...",
    });

    try {
      const data = await register(payload);

      set({
        user: data.user,
        world: data.state,
        status: "注册成功",
      });
    } catch (error) {
      set({
        status: error instanceof Error ? error.message : "注册失败",
      });
    } finally {
      set({
        isSubmitting: false,
      });
    }
  },

  logout: async () => {
    try {
      await logout();
    } finally {
      set({
        user: null,
        world: null,
        status: "已退出登录",
      });
    }
  },
  runStep: async (affair) => {
  set({
    isBusy: true,
    status: "正在推进时间...",
  });

  try {
    const data = await runStep({ affair });

    set({
      world: data.state,
      status: "时间已推进",
    });
  } catch (error) {
    set({
      status: error instanceof Error ? error.message : "推进失败",
    });
  } finally {
    set({
      isBusy: false,
    });
  }
},

resetWorld: async () => {
  set({
    isBusy: true,
    status: "正在重置世界...",
  });

  try {
    const data = await resetWorld();

    set({
      world: data.state,
      status: "世界已重置",
    });
  } catch (error) {
    set({
      status: error instanceof Error ? error.message : "重置失败",
    });
  } finally {
    set({
      isBusy: false,
    });
  }
},
}));