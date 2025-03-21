// @flow
import * as React from 'react';

import { Trans, t } from '@lingui/macro';
import { type AuthenticatedUser } from '../../Profile/AuthenticatedUserContext';
import { type ResourcesActionsProps } from '../../ProjectsStorage';
import optionalRequire from '../../Utils/OptionalRequire';
import { downloadUrlsToLocalFiles } from '../../Utils/LocalFileDownloader';
import Window from '../../Utils/Window';
import ResourcesLoader from '../../ResourcesLoader';

const path = optionalRequire('path');
// It's important to use remote and not electron for folder actions,
// otherwise they will be opened in the background.
// See https://github.com/electron/electron/issues/4349#issuecomment-777475765
const remote = optionalRequire('@electron/remote');
const shell = remote ? remote.shell : null;
const app = remote ? remote.app : null;

export const generateGetResourceActions = ({
  authenticatedUser,
}: {
  authenticatedUser: AuthenticatedUser,
}) => ({
  project,
  resource,
  i18n,
  fileMetadata,
  informUser,
}: ResourcesActionsProps) => {
  const openLabel =
    app && path
      ? t`Save in the "Downloads" folder`
      : t`Open resource in browser`;

  const openOrDownloadResource = async ({
    askUserForDownloadDestination,
  }: {
    askUserForDownloadDestination: boolean,
  }) => {
    let resourceUrl = ResourcesLoader.getResourceFullUrl(
      project,
      resource.getName(),
      {}
    );
    if (app && path && shell) {
      const defaultPath = path.join(
        app.getPath('downloads'),
        resource.getName()
      );
      let targetPath;
      if (askUserForDownloadDestination) {
        targetPath = remote.dialog.showSaveDialogSync(null, {
          defaultPath: defaultPath,
          properties: ['createDirectory', 'showOverwriteConfirmation'],
        });
        if (!targetPath) return;
      } else {
        targetPath = defaultPath;
      }
      await downloadUrlsToLocalFiles({
        urlContainers: [
          {
            url: resourceUrl,
            filePath: targetPath,
          },
        ],
        onProgress: () => {},
        throwIfAnyError: false,
      });
      informUser({
        actionLabel: <Trans>Open folder</Trans>,
        message: <Trans>The resource has been downloaded</Trans>,
        onActionClick: () => shell.showItemInFolder(path.resolve(targetPath)),
      });
    } else {
      Window.openExternalURL(resourceUrl);
    }
  };

  const actions = [
    {
      label: i18n._(openLabel),
      click: () =>
        openOrDownloadResource({ askUserForDownloadDestination: false }),
    },
  ];

  if (app && path) {
    actions.push({
      label: i18n._(t`Save as...`),
      click: () =>
        openOrDownloadResource({ askUserForDownloadDestination: true }),
    });
  }
  return actions;
};
