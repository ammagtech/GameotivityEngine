// @flow
import * as React from 'react';
import { type AuthenticatedUser } from '../../Profile/AuthenticatedUserContext';
import { type FileMetadata, type SaveAsLocation, type SaveAsOptions } from '..';
import {
  CLOUD_PROJECT_NAME_MAX_LENGTH,
  commitVersion,
  commitVersionWithWA,
  createCloudProject,
  createCloudProjectWithWA,
  getCredentialsForCloudProject,
  getCredentialsForCloudProjectWithWA,
  updateCloudProject,
  updateCloudProjectWithWA,
} from '../../Utils/GDevelopServices/Project';
import type { $AxiosError } from 'axios';
import type { MessageDescriptor } from '../../Utils/i18n/MessageDescriptor.flow';
import { serializeToJSON } from '../../Utils/Serializer';
import { t } from '@lingui/macro';
import {
  createZipWithSingleTextFile,
  unzipFirstEntryOfBlob,
} from '../../Utils/Zip.js/Utils';
import ProjectCache from '../../Utils/ProjectCache';
import { getProjectCache } from './CloudProjectOpener';
import { retryIfFailed } from '../../Utils/RetryIfFailed';
import { extractGDevelopApiErrorStatusAndCode } from '../../Utils/GDevelopServices/Errors';
import SaveAsOptionsDialog from '../SaveAsOptionsDialog';

const zipProject = async (project: gdProject): Promise<[Blob, string]> => {
  const projectJson = serializeToJSON(project);
  const zippedProject = await createZipWithSingleTextFile(
    projectJson,
    'game.json'
  );
  return [zippedProject, projectJson];
};

const checkZipContent = async (
  zip: Blob,
  projectJson: string
): Promise<boolean> => {
  try {
    const unzippedProjectJson = await unzipFirstEntryOfBlob(zip);
    return (
      unzippedProjectJson === projectJson && !!JSON.parse(unzippedProjectJson)
    );
  } catch (error) {
    console.error('An error occurred when checking zipped project.', error);
    return false;
  }
};

const zipProjectAndCommitVersion = async ({
  authenticatedUser,
  project,
  cloudProjectId,
  options,
}: {|
  authenticatedUser: AuthenticatedUser,
  project: gdProject,
  cloudProjectId: string,
  options?: {| previousVersion?: string, restoredFromVersionId?: string |},
|}): Promise<?string> => {
  const [zippedProject, projectJson] = await zipProject(project);
  const archiveIsSane = await checkZipContent(zippedProject, projectJson);
  if (!archiveIsSane) {
    throw new Error('Project compression failed before saving the project.');
  }

  const newVersion = await retryIfFailed({ times: 2 }, () =>
    commitVersion({
      authenticatedUser,
      cloudProjectId,
      zippedProject,
      previousVersion: options ? options.previousVersion : null,
      restoredFromVersionId: options ? options.restoredFromVersionId : null,
    })
  );
  return newVersion;
};
const zipProjectAndCommitVersionWithWA = async ({
  walletAddress,
  project,
  cloudProjectId,
  options,
}: {|
  walletAddress: string,
  project: gdProject,
  cloudProjectId: string,
  options?: {| previousVersion?: string, restoredFromVersionId?: string |},
|}): Promise<?string> => {
  const [zippedProject, projectJson] = await zipProject(project);
  const archiveIsSane = await checkZipContent(zippedProject, projectJson);
  if (!archiveIsSane) {
    throw new Error('Project compression failed before saving the project.');
  }

  const newVersion = await retryIfFailed({ times: 2 }, () =>
    commitVersionWithWA({
      walletAddress,
      cloudProjectId,
      zippedProject,
      previousVersion: options ? options.previousVersion : null,
      restoredFromVersionId: options ? options.restoredFromVersionId : null,
    })
  );
  return newVersion;
};

export const generateOnSaveProject = (
  authenticatedUser: AuthenticatedUser
) => async (
  project: gdProject,
  fileMetadata: FileMetadata,
  options?: {| previousVersion?: string, restoredFromVersionId?: string |}
) => {
  const cloudProjectId = fileMetadata.fileIdentifier;
  const gameId = project.getProjectUuid();
  const now = Date.now();

  if (!fileMetadata.gameId) {
    try {
      await updateCloudProject(authenticatedUser, cloudProjectId, {
        gameId,
      });
    } catch (error) {
      console.error('Could not update cloud project with gameId', error);
      // Do not throw, as this is not a blocking error.
    }
  }

  const newVersion = await zipProjectAndCommitVersion({
    authenticatedUser,
    project,
    cloudProjectId,
    options,
  });

  const newFileMetadata: FileMetadata = {
    ...fileMetadata,
    gameId,
    // lastModifiedDate is set here even though it will be set by backend services.
    // Regarding the list of cloud projects in the build section, it should not have
    // an impact since the 2 dates are not used for the same purpose.
    // But it's better to have an up-to-date current file metadata (used by the version
    // history to know when to refresh the most recent version).
    lastModifiedDate: now,
  };

  if (!newVersion) {
    return { wasSaved: false, fileMetadata: newFileMetadata };
  }

  // Save the version being modified in the file metadata, so that it can be
  // used when saving to compare with the last version of the project, and
  // raise a conflict warning if different.
  newFileMetadata.version = newVersion;
  return {
    wasSaved: true,
    fileMetadata: newFileMetadata,
  };
};

export const generateOnSaveProjectWithWA = walletAddress => async (
  project: gdProject,
  fileMetadata: FileMetadata,
  options?: {| previousVersion?: string, restoredFromVersionId?: string |}
) => {
  console.log('started save')
  const cloudProjectId = fileMetadata.fileIdentifier;
  const gameId = project.getProjectUuid();
  console.log('not this')
  const now = Date.now();

  if (!fileMetadata.gameId) {
    try {
      await updateCloudProjectWithWA(walletAddress, cloudProjectId, {
        gameId,
      });
    } catch (error) {
      console.error('Could not update cloud project with gameId', error);
      // Do not throw, as this is not a blocking error.
    }
  }

  const newVersion = await zipProjectAndCommitVersionWithWA({
    walletAddress,
    project,
    cloudProjectId,
    options,
  });

  const newFileMetadata: FileMetadata = {
    ...fileMetadata,
    gameId,
    // lastModifiedDate is set here even though it will be set by backend services.
    // Regarding the list of cloud projects in the build section, it should not have
    // an impact since the 2 dates are not used for the same purpose.
    // But it's better to have an up-to-date current file metadata (used by the version
    // history to know when to refresh the most recent version).
    lastModifiedDate: now,
  };

  if (!newVersion) {
    return { wasSaved: false, fileMetadata: newFileMetadata };
  }

  // Save the version being modified in the file metadata, so that it can be
  // used when saving to compare with the last version of the project, and
  // raise a conflict warning if different.
  newFileMetadata.version = newVersion;
  return {
    wasSaved: true,
    fileMetadata: newFileMetadata,
  };
};

export const generateOnChangeProjectProperty = (
  authenticatedUser: AuthenticatedUser
) => async (
  project: gdProject,
  fileMetadata: FileMetadata,
  properties: {| name?: string, gameId?: string |}
): Promise<null | {| version: string, lastModifiedDate: number |}> => {
  if (!authenticatedUser.authenticated) return null;
  try {
    await updateCloudProject(
      authenticatedUser,
      fileMetadata.fileIdentifier,
      properties
    );
    const newVersion = await zipProjectAndCommitVersion({
      authenticatedUser,
      project,
      cloudProjectId: fileMetadata.fileIdentifier,
    });
    if (!newVersion) {
      throw new Error("Couldn't save project following property update.");
    }

    return { version: newVersion, lastModifiedDate: Date.now() };
  } catch (error) {
    // TODO: Determine if a feedback should be given to user so that they can try again if necessary.
    console.warn(
      'An error occurred while changing cloud project name. Ignoring.',
      error
    );
    return null;
  }
};

export const generateOnChangeProjectPropertyWithWA = walletAddress => async (
  project: gdProject,
  fileMetadata: FileMetadata,
  properties: {| name?: string, gameId?: string |}
): Promise<null | {| version: string, lastModifiedDate: number |}> => {
  if (!walletAddress) return null;
  try {
    await updateCloudProjectWithWA(
      walletAddress,
      fileMetadata.fileIdentifier,
      properties
    );
    const newVersion = await zipProjectAndCommitVersionWithWA({
      walletAddress,
      project,
      cloudProjectId: fileMetadata.fileIdentifier,
    });
    if (!newVersion) {
      throw new Error("Couldn't save project following property update.");
    }

    return { version: newVersion, lastModifiedDate: Date.now() };
  } catch (error) {
    // TODO: Determine if a feedback should be given to user so that they can try again if necessary.
    console.warn(
      'An error occurred while changing cloud project name. Ignoring.',
      error
    );
    return null;
  }
};

export const getWriteErrorMessage = (
  error: Error | $AxiosError<any>
): MessageDescriptor => {
  const extractedStatusAndCode = extractGDevelopApiErrorStatusAndCode(error);
  if (
    extractedStatusAndCode &&
    extractedStatusAndCode.code === 'project-creation/too-many-projects'
  ) {
    return t`You've reached the limit of cloud projects you can have. Delete some existing cloud projects of yours before trying again.`;
  }
  return t`An error occurred when saving the project, please verify your internet connection or try again later.`;
};

export const generateOnChooseSaveProjectAsLocation = ({
  authenticatedUser,
  setDialog,
  closeDialog,
}: {|
  authenticatedUser: AuthenticatedUser,
  setDialog: (() => React.Node) => void,
  closeDialog: () => void,
|}) => async ({
  project,
  fileMetadata,
  displayOptionToGenerateNewProjectUuid,
}: {|
  project: gdProject,
  fileMetadata: ?FileMetadata,
  displayOptionToGenerateNewProjectUuid: boolean,
|}): Promise<{|
  saveAsLocation: ?SaveAsLocation,
  saveAsOptions: ?SaveAsOptions,
|}> => {
  if (!authenticatedUser.authenticated) {
    return { saveAsLocation: null, saveAsOptions: null };
  }

  const options = await new Promise(resolve => {
    setDialog(() => (
      <SaveAsOptionsDialog
        onCancel={() => {
          closeDialog();
          resolve(null);
        }}
        nameMaxLength={CLOUD_PROJECT_NAME_MAX_LENGTH}
        nameSuggestion={
          fileMetadata ? `${project.getName()} - Copy` : project.getName()
        }
        displayOptionToGenerateNewProjectUuid={
          displayOptionToGenerateNewProjectUuid
        }
        onSave={options => {
          closeDialog();
          resolve(options);
        }}
      />
    ));
  });

  if (!options) return { saveAsLocation: null, saveAsOptions: null }; // Save was cancelled.

  return {
    saveAsLocation: {
      name: options.name,
    },
    saveAsOptions: {
      generateNewProjectUuid: options.generateNewProjectUuid,
    },
  };
};

export const generateOnChooseSaveProjectAsLocationWithWA = ({
  walletAddress,
  setDialog,
  closeDialog,
}: {|
  walletAddress: string,
  setDialog: (() => React.Node) => void,
  closeDialog: () => void,
|}) => async ({
  project,
  fileMetadata,
  displayOptionToGenerateNewProjectUuid,
}: {|
  project: gdProject,
  fileMetadata: ?FileMetadata,
  displayOptionToGenerateNewProjectUuid: boolean,
|}): Promise<{|
  saveAsLocation: ?SaveAsLocation,
  saveAsOptions: ?SaveAsOptions,
|}> => {
  // mysticx: Look here if something's not working comment this check
  if (!walletAddress) {
    return { saveAsLocation: null, saveAsOptions: null };
  }

  const options = await new Promise(resolve => {
    setDialog(() => (
      <SaveAsOptionsDialog
        onCancel={() => {
          closeDialog();
          resolve(null);
        }}
        nameMaxLength={CLOUD_PROJECT_NAME_MAX_LENGTH}
        nameSuggestion={
          fileMetadata ? `${project.getName()} - Copy` : project.getName()
        }
        displayOptionToGenerateNewProjectUuid={
          displayOptionToGenerateNewProjectUuid
        }
        onSave={options => {
          closeDialog();
          resolve(options);
        }}
      />
    ));
  });

  if (!options) return { saveAsLocation: null, saveAsOptions: null }; // Save was cancelled.

  return {
    saveAsLocation: {
      name: options.name,
    },
    saveAsOptions: {
      generateNewProjectUuid: options.generateNewProjectUuid,
    },
  };
};

export const generateOnSaveProjectAs = (
  authenticatedUser: AuthenticatedUser,
  setDialog: (() => React.Node) => void,
  closeDialog: () => void
) => async (
  project: gdProject,
  saveAsLocation: ?SaveAsLocation,
  options: {|
    onStartSaving: () => void,
    onMoveResources: ({|
      newFileMetadata: FileMetadata,
    |}) => Promise<void>,
  |}
) => {
  if (!saveAsLocation)
    throw new Error('A location was not chosen before saving as.');
  const { name } = saveAsLocation;
  if (!name) throw new Error('A name was not chosen before saving as.');
  if (!authenticatedUser.authenticated) {
    return { wasSaved: false, fileMetadata: null };
  }
  options.onStartSaving();

  const gameId = project.getProjectUuid();

  try {
    // Create a new cloud project.
    const cloudProject = await createCloudProject(authenticatedUser, {
      name,
      gameId,
    });
    console.log('created project: ', cloudProject);
    if (!cloudProject)
      throw new Error('No cloud project was returned from creation api call.');
    const cloudProjectId = cloudProject.id;

    const fileMetadata: FileMetadata = {
      fileIdentifier: cloudProjectId,
      gameId,
    };

    // Move the resources to the new project.
    await options.onMoveResources({ newFileMetadata: fileMetadata });
    console.log('getting creds for proj');
    // Commit the changes to the newly created cloud project.
    await getCredentialsForCloudProject(authenticatedUser, cloudProjectId);
    console.log('zipping proj and commiting version');

    const newVersion = await zipProjectAndCommitVersion({
      authenticatedUser,
      project,
      cloudProjectId,
    });
    console.log('zipped and versioned', newVersion);

    if (!newVersion)
      throw new Error('No version id was returned from committing api call.');

    // Save the version being modified in the file metadata, so that it can be
    // used when saving to compare with the last version of the project, and
    // raise a conflict warning if different.
    fileMetadata.version = newVersion;

    return {
      wasSaved: true,
      fileMetadata,
    };
  } catch (error) {
    console.error('An error occurred while creating a cloud project', error);
    throw error;
  }
};
export const generateOnSaveProjectAsWithWA = (
  walletAddress,
  setDialog,
  closeDialog
) => async (
  project: gdProject,
  saveAsLocation: ?SaveAsLocation,
  options: {|
    onStartSaving: () => void,
    onMoveResources: ({|
      newFileMetadata: FileMetadata,
    |}) => Promise<void>,
  |}
) => {
  if (!saveAsLocation)
    throw new Error('A location was not chosen before saving as.');
  const { name } = saveAsLocation;
  if (!name) throw new Error('A name was not chosen before saving as.');
  // mysticx: Look here if something's not working comment this check
  if (!walletAddress) {
    return { wasSaved: false, fileMetadata: null };
  }
  options.onStartSaving();

  const gameId = project.getProjectUuid();

  try {
    // Create a new cloud project.
    const cloudProject = await createCloudProjectWithWA(walletAddress, {
      name,
      gameId,
    });
    console.log('created project: ', cloudProject);
    if (!cloudProject)
      throw new Error('No cloud project was returned from creation api call.');
    const cloudProjectId = cloudProject.id;

    const fileMetadata: FileMetadata = {
      fileIdentifier: cloudProjectId,
      gameId,
    };
    console.log('save till here')
    // Move the resources to the new project.
    await options.onMoveResources({ newFileMetadata: fileMetadata });
    console.log('now zippinng');
    // Commit the changes to the newly created cloud project.
    await getCredentialsForCloudProjectWithWA(walletAddress, cloudProjectId);
    console.log('zipping proj and commiting version');

    const newVersion = await zipProjectAndCommitVersionWithWA({
      walletAddress,
      project,
      cloudProjectId,
    });
    console.log('zipped and versioned', newVersion);

    if (!newVersion)
      throw new Error('No version id was returned from committing api call.');

    // Save the version being modified in the file metadata, so that it can be
    // used when saving to compare with the last version of the project, and
    // raise a conflict warning if different.
    fileMetadata.version = newVersion;

    return {
      wasSaved: true,
      fileMetadata,
    };
  } catch (error) {
    console.error('An error occurred while creating a cloud project', error);
    throw error;
  }
};

export const getProjectLocation = ({
  projectName,
  saveAsLocation,
  newProjectsDefaultFolder,
}: {|
  projectName: string,
  saveAsLocation: ?SaveAsLocation,
  newProjectsDefaultFolder?: string,
|}): SaveAsLocation => {
  return {
    name: projectName,
  };
};

export const renderNewProjectSaveAsLocationChooser = ({
  projectName,
  saveAsLocation,
  setSaveAsLocation,
  newProjectsDefaultFolder,
}: {|
  projectName: string,
  saveAsLocation: ?SaveAsLocation,
  setSaveAsLocation: (?SaveAsLocation) => void,
  newProjectsDefaultFolder?: string,
|}) => {
  if (!saveAsLocation || saveAsLocation.name !== projectName) {
    setSaveAsLocation(
      getProjectLocation({
        projectName,
        saveAsLocation,
        newProjectsDefaultFolder,
      })
    );
  }
  return null;
};
export const generateOnAutoSaveProject = (
  authenticatedUser: AuthenticatedUser
) =>
  ProjectCache.isAvailable()
    ? async (project: gdProject, fileMetadata: FileMetadata): Promise<void> => {
        const { profile } = authenticatedUser;
        if (!profile) return;
        const cloudProjectId = fileMetadata.fileIdentifier;
        const projectCache = getProjectCache();
        projectCache.put(
          {
            userId: profile.id,
            cloudProjectId,
          },
          project
        );
      }
    : undefined;

export const generateOnAutoSaveProjectWithWA = walletAddress =>
  ProjectCache.isAvailable()
    ? async (project: gdProject, fileMetadata: FileMetadata): Promise<void> => {
        if (!walletAddress) return;
        const cloudProjectId = fileMetadata.fileIdentifier;
        const projectCache = getProjectCache();
        projectCache.put(
          {
            userId: walletAddress,
            cloudProjectId,
          },
          project
        );
      }
    : undefined;
