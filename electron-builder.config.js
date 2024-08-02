const fs = require('fs');
const path = require('path');

// prod, reg
const buildchannel = process.env.buildchannel || 'reg';
const PLATFORM = process.platform;

function getWindowsCert() {
  if (PLATFORM !== 'win32') return {};

  const selfSignCert = path.resolve(
    __dirname,
    './scripts/code-signing/lux-desktop-ca.pfx'
  );
  const prodCert = path.resolve(
    __dirname,
    './scripts/code-signing/lux-desktop-ca.p12'
  );
  const userProdCert = path.resolve(
    process.env.USERPROFILE,
    './.lux-build/code-signing/lux-desktop-ca.p12'
  );
  // console.debug(`[getWindowsCert] userProdCert is ${userProdCert}`);

  const finalProdCert = fs.existsSync(userProdCert) ? userProdCert : prodCert;

  if (fs.existsSync(finalProdCert)) {
    if (!process.env.RABBY_DESKTOP_CODE_SIGINING_PASS_PROD) {
      // eslint-disable-next-line no-console
      console.warn(
        `[getWindowsCert] RABBY_DESKTOP_CODE_SIGINING_PASS_PROD is not set.`
      );
      return {};
    }

    return {
      certificateFile: finalProdCert,
      certificatePassword: process.env.RABBY_DESKTOP_CODE_SIGINING_PASS_PROD,
    };
  }

  if (!process.env.RABBY_DESKTOP_CODE_SIGINING_PASS) {
    // eslint-disable-next-line no-console
    console.warn(
      `[getWindowsCert] RABBY_DESKTOP_CODE_SIGINING_PASS is not set.`
    );
    return {};
  }

  return {
    certificateFile: selfSignCert,
    certificatePassword: process.env.RABBY_DESKTOP_CODE_SIGINING_PASS,
  };
}

module.exports = {
  productName: 'Rabby Desktop',
  appId: 'com.debank.RabbyDesktop',
  asar: true,
  asarUnpack: '**\\*.{node,dll}',
  copyright: 'Copyright © 2022 lux.link',
  files: ['dist', 'node_modules', 'package.json'],
  afterSign: '.erb/scripts/notarize.js',
  mac: {
    identity: process.env.RABBY_APPLE_IDENTITY_NAME,
    target: {
      target: 'default',
      arch: [process.env.BUILD_ARCH || process.arch],
    },
    type: 'distribution',
    hardenedRuntime: true,
    entitlements: 'assets/entitlements.mac.plist',
    entitlementsInherit: 'assets/entitlements.mac.plist',
    gatekeeperAssess: false,
    extendInfo: {
      NSCameraUsageDescription:
        'Require camera to support QR-based hardware wallet.',
      // "com.apple.security.device.camera": true,
      // "com.apple.security.cs.allow-unsigned-executable-memory": true
    },
  },
  dmg: {
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: 'lux-wallet-desktop-installer-${arch}-${version}.${ext}',
    contents: [
      {
        x: 130,
        y: 220,
      },
      {
        x: 410,
        y: 220,
        type: 'link',
        path: '/Applications',
      },
    ],
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: process.env.BUILD_ARCH || process.arch,
      },
    ],
    verifyUpdateCodeSignature: true,
    signingHashAlgorithms: ['sha256'],
    signDlls: false,
    rfc3161TimeStampServer: 'http://timestamp.comodoca.com/rfc3161',
    ...getWindowsCert(),
  },
  nsis: {
    // eslint-disable-next-line no-template-curly-in-string
    artifactName: 'lux-wallet-desktop-installer-${arch}-${version}.${ext}',
    // eslint-disable-next-line no-template-curly-in-string
    uninstallDisplayName: '${productName}',
    deleteAppDataOnUninstall: true,
    allowToChangeInstallationDirectory: false,
    createDesktopShortcut: true,
  },
  linux: {
    target: ['AppImage'],
    category: 'Development',
  },
  directories: {
    app: 'release/app',
    buildResources: 'assets',
    output: `release/build-${PLATFORM}-\${arch}-${buildchannel}`,
  },
  extraResources: ['./assets/**'],
  publish: [
    {
      provider: 'generic',
      // pointless now
      url: `https://download.rabby.io/wallet-desktop/${PLATFORM}-\${arch}-${buildchannel}/`,
    },
  ],
};
