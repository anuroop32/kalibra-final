import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { UIHelper as uh } from '../../core';

//props
interface ITextAgreementLinkProps extends ViewProps {
  goToPage: (url: string) => void;
}

const TextAgreementLink = (props: ITextAgreementLinkProps) => {
  //style
  const th = useTheme();
  const styleContainer = StyleSheet.create({
    textCenter: { alignItems: 'center' },
    clickBtn: { alignSelf: 'center' },
    textAlign: { textAlign: 'center' },
    agreementText: {
      marginTop: uh.h2DP(8),
      marginBottom: uh.h2DP(20),
      textAlign: 'center'
    },
    agreementLink: {
      color: th['color-primary-500']
    }
  });

  //view
  return (
    <View style={[props.style]}>
      <Text style={styleContainer.agreementText} category="c2" appearance="hint">
        By signing up you agree to our
        <Text
          category="c2"
          appearance="hint"
          onPress={() => props.goToPage('https://kalibra.health/terms')}
          style={styleContainer.agreementLink}
        >
          {' '}
          terms of use{' '}
        </Text>{' '}
        and
        <Text
          category="c2"
          appearance="hint"
          onPress={() => {
            props.goToPage('https://kalibra.health/privacy');
          }}
          style={styleContainer.agreementLink}
        >
          {' '}
          privacy policy
        </Text>{' '}
      </Text>
    </View>
  );
};

export default TextAgreementLink;
