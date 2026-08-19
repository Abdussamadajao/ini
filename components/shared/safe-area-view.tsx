import { makeStyles } from "@/theme/store/style";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type SafeAreaProps = {
  children?: React.ReactNode;
  style?: object;
  edges?: ["top", "left", "right"];
};

const SafeArea: React.FC<SafeAreaProps> = (props) => {
  const styles = useStyles();
  return (
    <SafeAreaView edges={props.edges} style={[styles.container, props.style]}>
      {props.children ? props.children : null}
    </SafeAreaView>
  );
};

export default SafeArea;

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.screen,
  },
}));
