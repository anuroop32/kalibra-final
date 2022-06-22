import React, { memo, useEffect, useState } from 'react';

interface Props {
  source: any;
  width?: number | string;
  height?: number | string;
  fill?: string;
  replace: any;
  className?: string;
}
//eslint-disable-next-line
const regBase64 = /^(.+)\,(.+)$/;
//eslint-disable-next-line
const regPropReplace = /^s*{s*([a-zA-Z0-9]*).?([a-zA-Z0-9]+)s*}s*$/;
//eslint-disable-next-line
const Index = memo(({ source: orsource, replace, ...rest }: Props) => {
  const { width, height, className } = {
    width: 'auto',
    height: 'auto',
    ...rest
  };

  const [xml, setXml] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  const xmlToBase64 = (xmlData: string) => {
    let nxml = xmlData;

    for (const key in replace) {
      let value = replace[key];

      if (regPropReplace.test(value)) {
        value = (rest as any)[value.replace(regPropReplace, '$2')];
        if (value == undefined) break;
      }
      //eslint-disable-next-line
      nxml = nxml.replace(new RegExp(`([a-z-A-Z0-9\-\_]+="|')(${key})("|')`, 'g'), `$1${value}$3`);
    }

    return `data:image/svg+xml;base64,${btoa(nxml)}`;
  };

  useEffect(() => {
    if (!source) {
      if (typeof orsource == 'string') {
        setSource(orsource);
      } else {
        orsource.then((sourceData: any) => setSource(sourceData.default));
      }
    } else {
      const ab = new AbortController();

      if (regBase64.test(source)) {
        setXml(atob(source.replace(regBase64, '$2')));
      } else {
        fetch(source, { signal: ab.signal })
          .then((res) => res.text())
          .then((strXml) => setXml(strXml))
          .catch((e) => console.error(e));
      }

      return () => {
        ab.abort();
      };
    }
    //eslint-disable-next-line
  }, [source]);

  return xml ? <img className={className} width={width} height={height} src={xmlToBase64(xml)} /> : null;
});

export default (svgrrc: any) => {
  const { replaceAttrValues } = svgrrc;

  return (source: string) => {
    //eslint-disable-next-line
    return (props: any) => <Index {...props} replace={replaceAttrValues} source={source} />;
  };
};
