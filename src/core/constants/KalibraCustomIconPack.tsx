/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { Image, ImageRequireSource } from 'react-native';

/**
 * https://akveo.github.io/react-native-ui-kitten/docs/guides/icon-packages#3rd-party-icon-packages
 */

const IconProviderWeb = (source: ImageRequireSource) => ({
  toReactElement: (props: any) => {
    return <Image {...props} resizeMode="contain" source={source} />;
  }
});

// TODO: Add HealthIcons here if not SVG
export const KalibraCustomIconPack = {
  name: 'kalibraCustomIconPack',
  icons: {
    'apple-light': IconProviderWeb(require('../../../assets/images/icon-apple.png')),
    nourish: IconProviderWeb(require('../../../assets/images/nourish.png')),
    move: IconProviderWeb(require('../../../assets/images/move.png')),
    connect: IconProviderWeb(require('../../../assets/images/connect.png')),
    reflect: IconProviderWeb(require('../../../assets/images/reflect.png')),
    grow: IconProviderWeb(require('../../../assets/images/grow.png')),
    rest: IconProviderWeb(require('../../../assets/images/rest.png')),
    loading: IconProviderWeb(require('../../../assets/images/loading.png')),
    'apple-watch': IconProviderWeb(require('../../../assets/images/apple-watch.png')),
    headspace: IconProviderWeb(require('../../../assets/images/headspace.png'))
  }
};
