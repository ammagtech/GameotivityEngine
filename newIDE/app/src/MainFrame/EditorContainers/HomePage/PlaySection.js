// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import SectionContainer, { SectionRow } from './SectionContainer';
import GDevelopThemeContext from '../../../UI/Theme/GDevelopThemeContext';
import PlaceHolderLoader from '../../../UI/PlaceholderLoader';
import ErrorBoundary from '../../../UI/ErrorBoundary';
import PromotionsSlideshow from '../../../Promotions/PromotionsSlideshow';
import { AnnouncementsFeed } from '../../../AnnouncementsFeed';
import { ColumnStackLayout } from '../../../UI/Layout';
import GamesList from './PublishedGames/GamesList';
import { Spacer } from '../../../UI/Grid';
import Text from '../../../UI/Text';

const styles = {
  iframe: {
    border: 0,
  },
};

const PlaySection = () => {
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const paletteType = gdevelopTheme.palette.type;
  const [iframeHeight, setIframeHeight] = React.useState(null);
  const [loading, setloading] = React.useState(true)

  // window.addEventListener('message', event => {
  //   if (
  //     event.origin === 'https://gd.games' &&
  //     event.data.id === 'set-embedded-height'
  //   ) {
  //     setIframeHeight(event.data.height);
  //   }
  // });

  return (
    <SectionContainer flexBody>
      <SectionRow expand>
        <ColumnStackLayout noMargin>
        <Trans>
          <Text>
            <h1>Play</h1>
            <p>Play games created by the community.</p>
          </Text>
        </Trans>
        <Spacer />
          <GamesList setloading={(state) => setloading(state)} />
          {/* <PromotionsSlideshow /> */}
          {/* <AnnouncementsFeed canClose={false} level="normal" /> */}
          {/* <iframe
            src={`https://gd.games/embedded/${paletteType}`}
            title="gdgames"
            style={{ ...styles.iframe, height: iframeHeight }}
            scrolling="no" // This is deprecated, but this is the only way to disable the scrollbar.
          /> */}
          {/* {!iframeHeight && <PlaceHolderLoader />} */}
          {loading && <PlaceHolderLoader />}
        </ColumnStackLayout>
      </SectionRow>
    </SectionContainer>
  );
};

const PlaySectionWithErrorBoundary = () => (
  <ErrorBoundary
    componentTitle={<Trans>Play section</Trans>}
    scope="start-page-play"
  >
    <PlaySection />
  </ErrorBoundary>
);

export default PlaySectionWithErrorBoundary;
