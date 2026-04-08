// 模拟后端动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";
import {
  system,
  monitor,
  permission,
  frame,
  tabs,
  warningmachine,
  videolibrary
} from "@/router/enums";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const systemManagementRouter = {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "menus.pureSysManagement",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      meta: {
        icon: "ri:admin-line",
        title: "menus.pureUser",
        roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      meta: {
        icon: "ri:admin-fill",
        title: "menus.pureRole",
        roles: ["admin"]
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      meta: {
        icon: "ep:menu",
        title: "menus.pureSystemMenu",
        roles: ["admin"]
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      meta: {
        icon: "ri:git-branch-line",
        title: "menus.pureDept",
        roles: ["admin"]
      }
    }
  ]
};

const systemMonitorRouter = {
  path: "/monitor",
  meta: {
    icon: "ep:monitor",
    title: "menus.pureSysMonitor",
    rank: monitor
  },
  children: [
    {
      path: "/monitor/online-user",
      component: "monitor/online/index",
      name: "OnlineUser",
      meta: {
        icon: "ri:user-voice-line",
        title: "menus.pureOnlineUser",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/login-logs",
      component: "monitor/logs/login/index",
      name: "LoginLog",
      meta: {
        icon: "ri:window-line",
        title: "menus.pureLoginLog",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/operation-logs",
      component: "monitor/logs/operation/index",
      name: "OperationLog",
      meta: {
        icon: "ri:history-fill",
        title: "menus.pureOperationLog",
        roles: ["admin"]
      }
    },
    {
      path: "/monitor/system-logs",
      component: "monitor/logs/system/index",
      name: "SystemLog",
      meta: {
        icon: "ri:file-search-line",
        title: "menus.pureSystemLog",
        roles: ["admin"]
      }
    }
  ]
};

const permissionRouter = {
  path: "/permission",
  meta: {
    title: "menus.purePermission",
    icon: "ep:lollipop",
    rank: permission
  },
  children: [
    {
      path: "/permission/page/index",
      name: "PermissionPage",
      meta: {
        title: "menus.purePermissionPage",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/button",
      meta: {
        title: "menus.purePermissionButton",
        roles: ["admin", "common"]
      },
      children: [
        {
          path: "/permission/button/router",
          component: "permission/button/index",
          name: "PermissionButtonRouter",
          meta: {
            title: "menus.purePermissionButtonRouter",
            auths: [
              "permission:btn:add",
              "permission:btn:edit",
              "permission:btn:delete"
            ]
          }
        },
        {
          path: "/permission/button/login",
          component: "permission/button/perms",
          name: "PermissionButtonLogin",
          meta: {
            title: "menus.purePermissionButtonLogin"
          }
        }
      ]
    }
  ]
};

const frameRouter = {
  path: "/iframe",
  meta: {
    icon: "ri:links-fill",
    title: "menus.pureExternalPage",
    rank: frame
  },
  children: [
    {
      path: "/iframe/embedded",
      meta: {
        title: "menus.pureEmbeddedDoc"
      },
      children: [
        {
          path: "/iframe/colorhunt",
          name: "FrameColorHunt",
          meta: {
            title: "menus.pureColorHuntDoc",
            frameSrc: "https://colorhunt.co/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/uigradients",
          name: "FrameUiGradients",
          meta: {
            title: "menus.pureUiGradients",
            frameSrc: "https://uigradients.com/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/ep",
          name: "FrameEp",
          meta: {
            title: "menus.pureEpDoc",
            frameSrc: "https://element-plus.org/zh-CN/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/tailwindcss",
          name: "FrameTailwindcss",
          meta: {
            title: "menus.pureTailwindcssDoc",
            frameSrc: "https://tailwindcss.com/docs/installation",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue3",
          name: "FrameVue",
          meta: {
            title: "menus.pureVueDoc",
            frameSrc: "https://cn.vuejs.org/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vite",
          name: "FrameVite",
          meta: {
            title: "menus.pureViteDoc",
            frameSrc: "https://cn.vitejs.dev/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/pinia",
          name: "FramePinia",
          meta: {
            title: "menus.purePiniaDoc",
            frameSrc: "https://pinia.vuejs.org/zh/index.html",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        },
        {
          path: "/iframe/vue-router",
          name: "FrameRouter",
          meta: {
            title: "menus.pureRouterDoc",
            frameSrc: "https://router.vuejs.org/zh/",
            keepAlive: true,
            roles: ["admin", "common"]
          }
        }
      ]
    },
    {
      path: "/iframe/external",
      meta: {
        title: "menus.pureExternalDoc"
      },
      children: [
        {
          path: "/external",
          name: "https://pure-admin.cn/",
          meta: {
            title: "menus.pureExternalLink",
            roles: ["admin", "common"]
          }
        },
        {
          path: "/pureUtilsLink",
          name: "https://pure-admin-utils.netlify.app/",
          meta: {
            title: "menus.pureUtilsLink",
            roles: ["admin", "common"]
          }
        }
      ]
    }
  ]
};

const tabsRouter = {
  path: "/tabs",
  meta: {
    icon: "ri:bookmark-2-line",
    title: "menus.pureTabs",
    rank: tabs
  },
  children: [
    {
      path: "/tabs/index",
      name: "Tabs",
      meta: {
        title: "menus.pureTabs",
        roles: ["admin", "common"]
      }
    },
    // query 传参模式
    {
      path: "/tabs/query-detail",
      name: "TabQueryDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    },
    // params 传参模式
    {
      path: "/tabs/params-detail/:id",
      component: "params-detail",
      name: "TabParamsDetail",
      meta: {
        // 不在menu菜单中显示
        showLink: false,
        activePath: "/tabs/index",
        roles: ["admin", "common"]
      }
    }
  ]
};

const warningMachineRouter = {
  path: "/warning-machine",
  meta: {
    icon: "ep:bell",
    title: "预警机",
    rank: warningmachine
  },
  children: [
    {
      path: "/warning-machine/list",
      name: "WarningMachineList",
      meta: {
        icon: "ep:list",
        title: "预警机列表",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/warning-machine/info",
      name: "WarningMachineInfo",
      meta: {
        icon: "ep:warning",
        title: "预警信息",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/warning-machine/statistics",
      name: "WarningMachineStatistics",
      meta: {
        icon: "ep:trend-charts",
        title: "预警统计",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/warning-machine/factory",
      name: "WarningMachineFactory",
      meta: {
        icon: "ep:office-building",
        title: "厂家管理",
        roles: ["admin", "common"]
      }
    }
  ]
};

const videoLibraryRouter = {
  path: "/video-library",
  meta: {
    icon: "ep:video-camera",
    title: "视频库",
    rank: videolibrary
  },
  children: [
    {
      path: "/video-library/index",
      name: "VideoLibrary",
      meta: {
        icon: "ep:video-play",
        title: "视频展示",
        roles: ["admin", "common"]
      }
    }
  ]
};

export default defineFakeRoute([
  {
    url: "/get-async-routes",
    method: "get",
    response: () => {
      return {
        code: 0,
        message: "操作成功",
        data: [
          warningMachineRouter,
          videoLibraryRouter,
          systemManagementRouter,
          systemMonitorRouter,
          permissionRouter,
          frameRouter,
          tabsRouter
        ]
      };
    }
  }
]);
