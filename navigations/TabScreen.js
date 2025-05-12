
import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import { Feather,MaterialIcons ,Ionicons} from '@expo/vector-icons';
import StaffSetting from "../screens/StaffSetting";
import ViewProfile from "../screens/ViewProfile";

const Tabs = AnimatedTabBarNavigator();

export default function TabScreen(props){




    return(

       
      <Tabs.Navigator
      tabBarOptions={{
        activeTintColor: "#000",
        inactiveTintColor: "#222222",
        activeBackgroundColor:'#EEE',
      }}

      appearance={{
       dotSize:"compact",
       shadow:true,
       topPadding:20,
       bottomPadding:25,
       tabBarBackground:"#fff"
       
    
      }}

      
      
        >






          </Tabs.Navigator>
          
 
    )

}