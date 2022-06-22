import React, { memo } from 'react';

import { Platform } from 'react-native';

import Markdown, { MarkdownIt } from 'react-native-markdown-display';

const onLinkPress = (url: string): boolean => {
  if (url) {
    if (Platform.OS === 'web') {
      // Open link in new tab
      window.open(url, '_blank');
      return false;
    }
  }
  // return true to open with 'Linking.openURL(url)'
  return true;
};

declare type Props = React.ComponentProps<typeof Markdown> & {
  children: React.ReactNode;
};

const MarkdownText = ({ children, style, ...props }: Props) => {
  // Don't display empty (including only whitespace) paragraphs
  if (!children || children?.toString()?.trim()?.length === 0) {
    return null;
  }

  return (
    <Markdown
      markdownit={MarkdownIt({
        html: true, // Allow HTML syntax
        linkify: true // Create hyperlink for URLs in text without HTML or Markdown syntax
      })}
      onLinkPress={onLinkPress}
      style={style}
      {...props}
      mergeStyle={true}
    >
      {children}
    </Markdown>
  );
};

export default memo(MarkdownText);
