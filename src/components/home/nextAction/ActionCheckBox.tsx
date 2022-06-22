import { Text, useTheme, Layout, CheckBox } from '@ui-kitten/components';
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { UIHelper as uh, Pillar, AppContext } from '../../../core';
import PillarIcon from '../PillarIcon';
// import { HomeIcons } from '../HomeIcons';
import { BackendApi } from 'src/api/shared';

//props
interface IActionCheckBoxProps extends ViewProps {
  actionName: string;
  id: string;
  checked: boolean;
  pillars?: Array<Pillar>;
  description?: string; // this one can be text or string of text and number. For example :'afternoon' or '1 / 5 times'
  actionHandler: () => void;
  forceReload: () => void;
}

const ActionCheckBox = (props: IActionCheckBoxProps) => {
  const [activeChecked, setActiveChecked] = React.useState(props.checked);
  const th = useTheme();
  const appContext = React.useContext(AppContext);

  // styles
  const styles = StyleSheet.create({
    container: {
      padding: uh.h2DP(16),
      borderColor: th['border-basic-color-3'],
      borderWidth: 1,
      borderRadius: 8
    },
    checkBoxLine: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    description: {
      marginLeft: uh.w2DP(32)
    },
    actionName: {
      marginTop: uh.h2DP(4),
      marginBottom: uh.h2DP(4),
      flex: 1,
      textDecorationLine: activeChecked == true ? 'line-through' : 'none'
    },
    pillarContainer: {
      flexDirection: 'row',
      marginLeft: uh.w2DP(32),
      marginRight: uh.h2DP(26),
      flexWrap: 'wrap'
    },
    pillar: {
      marginTop: uh.h2DP(8),
      marginRight: uh.h2DP(4)
    },
    rightIcon: {
      width: 20,
      height: 20,
      marginLeft: uh.w2DP(50)
    }
  });

  // render list of pillars
  const renderPillars = () => {
    if (props.pillars != undefined) {
      return props.pillars.map((item, index) => {
        return (
          <PillarIcon key={`pillar-${index}`} style={styles.pillar} name={item.name} type={item.type} size={'small'} />
        );
      });
    }
  };

  const completeAction = async (nextChecked: boolean) => {
    setActiveChecked(nextChecked);
    const actionItems = appContext.getActionItems();
    const index = actionItems.findIndex((item) => item.id == props.id);
    actionItems[index].userCompleted = nextChecked;
    appContext.setActionItems(actionItems);
    const response = await BackendApi.put(`/surveys/action-item/${props.id}`, {
      completed: nextChecked
    });
    if (response.status >= 200 && response.status <= 399) {
      // load next action
      setTimeout(() => {
        props.forceReload();
      }, 600);
    }
  };

  // view
  return (
    <Layout style={[props.style, styles.container]}>
      <View style={styles.checkBoxLine}>
        <CheckBox
          style={{ marginRight: uh.h2DP(16), marginLeft: uh.h2DP(0) }}
          checked={activeChecked}
          onChange={(nextChecked) => completeAction(nextChecked)}
        />
        <Text style={styles.actionName}>{props.actionName}</Text>
        {/* <TouchableOpacity onPress={props.actionHandler}>
          <HomeIcons.ForwardIcon style={styles.rightIcon} fill={th['color-basic-600']} />
        </TouchableOpacity> */}
      </View>
      {props.description != undefined && (
        <Text category="c1" appearance="hint" style={styles.description}>
          {props.description}
        </Text>
      )}

      <View style={styles.pillarContainer}>{renderPillars()}</View>
    </Layout>
  );
};

export default ActionCheckBox;
