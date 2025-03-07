// @flow
import Window from '../Window';

const isDev = Window.isDev();

export const GDevelopGamePreviews = {
  // baseUrl: `https://game-previews.gdevelop.io/`,
  baseUrl: `https://gameotivity-test-games-preview.s3.eu-central-1.amazonaws.com/`,
};
export const TelegramGameBucket = {
  baseUrl: `https://gameotivity-test-games-telegram.s3.eu-central-1.amazonaws.com/`,
};
export const PublishGameBucket = {
  baseUrl: `https://gameotivity-test-games-publish.s3.eu-central-1.amazonaws.com/`,
};

export const ProjectAssetsBucketUrl = {
  baseUrl: `https://gameotivity-test-games-projects.s3.eu-central-1.amazonaws.com/`,
};


export const GDevelopGamesPlatform = {
  getInstantBuildUrl: (buildId: string) =>
    isDev
      ? `https://gd.games/instant-builds/${buildId}?dev=true`
      : `https://gd.games/instant-builds/${buildId}`,
  getGameUrl: (gameId: string) =>
    isDev
      ? `https://gd.games/games/${gameId}?dev=true`
      : `https://gd.games/games/${gameId}`,
  getGameUrlWithSlug: (userSlug: string, gameSlug: string) =>
    isDev
      ? `https://gd.games/${userSlug.toLowerCase()}/${gameSlug.toLowerCase()}?dev=true`
      : `https://gd.games/${userSlug.toLowerCase()}/${gameSlug.toLowerCase()}`,
  getUserPublicProfileUrl: (userId: string, username: ?string) =>
    username
      ? `https://gd.games/${username}${isDev ? '?dev=true' : ''}`
      : `https://gd.games/user/${userId}${isDev ? '?dev=true' : ''}`,
};

export const GDevelopFirebaseConfig = {
  apiKey: 'AIzaSyAnX9QMacrIl3yo4zkVFEVhDppGVDDewBc',
  authDomain: 'gdevelop-services.firebaseapp.com',
  databaseURL: 'https://gdevelop-services.firebaseio.com',
  projectId: 'gdevelop-services',
  storageBucket: 'gdevelop-services.appspot.com',
  messagingSenderId: '44882707384',
};
// export const GDevelopFirebaseConfig = {
//   apiKey: "AIzaSyDPZpyJUeGv3YXrbcpSpSB-6KgmaXuxIG0",
//   authDomain: "juke-294714.firebaseapp.com",
//   databaseURL: "https://juke-294714-default-rtdb.firebaseio.com",
//   projectId: "juke-294714",
//   storageBucket: "juke-294714.firebasestorage.app",
//   messagingSenderId: "532299207615",
//   appId: "1:532299207615:web:1dac0fecb5c614a30cc70a",
//   measurementId: "G-LYDYFGV6MC"
// };

export const GDevelopAuthorizationWebSocketApi = {
  baseUrl: isDev
    ? 'wss://api-ws-dev.gdevelop.io/authorization'
    : 'wss://api-ws.gdevelop.io/authorization',
};

export const GDevelopBuildApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/build'
    : 'https://gdcorebypassbe.ammag.tech/build',
};

export const GDevelopUsageApi = {
  baseUrl: isDev
    ? 'https://gameotivity-preview-be.ammag.tech/usage' // 'https://api-dev.gdevelop.io/usage'
    : 'https://gameotivity-preview-be.ammag.tech/usage', // 'https://gdcorebypassbe.ammag.tech/usage'
};

export const TelegramApi = {
  baseUrl: isDev
    ? 'https://gameotivity-preview-be.ammag.tech/telegram'
    : 'https://gameotivity-preview-be.ammag.tech/telegram',
};

export const ProjectApi = {
  baseUrl: isDev
    ? 'https://gameotivity-preview-be.ammag.tech/project'
    : 'https://gameotivity-preview-be.ammag.tech/project',
};

export const GDevelopReleaseApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/release'
    : 'https://gdcorebypassbe.ammag.tech/release',
};

export const GDevelopAssetApi = {
  baseUrl: isDev
    ? 'https://gameotivity-preview-be.ammag.tech/asset'
    : 'https://gameotivity-preview-be.ammag.tech/asset',
};

export const GDevelopAnalyticsApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/analytics'
    : 'https://gdcorebypassbe.ammag.tech/analytics',
};

export const GDevelopGameApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/game'
    : 'https://gdcorebypassbe.ammag.tech/game',
};

export const GDevelopUserApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/user'
    : 'https://gdcorebypassbe.ammag.tech/user',
};

export const GDevelopPlayApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/play'
    : 'https://gdcorebypassbe.ammag.tech/play',
};

export const GDevelopShopApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/shoptemp'
    : 'https://gdcorebypassbe.ammag.tech/shoptemp',
};

export const GDevelopProjectApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/project'
    : 'https://gdcorebypassbe.ammag.tech/project',
};

export const GDevelopGenerationApi = {
  baseUrl: isDev
    ? 'https://gdcorebypassbe.ammag.tech/generation'
    : 'https://gdcorebypassbe.ammag.tech/generation',
};

export const GDevelopProjectResourcesStorage = {
  baseUrl: isDev
    ? 'https://project-resources-dev.gdevelop.io'
    : 'https://project-resources.gdevelop.io',
};

export const GDevelopPrivateAssetsStorage = {
  baseUrl: isDev
    ? 'https://private-assets-dev.gdevelop.io'
    : 'https://private-assets.gdevelop.io',
};

export const GDevelopPrivateGameTemplatesStorage = {
  baseUrl: isDev
    ? 'https://private-game-templates-dev.gdevelop.io'
    : 'https://private-game-templates.gdevelop.io',
};

export const GDevelopPublicAssetResourcesStorageBaseUrl =
  'https://asset-resources.gdevelop.io';
export const GDevelopPublicAssetResourcesStorageStagingBaseUrl =
  'https://asset-resources.gdevelop.io/staging';
