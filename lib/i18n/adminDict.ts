export type AdminLang = "en" | "ja";

export const adminDict = {
  en: {
    // Common
    brandSubtitle: "Admin",
    logout: "Logout",
    allTables: "All Tables",
    orders: "Orders",
    management: "Management",
    tableManagement: "Table Management",
    unknown: "Unknown",

    // Login
    adminDashboard: "Admin Dashboard",
    username: "Username",
    enterUsername: "Enter username",
    password: "Password",
    enterPassword: "Enter password",
    invalidCredentials: "Invalid username or password.",
    somethingWentWrong: "Something went wrong. Please try again.",
    signingIn: "Signing in...",
    signIn: "Sign In",

    // OrderFeed
    pending: "Pending",
    done: "Done",
    markDone: "Mark Done",
    orderManagement: "Order Management",
    liveOrderFeed: "Live order feed · auto-refreshes every 10s",
    newOrders: "New orders",
    completed: "Completed",
    revenue: "Revenue",
    noPendingOrders: "No pending orders",
    noOrdersMatchFilter: "No orders match the filter",
    ordersWillAppear: "Orders will appear here as customers place them",
    showCompleted: "Show completed",
    total: "Total",
    timeAgo: (diff: number) => {
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    },

    // TableManager
    scanToOrder: "Scan to order",
    downloadPng: "Download PNG",
    copy: "Copy",
    tableCount: (count: number) => `${count} ${count === 1 ? "table" : "tables"} configured`,
    addTable: "Add Table",
    addTableDesc: "Each table gets a unique QR code linked to its secret key.",
    tablePlaceholder: "e.g. Table 1, Bar Counter, VIP Room",
    adding: "Adding...",
    add: "Add",
    failedToCreate: "Failed to create table.",
    deleteConfirm: "Delete this table? All associated orders will also be deleted.",
    cancel: "Cancel",
    delete: "Delete",
    noTablesYet: "No tables yet",
    addFirstTable: "Add your first table above to get started",
    qrCode: "View QR Code",
    refresh: "Refresh",
  },
  ja: {
    // Common
    brandSubtitle: "管理",
    logout: "ログアウト",
    allTables: "全テーブル",
    orders: "注文",
    management: "管理",
    tableManagement: "テーブル管理",
    unknown: "不明",

    // Login
    adminDashboard: "管理者ダッシュボード",
    username: "ユーザー名",
    enterUsername: "ユーザー名を入力",
    password: "パスワード",
    enterPassword: "パスワードを入力",
    invalidCredentials: "ユーザー名またはパスワードが正しくありません。",
    somethingWentWrong: "エラーが発生しました。もう一度お試しください。",
    signingIn: "サインイン中...",
    signIn: "サインイン",

    // OrderFeed
    pending: "未対応",
    done: "完了",
    markDone: "完了にする",
    orderManagement: "注文管理",
    liveOrderFeed: "ライブ注文 · 10秒ごとに自動更新",
    newOrders: "新規注文",
    completed: "完了",
    revenue: "売上",
    noPendingOrders: "未対応の注文はありません",
    noOrdersMatchFilter: "フィルターに一致する注文がありません",
    ordersWillAppear: "お客様が注文するとここに表示されます",
    showCompleted: "完了を表示",
    total: "合計",
    timeAgo: (diff: number) => {
      if (diff < 60) return `${diff}秒前`;
      if (diff < 3600) return `${Math.floor(diff / 60)}分前`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`;
      return `${Math.floor(diff / 86400)}日前`;
    },

    // TableManager
    scanToOrder: "注文するにはスキャン",
    downloadPng: "PNG ダウンロード",
    copy: "コピー",
    tableCount: (count: number) => `${count}テーブル設定済み`,
    addTable: "テーブルを追加",
    addTableDesc: "各テーブルにはシークレットキーに紐づいた固有のQRコードが生成されます。",
    tablePlaceholder: "例：テーブル1、バーカウンター、VIPルーム",
    adding: "追加中...",
    add: "追加",
    failedToCreate: "テーブルの作成に失敗しました。",
    deleteConfirm: "このテーブルを削除しますか？関連するすべての注文も削除されます。",
    cancel: "キャンセル",
    delete: "削除",
    noTablesYet: "テーブルがありません",
    addFirstTable: "上のフォームからテーブルを追加してください",
    qrCode: "QRコードを表示",
    refresh: "更新",
  },
};
