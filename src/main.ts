import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {Upload,Button,Card,List,Checkbox,Radio,Spin,Tabs} from 'ant-design-vue'

const app = createApp(App)

app.component(Upload.name,Upload)
  .component(Button.name,Button)
  .component(Card.name,Card)
  .component(List.name,List)
  .component(Checkbox.name,Checkbox)
  .component(Radio.name,Radio)
  .component(Spin.name,Spin)
  .component(Tabs.name,Tabs)

app
  .use(router)
  .mount('#app')
